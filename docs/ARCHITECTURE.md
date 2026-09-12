# Architecture Technique — PID
> Rédigé par : Software Architect (Agent #2) — Pipeline IT
> Date : 2026-09-12
> Source : `docs/FOUNDATION.md` (§3, §5, §7, §10), `docs/USER-STORIES.md` (25 US), `.specify/memory/constitution.md`
> Portée : affine le schéma BDD et les contrats déjà esquissés en FOUNDATION §10 pour auth-comptes, generateur-devis, devis-contrat ; complète l'architecture pour vitrine-portfolio et administration-comptes (non détaillées au niveau 3 du brainstorm).

---

## 0. Résumé des décisions structurantes

| Point ouvert (FOUNDATION §12) | Décision | Statut |
|---|---|---|
| Breeze vs Fortify | **Laravel Fortify** | Tranché ci-dessous (§1.1) |
| Format devis=contrat : PDF vs HTML | **PDF** (barryvdh/laravel-dompdf) | Tranché ci-dessous (§1.2) |
| Auth session vs token API (Sanctum) | **Session Laravel + CSRF** (pas de Sanctum) | Tranché ci-dessous (§1.3) |
| Convention de routes `/api/v1/` (standard global CLAUDE.md) | **Non appliquée** — routes web classiques + préfixe `/ajax/` pour les appels XHR, cohérent avec les contrats déjà rédigés en FOUNDATION §10 | Justifié ci-dessous (§1.3) |
| Onboarding tarifaire vide (FOUNDATION §11.4, non couvert par une US formelle) | **Seeders de valeurs par défaut** (types de prestation + paramètres tarifaires) livrés avec les migrations | Tranché ci-dessous (§1.4) |
| Priorisation P0/P1/P2 du PO | **Non tranchée par l'Architecte** — hors périmètre architecture, reste à valider par mentalyas comme signalé par le PO | Hors scope |
| Hébergement / CI-CD | **Non traité** — relève de l'Agent #8 DevOps (Phase 5) | Hors scope |

---

## 1. Décisions technologiques justifiées

### 1.1 Authentification : Fortify plutôt que Breeze

**Contexte** : le cours impose un frontend HTML5/CSS3/JS+jQuery/AJAX (FOUNDATION §5) — pas de Blade scaffolding réactif, pas d'Inertia/Livewire. Les contrats déjà rédigés en FOUNDATION §10.1 exposent des endpoints AJAX dédiés (`/ajax/check-email`) et une redirection post-connexion différenciée par rôle (3 espaces distincts, US-AUTH-03).

**Analyse** :
- **Breeze** scaffold des vues Blade (ou stacks Vue/React) complètes et opinionated. Avec un frontend jQuery/AJAX imposé, ce scaffolding serait démonté immédiatement après génération — Breeze n'apporte alors aucune valeur, seulement du code à supprimer.
- **Fortify** est *headless* par conception : il fournit les routes et la logique métier (classes `Actions\Fortify\*`, entièrement publiées dans `app/`, donc lisibles et documentables — Constitution Principe II) mais laisse 100% la main sur les vues. C'est exactement le contrat dont ce projet a besoin : vues HTML/jQuery custom + backend Laravel géré par Fortify.
- Fortify expose des points d'extension directement utiles ici : `Fortify::authenticateUsing()` pour injecter la logique métier du verrouillage (5 échecs/15 min, `statut_compte`), liaison `LoginResponseContract` pour la redirection par rôle (US-AUTH-03), `CreateNewUser` action pour forcer `role=client` et `statut_compte=en_attente_verification` à l'inscription (UC-1), rate limiters nommés (`fortify.limiters.login`) pour distinguer l'anti brute-force de celui du géocodage.
- Les deux packages protègent nativement CSRF, hachage bcrypt, et s'appuient sur le même moteur Laravel — aucune perte de sécurité en changeant de package.

**Décision** : **Fortify**. Le gain principal n'est pas fonctionnel (les deux couvrent le même périmètre auth) mais architectural : Fortify évite un aller-retour "générer du Blade puis le jeter", et ses classes d'action isolées facilitent le pont pédagogique exigé par la Constitution (Principe II) — chaque action Fortify peut être annotée dans `docs/academique/` en la reliant au mécanisme PDO/POO enseigné en cours.

**Impact composants** (justifie l'application du protocole selfdoubt, 3+ composants touchés) : routes d'auth, structure de vues (`resources/views/auth/*` custom, à écrire nous-mêmes de toute façon), logique de verrouillage de compte, redirection par rôle.

### 1.2 Format du document devis=contrat : PDF plutôt que HTML imprimable

**Contexte** : Constitution Principe III — le document doit avoir valeur de preuve en cas de litige et ne jamais être recalculé après génération. FOUNDATION §10.3 : `chemin_document` stocké en disque privé, jamais régénéré au téléchargement.

**Analyse** :
- **HTML imprimable** : dépend du moteur de rendu/CSS d'impression du navigateur du client au moment de l'impression → rendu non garanti identique à ce qui a été "figé" côté serveur. Un fichier `.html` autonome pose aussi un problème d'archivage (dépendances CSS/police à embarquer ou lien brisé).
- **PDF** : format binaire figé — le fichier stocké est *littéralement* la preuve immuable (au sens octet-près), ce qui renforce directement la garantie de la Constitution Principe III ("le document n'est jamais recalculé"). Il est perçu comme plus formel pour un usage contractuel (photographe → client), s'imprime de façon identique partout, et se transmet facilement en pièce jointe.
- Coût : une dépendance supplémentaire (`barryvdh/laravel-dompdf`, wrapper Composer autour de `dompdf/dompdf`, pur PHP — aucun binaire externe à installer sur l'hébergement, donc pas de contrainte supplémentaire côté hébergement encore non choisi).

**Décision** : **PDF via `barryvdh/laravel-dompdf`**. Génération à partir d'une vue Blade dédiée (`resources/views/pdf/devis-contrat.blade.php`) alimentée uniquement par `donnees_figees` (jamais par les tables courantes), rendue une fois à la validation, stockée sur le disque privé `devis`, puis simplement servie (stream) à chaque téléchargement — jamais régénérée (US-CONTRAT-02, US-CONTRAT-04).

**Impact composants** : génération du document, stockage, endpoint de téléchargement, dépendance Composer à documenter dans `docs/academique/` (pont pédagogique : gestion de fichiers/flux binaires, équivalent `fopen`/`fwrite` vu en cours).

### 1.3 Auth par session (pas d'API tokens) et pas de préfixe `/api/v1/`

Le standard global (`~/.claude/CLAUDE.md`) recommande une REST versionnée `/api/v1/` — pertinent pour une API consommée par un client externe découplé (SPA séparée, app mobile). Ce n'est pas le cas ici : c'est une application monolithique Laravel servie côté serveur (Blade + jQuery/AJAX same-origin), déjà contractualisée en FOUNDATION §10 avec des routes `/register`, `/ajax/devis/segments`, `/admin/devis/{id}/statut`, etc. Introduire un préfixe `/api/v1/` supposerait une authentification par token (Sanctum) découplée du navigateur, ce qui ajoute de la complexité (gestion de tokens, CORS) sans bénéfice puisqu'il n'y a qu'un seul client (le navigateur, même origine).

**Décision** : authentification par **session Laravel + cookie CSRF** (`VerifyCsrfToken` natif, jeton injecté dans les en-têtes AJAX via jQuery `$.ajaxSetup`), routes organisées sous le groupe `web` avec les préfixes déjà établis par FOUNDATION (`/ajax/*` pour les appels XHR, `/admin/*`, `/photographe/*`, `/mes-devis/*`). Cohérent avec Constitution Principe V (YAGNI) — ne pas introduire de couche API découplée pour un besoin qui n'existe pas.

### 1.4 Onboarding tarifaire vide — seeders de valeurs par défaut

Point de friction identifié en FOUNDATION §11.4 mais sans use case formel (signalé par le PO comme candidat à couvrir en conception, sans US dédiée). Décision architecture : livrer une **migration + seeder** (`TypesPrestationSeeder`, `ParametresTarifairesSeeder`) exécutés au déploiement initial, peuplant `types_prestation` (mariage, portrait, événementiel) avec un `forfait_base` par défaut et `parametres_tarifaires` (prix/km, prix/heure sup., supplément weekend) avec des valeurs de départ raisonnables modifiables ensuite par le Photographe. Le Photographe ne voit donc jamais un état totalement vide — il ajuste plutôt que de partir de zéro. **Point d'attention transmis à l'UI/UX (#3)** : un bandeau "valeurs par défaut, à personnaliser" peut compléter ce filet de sécurité côté interface, mais ce n'est pas requis côté backend.

---

## 2. Schéma de base de données (ERD affiné)

Affine le schéma esquissé en FOUNDATION §3 et §10 : types de colonnes précis, contraintes, index, et 3 tables ajoutées pour couvrir vitrine-portfolio et administration (non détaillées au niveau 3 du brainstorm) — `medias_portfolio`, `contenus_vitrine`, `admin_action_logs`.

```mermaid
erDiagram
    USERS ||--o{ DEVIS : "cree (client_id)"
    USERS ||--o{ LOGIN_ATTEMPTS : "tente (par email)"
    USERS ||--o{ ADMIN_ACTION_LOGS : "effectue (admin_id)"
    USERS ||--o{ ADMIN_ACTION_LOGS : "subit (cible_utilisateur_id)"
    TYPES_PRESTATION ||--o{ DEVIS : concerne
    TYPES_PRESTATION ||--o{ MEDIAS_PORTFOLIO : illustre
    DEVIS ||--|{ DEVIS_SEGMENTS : contient

    USERS {
        bigint id PK
        varchar name
        varchar email UK
        timestamp email_verified_at NULL
        varchar password
        enum role "client|photographe|administrateur"
        enum statut_compte "en_attente_verification|actif|bloque|desactive"
        timestamp verrouille_jusqua NULL "verrouillage temporaire auto-expirable"
        varchar remember_token NULL
        timestamps created_at_updated_at
    }

    LOGIN_ATTEMPTS {
        bigint id PK
        varchar email
        varchar ip_address "45 car. max, IPv4/IPv6"
        boolean reussite
        timestamp created_at
    }

    PASSWORD_RESET_TOKENS {
        varchar email PK
        varchar token "haché"
        timestamp created_at
    }

    TYPES_PRESTATION {
        bigint id PK
        varchar nom UK
        decimal forfait_base "10,2"
        text description NULL
        timestamp deleted_at NULL "soft delete"
        timestamps created_at_updated_at
    }

    PARAMETRES_TARIFAIRES {
        bigint id PK
        varchar cle UK
        decimal valeur "10,2"
        timestamps created_at_updated_at
    }

    DEVIS {
        bigint id PK
        bigint client_id FK "NOT NULL, restrict delete"
        bigint type_prestation_id FK "restrict delete"
        enum statut "en_attente|confirme|realise|annule"
        decimal prix_total "10,2, recalcule serveur"
        json donnees_figees NULL "snapshot immuable a la validation"
        varchar chemin_document NULL "chemin prive, non public"
        timestamp valide_le NULL
        timestamps created_at_updated_at
    }

    DEVIS_SEGMENTS {
        bigint id PK
        bigint devis_id FK "cascade delete"
        varchar adresse
        decimal latitude "10,7"
        decimal longitude "10,7"
        time heure_debut
        time heure_fin
        smallint nb_personnes
        decimal distance_km "6,2"
        tinyint ordre
    }

    MEDIAS_PORTFOLIO {
        bigint id PK
        bigint type_prestation_id FK NULL "set null delete"
        varchar titre
        text description NULL
        varchar chemin_fichier
        varchar chemin_miniature NULL
        smallint ordre
        boolean publie
        timestamps created_at_updated_at
    }

    CONTENUS_VITRINE {
        bigint id PK
        varchar cle UK "accueil|services|..."
        varchar titre
        longtext contenu
        timestamp updated_at
    }

    ADMIN_ACTION_LOGS {
        bigint id PK
        bigint admin_id FK
        bigint cible_utilisateur_id FK NULL
        enum action "blocage|deblocage|reset_mdp"
        timestamp created_at
    }
```

### 2.1 Détail par table — contraintes et index

| Table | Contraintes clés | Index |
|---|---|---|
| `users` | `email` UNIQUE ; `role` NOT NULL, défaut `client` ; `statut_compte` NOT NULL, défaut `en_attente_verification` | `email`, `statut_compte`, `role` |
| `login_attempts` | aucune FK volontairement (on journalise même les emails inexistants, anti-énumération) | composite `(email, created_at)`, composite `(ip_address, created_at)` — purge programmée > 90 jours (cas limite §10.1) |
| `password_reset_tokens` | PK `email` | — |
| `types_prestation` | `nom` UNIQUE ; **soft delete** (`deleted_at`) — un type retiré du menu public reste référencé par l'historique des devis passés (Constitution III : ne jamais casser un document déjà figé) | — |
| `parametres_tarifaires` | `cle` UNIQUE ; valeurs **jamais codées en dur** (US-DEVIS-04) | — |
| `devis` | `client_id` **NOT NULL** (voir §2.2 pour la justification — écart assumé vs FOUNDATION §10.2) ; FK `type_prestation_id` en `RESTRICT` (empêche la suppression physique d'un type référencé, cohérent avec le soft delete ci-dessus) ; `statut` : machine à états applicative (`en_attente→confirme→realise`, `annule` depuis `en_attente`/`confirme` uniquement, `realise` terminal) | composite `(client_id, statut)`, `type_prestation_id` |
| `devis_segments` | FK `devis_id` en `CASCADE` ; unicité `(devis_id, ordre)` | composite `(devis_id, ordre)` |
| `medias_portfolio` | FK `type_prestation_id` en `SET NULL` (un média peut rester public même si son type est retiré) | composite `(type_prestation_id, ordre)`, `publie` |
| `contenus_vitrine` | `cle` UNIQUE (pattern clé/valeur identique à `parametres_tarifaires` — réutilisation délibérée du même pattern, DRY conceptuel) | — |
| `admin_action_logs` | FK `admin_id` NOT NULL ; FK `cible_utilisateur_id` NULLABLE (reset peut cibler un compte supprimé plus tard) | composite `(cible_utilisateur_id, created_at)` |

### 2.2 Écart assumé vs FOUNDATION §10.2 : `devis.client_id` NOT NULL

FOUNDATION §10.2 esquissait `client_id (nullable)`, mais FOUNDATION §11.1 (parcours détaillé) place explicitement la vérification d'email **avant** "Devis validé et document généré". Ces deux passages du même document sont en tension : le schéma technique (§10.2, rédigé au niveau 3) suggère un devis persistable sans client, alors que le parcours utilisateur (§11.4, niveau 4, plus récent et plus détaillé) exige un compte vérifié avant validation finale.

**Résolution retenue** : la composition (type + segments) vit **uniquement en session Laravel** (driver `database`, pas de table dédiée) tant que l'utilisateur n'est pas authentifié et vérifié. La ligne `devis` n'est **insérée en base qu'au moment de `POST /devis`**, après authentification complète (compte existant actif, ou inscription + vérification email fraîchement complétée). Donc `client_id` est toujours renseigné à l'insertion → **NOT NULL**, ce qui simplifie la Policy d'isolation (`client_id === user.id`, jamais de cas `NULL` à gérer) et évite un état intermédiaire ambigu en base. Confiance : ⚠️ Probable (voir bloc Selfdoubt §5) — c'est une résolution d'ambiguïté entre deux sections du FOUNDATION, pas une donnée déjà tranchée explicitement.

---

## 3. Patterns d'architecture backend

### 3.1 Clean Architecture — adaptation pragmatique à Laravel

Une Clean Architecture stricte (Domain totalement étanche à l'ORM) serait en tension directe avec Constitution Principe V (YAGNI — projet solo, 4,5 mois, examen). Adaptation retenue : **séparer ce qui est logique métier pure (testable sans framework) de ce qui est infrastructure Laravel**, sans sur-découpage en couches supplémentaires inutiles.

```
app/
├── Domain/                        # Zéro import Laravel/Eloquent — logique métier pure
│   ├── Devis/
│   │   ├── TarificationCalculator.php   # forfait + Σ(distance×prix_km) + Σ(heures_sup×prix_heure) + suppléments
│   │   ├── DistanceCalculator.php       # Haversine (distance géodésique)
│   │   └── StatutDevisStateMachine.php  # transitions valides + garde "realise = terminal"
│   └── Auth/
│       └── VerrouillageCompteRules.php  # règle "5 échecs / 15 min" (pure, sans Cache/DB)
│
├── Actions/                        # Application — orchestration Domain + Infrastructure
│   ├── Fortify/                    # CreateNewUser, ResetUserPassword, etc. (publiées par Fortify)
│   ├── Devis/
│   │   ├── AjouterSegmentAction.php     # appelle GeocodingService + DistanceCalculator
│   │   ├── ValiderDevisAction.php       # recalcul serveur + transaction devis+segments + génère PDF
│   │   └── ChangerStatutDevisAction.php # délègue à StatutDevisStateMachine
│   └── Admin/
│       ├── BloquerCompteAction.php      # + écrit admin_action_logs
│       └── ResetMotDePasseAdminAction.php
│
├── Infrastructure/                 # Adapters Laravel
│   ├── Geocoding/NominatimGeocodingService.php   # HTTP client Nominatim (OSM), pas de clé API
│   ├── Pdf/DevisContratPdfGenerator.php          # wrapper barryvdh/laravel-dompdf
│   └── Storage/DevisDocumentStorage.php          # disque prive dedie
│
├── Models/                         # Eloquent (User, Devis, DevisSegment, TypePrestation, ...)
├── Policies/                       # DevisPolicy, UserPolicy, PortfolioPolicy, TarifPolicy
├── Http/
│   ├── Controllers/                # HTTP adapters minces — délèguent aux Actions
│   └── Requests/                   # Form Requests — validation aux frontières (Constitution I)
```

**Justification** : les 3 briques les plus sensibles aux erreurs — calcul de prix, calcul de distance, transitions de statut — sont exactement celles que la Constitution (section Workflow) impose de tester unitairement avec cas limites. Les isoler du framework rend ces tests rapides et déterministes (pas de DB, pas de HTTP mock) sans construire une Clean Architecture complète à 4 couches que ce projet n'a pas besoin de porter.

### 3.2 Policies Laravel — isolation des rôles (Constitution Principe IV)

| Policy | Règle |
|---|---|
| `DevisPolicy::view` | `client_id === user.id` OR `user.role IN (photographe, administrateur)` |
| `DevisPolicy::updateStatut` | `user.role === photographe` uniquement, et transition validée par `StatutDevisStateMachine` |
| `UserPolicy::bloquer` / `debloquer` | `user.role === administrateur` ET `cible.id !== auth.id` (empêche l'auto-blocage, US-ADMIN-02) |
| `UserPolicy::resetMotDePasse` | `user.role === administrateur` |
| `PortfolioPolicy::gerer` | `user.role === photographe` |
| `TarifPolicy::gerer` | `user.role === photographe` |

Toutes les Policies sont vérifiées **côté serveur uniquement** via `$this->authorize()` dans les contrôleurs (jamais un simple masquage de bouton côté vue) — conforme Constitution IV et FOUNDATION §7. Un middleware `role:*` (léger) complète en défense en profondeur au niveau groupe de routes, mais l'autorisation de référence reste la Policy (pas de duplication de logique — DRY).

### 3.3 Verrouillage de compte — mécanisme "check-on-access" (sans tâche planifiée)

Le déverrouillage automatique après 15 min (US-AUTH-04) est implémenté sans CRON : ajout de la colonne `users.verrouille_jusqua`. À chaque tentative de connexion, avant d'évaluer les identifiants, le système vérifie `verrouille_jusqua` : si dépassé, le statut repasse silencieusement à `actif` avant la suite du flux. Le déverrouillage manuel par l'Administrateur (US-ADMIN-02) écrit directement `statut_compte=actif, verrouille_jusqua=null` + entrée `admin_action_logs`. Évite d'introduire un scheduler pour un besoin ponctuel (YAGNI).

### 3.4 Géocodage — réutilisation du pattern PortfolioPhotographe

Service Nominatim (OpenStreetMap) + formule de Haversine, comme dans le projet antérieur référencé en FOUNDATION §8. Aucune clé API requise (Nominatim public, usage raisonnable) — supprime un secret à gérer. Rate limiting **dédié** (`RateLimiter::for('geocodage', ...)`) distinct de celui du login, plafonné à 1 requête/seconde par session pour respecter la politique d'usage de Nominatim, avec cache applicatif par adresse normalisée pour éviter les appels redondants sur une même adresse déjà géocodée dans le devis en cours.

### 3.5 Stockage des fichiers

| Disque | Contenu | Visibilité |
|---|---|---|
| `public` (symlink `storage:link`) | `medias_portfolio.chemin_fichier` (photos vitrine) | Public — servi directement |
| `devis` (disque dédié, hors `public/`) | PDF devis=contrat (`devis.chemin_document`) | Privé — jamais d'URL directe, uniquement via route contrôlée + Policy |

Upload de photos (US-VITRINE-03) : validation Form Request stricte — type MIME (`jpeg,png,webp`), taille max, dimension max — avant acceptation (Constitution I, frontières du système).

---

## 4. Points de vigilance transmis à l'UI/UX (#3)

1. **Fortify est headless** : toutes les vues d'authentification (inscription, connexion, vérification, mot de passe oublié, profil) sont à concevoir entièrement en HTML/jQuery — rien n'est fourni par le package. Prévoir les 3 redirections post-connexion différenciées par rôle.
2. **Tunnel de devis piloté en session, pas en base** avant validation finale — l'UI doit gérer un état "brouillon" côté client (sous-total live, §11.4) sans supposer d'ID de devis persistant tant que la validation n'a pas eu lieu.
3. **Onboarding tarifaire** : des valeurs par défaut existent déjà en base dès l'installation (seeders) — l'UI peut (optionnel) signaler "valeurs par défaut à personnaliser" au Photographe plutôt que de gérer un état vide.
4. **Format PDF retenu** : prévoir un lien/bouton de téléchargement classique (pas de prévisualisation HTML custom nécessaire), le PDF pouvant s'ouvrir dans un nouvel onglet nativement.
5. **Confusion devis/contrat** (FOUNDATION §11.4) : le récapitulatif avant validation doit clarifier that le document généré fait office de référence d'accord — formulation UI à soigner, hors périmètre architecture.

---

## 5. Bloc Selfdoubt

Protocole appliqué avant les décisions à 3+ composants impactés (Breeze/Fortify, PDF/HTML, schéma `devis.client_id`).

| Affirmation | Niveau | Action |
|---|---|---|
| Fortify est la meilleure option pour un frontend jQuery/AJAX custom imposé par le cours | ✅ Certain | Fortify est conçu explicitement "headless" pour ce cas d'usage ; documenté par les mainteneurs Laravel eux-mêmes |
| Les Actions Fortify publiées dans `app/Actions/Fortify` restent lisibles/éditables comme du code applicatif normal | ✅ Certain | Comportement standard documenté de `php artisan fortify:install` |
| PDF est strictement supérieur à HTML pour la valeur probante du document | ⚠️ Probable | Argument fondé sur l'immuabilité binaire et la Constitution III, mais reste un jugement de conception, pas une exigence explicite du cahier des charges qui laissait le choix ouvert |
| `dompdf` (pur PHP) suffira sans binaire externe même sur un hébergement encore non choisi | ⚠️ Probable | Vrai pour dompdf en général, mais dépend de la mémoire/temps d'exécution allouée par l'hébergeur final (non choisi — FOUNDATION §12) ; à revalider par l'Agent DevOps (#8) |
| `devis.client_id` doit être NOT NULL (résolution de la tension §10.2 vs §11.1 du FOUNDATION) | ⚠️ Probable | Résolution logique cohérente avec le parcours détaillé (§11.1, plus récent/niveau 4), mais le FOUNDATION ne tranche pas explicitement cette contradiction interne — à confirmer avec mentalyas si le comportement réel diffère (ex. sauvegarde multi-appareil d'un devis non finalisé, non demandée actuellement) |
| Aucun scheduler/CRON n'est nécessaire pour le déverrouillage automatique de compte | ✅ Certain | Le pattern "check-on-access" via `verrouille_jusqua` couvre le besoin fonctionnel sans tâche planifiée, cohérent avec YAGNI |
| Les 3 tables ajoutées (`medias_portfolio`, `contenus_vitrine`, `admin_action_logs`) couvrent entièrement les besoins vitrine/admin sans sur-ingénierie | ⚠️ Probable | Dérivées des critères d'acceptation §9.2/§9.5, mais n'ont pas été validées au niveau 3 du brainstorm (jamais flaguées "signal fort") — périmètre minimal raisonnable, à ajuster si l'UI/UX révèle un besoin non anticipé |

**Hedge-to-Verify Ratio** : 4/7 affirmations ⚠️ Probable (0,57) — concentré sur des choix de conception qui comblent des vides ou tensions du FOUNDATION plutôt que sur des faits vérifiables. Aucune incertitude ne porte sur les principes de sécurité (Policies, hachage, CSRF, isolation) qui restent des application directes de la Constitution.
