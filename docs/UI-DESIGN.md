# UI/UX Design — PID
> Rédigé par : UI/UX Designer (Agent #3) — Pipeline IT, réconcilié avec mentalyas le 2026-09-12
> Date : 2026-09-12
> Source : `docs/JOURNAL.md` (entrées ARCHITECT #2 et PRODUCT OWNER #1), `docs/USER-STORIES.md` (25 US), `docs/ARCHITECTURE.md`, `docs/API-ENDPOINTS.md`, `docs/FOUNDATION.md` §7/§8/§11, `Design/Ernest H. Photography site planning/Ernest H Photography.dc.html` (direction visuelle réelle, réconciliée post-agent).
> Palette : voir `docs/PALETTE.md` (structure WCAG AA de l'agent + tokens de marque réels récupérés du design existant — voir en-tête du fichier).

---

## 0. Cadrage — plateforme cible

**Confirmé** (Architecte #2, ARCHITECTURE.md §1.1/§1.3) : application **web monolithique Laravel**, rendu **Blade + jQuery/AJAX**, **pas de SPA React**, auth par **session + CSRF** (pas de token API). Le référentiel WinForms (`~/.claude/winforms-referential.md`) ne s'applique donc pas — ce document applique les règles Frontend web de bon sens (Nielsen, Gestalt, Fitts/Hick-Hyman/Miller/Tesler) plutôt que les patterns natifs C#.

**Conséquence directe pour ce design** : Fortify étant headless (aucune vue fournie), **toutes** les vues d'authentification listées en §4.6 sont conçues ici de zéro. Le tunnel de devis (§4.4) vit en session serveur avant persistance — le design traite explicitement l'état "brouillon sans ID" (alerte Architecte §4 point 2).

### Référence visuelle existante — réconciliée

Mise à jour post-agent (2026-09-12, avec mentalyas) : le design Claude Design *"Ernest H Photography.dc.html"* a été récupéré (`Design/Ernest H. Photography site planning/` — pack téléchargé, exempt du problème d'accès qu'avait l'agent) et inspecté. **PALETTE.md §0-2 a été mis à jour avec les vrais tokens de marque** (fond `#EFE7D8`, texte `#2B2521`, accent bronze `#8A5A2F`, accent or `#C9A46B`, ink sombre `#1C1712`) — la structure fonctionnelle ci-dessous (flows, composants, wireframes) reste valable, seule l'habillage visuel change.

**Répartition claire pour l'implémentation (Frontend #5)** :
- **Écrans vitrine (§4.1-4.3)** : le mockup existant fait déjà autorité — direction "5a" (une page défilante : cadran hero → à propos → "le fil d'une journée" → galerie → devis en 3 cercles → témoignage → footer sombre), variante mobile "6a", et page galerie détaillée par couple "7a". Fidélité au fichier `.dc.html` directement (structure, espacements, motifs) plutôt qu'aux wireframes textuels ci-dessous, qui sont maintenant enrichis pour pointer vers les bonnes sections.
- **Écrans applicatifs (§4.4-4.10 : tunnel de devis, auth, dashboards)** : n'existent pas dans le mockup (qui ne couvrait que la vitrine marketing d'origine, pensée pour Next.js/PortfolioPhotographe) — conçus ici en adoptant le même langage visuel (cadran, cercles de prix, labels "Nº0XX", coins d'angle) plutôt qu'en inventant une direction différente. Voir §6 "Motifs de marque appliqués aux écrans applicatifs".

---

## 1. Lois cognitives — application concrète au projet

| Loi | Application dans PID |
|---|---|
| **Fitts** | CTA "Démarrer un devis" en grand bouton sur chaque page vitrine (§4.1-4.3) ; boutons d'action fréquente (ajouter un segment, valider) ≥ 44px de hauteur tactile ; actions destructives (bloquer un compte, supprimer un média) délibérément **plus petites et excentrées** — pas de Fitts sur les actions à risque. |
| **Hick-Hyman** | **Point d'attention prioritaire du brief** — le tunnel de devis (§4.4) n'affiche **jamais** plus de 4 types de prestation à la fois (seedés : mariage/portrait/événementiel) et **un seul formulaire d'ajout de segment visible à la fois** (jamais une liste de N formulaires vides simultanés) ; le menu de rôle (navbar) limite les entrées visibles à 4-5 max par espace. |
| **Miller** | Champs de formulaire groupés par blocs de 4-5 max avec séparateurs visuels (ex. segment : adresse / horaires / effectif = 2 groupes) ; liste de comptes Admin paginée (pas de scroll infini de centaines de lignes). |
| **Tesler** | Le géocodage, le calcul de distance et le recalcul de prix sont **entièrement automatiques côté serveur** — l'utilisateur ne voit jamais un champ "distance" ou "prix" à saisir manuellement, seulement le résultat. La complexité de l'état "brouillon en session" est absorbée par l'UI (le visiteur ne sait jamais qu'il n'a pas encore d'ID de devis). |
| **Jakob** | Navbar horizontale classique + zone connexion à droite ; tunnel multi-étapes avec stepper horizontal (pattern e-commerce/checkout standard, reconnu instantanément) ; icône ⚙ à droite du bandeau pour la configuration (cohérent avec la règle globale "placement entités config"). |

**Gestalt** : proximité (segments d'un même devis regroupés visuellement, séparés des segments suivants) ; similarité (un badge de statut a toujours la même couleur/forme partout, cf. PALETTE.md §3.3) ; continuité (champs de formulaire alignés sur un axe vertical unique, jamais en grille irrégulière) ; fermeture (chaque segment ajouté = une carte avec bordure/fond distinct) ; figure/fond (contraste ≥ 4.5:1 partout, cf. PALETTE.md).

**Nielsen** (heuristiques les plus sollicitées ici) : #1 visibilité de l'état (sous-total live, badges de statut, spinner pendant géocodage) ; #5 prévention des erreurs (validation inline avant soumission, confirmation avant blocage de compte) ; #9 messages d'erreur utiles (jamais "erreur 422" brut — toujours un message métier + correction proposée) ; #3 annuler disponible (suppression d'un segment avant validation finale).

---

## 2. Composants transversaux identifiés

| Composant | Rôle | Écrans concernés |
|---|---|---|
| **Navbar rôle-consciente** | 3 variantes (Public/Client, Photographe, Administrateur) — logo + nav gauche (Jakob), zone compte à droite | Toutes |
| **Bouton primaire / secondaire / destructif** | Palette PALETTE.md §3.1, min 44px hauteur, désactivé pendant traitement (feedback < 200ms) | Toutes |
| **Champ de formulaire + validation inline** | Label aligné, message d'erreur sous le champ, état focus/erreur/succès (PALETTE.md §3.2) | Auth, devis, config tarifaire, profil |
| **Alert/bandeau contextuel** | 4 variantes sémantiques (succès/attention/erreur/info), dismissible ou permanent selon criticité | Réassurance inscription, onboarding tarifaire, confirmation devis |
| **Badge de statut** | Icône + texte + couleur (jamais couleur seule) | Historique client, vue globale photographe, liste comptes admin |
| **Stepper horizontal (progression)** | 3-4 étapes max affichées, étape courante en accent, étapes complétées cochées | Tunnel de devis |
| **Carte segment (collapsed)** | Résumé compact d'un segment ajouté (adresse, horaires, distance, sous-total ligne) avec action "supprimer" | Tunnel de devis, récapitulatif |
| **Panneau récapitulatif sticky (φ = 38%)** | Colonne latérale fixe résumant type + segments + sous-total live, visible en permanence pendant la composition | Tunnel de devis, récapitulatif |
| **Table de données paginée + filtres** | En-têtes triables, filtres en haut (Hick-Hyman : filtres groupés, pas dispersés), pagination bas de page | Vue globale Photographe, Liste comptes Admin, Journal tentatives |
| **Modal de confirmation** | Pour toute action destructive/irréversible (blocage compte, suppression média, changement de statut `annulé`) | Admin, Photographe |
| **Lightbox photo** | Vue grand format depuis une grille filtrable | Portfolio public |
| **Input adresse avec autocomplétion** | Suggestions au fil de la frappe (debounce ~300ms), réduit les erreurs de géocodage en amont | Tunnel de devis — **cf. alerte Backend §7** |

---

## 3. Flows UX généraux

### Flow A — Visiteur → Devis → Inscription → Client (le plus critique, P0)
```
Accueil/Portfolio/Services (CTA "Devis")
   → Tunnel : Type de prestation (1 choix)
   → Tunnel : Segments (ajout itératif, sous-total live, sans compte)
   → Récapitulatif (composition figée à l'écran, pas encore en base)
   → [pas de compte] → Inscription (devis visible en permanence, message réassurance)
                      → Vérification email (email envoyé, écran d'attente explicite)
                      → Retour automatique au devis + soumission rejouée (POST /devis)
   → [compte existant, connecté] → soumission directe (POST /devis)
   → Confirmation : "Devis-contrat généré" + lien de téléchargement PDF
   → Espace Client : historique
```

### Flow B — Photographe : configuration et suivi
```
Connexion → Tableau de bord Photographe
   → [1ère connexion] bandeau "valeurs par défaut à personnaliser" → Configuration tarifaire
   → Vue globale des devis (filtrable statut/type/client) → Détail devis → changement de statut
   → CMS vitrine (médias + contenus texte)
```

### Flow C — Administrateur : supervision
```
Connexion → Liste des comptes (filtrable rôle/statut)
   → Détail compte → Bloquer/Débloquer (confirmation modale) / Reset mot de passe (confirmation modale)
   → Journal des tentatives échouées (filtrable email/IP)
```

---

## 4. Écrans — wireframes textuels

### 4.1 Accueil (Public) — fidèle au mockup "5a"

**Objectif** : premier contact, orienter vers le devis ou le portfolio. **Friction adressée** : aucune (écran d'entrée). **Source d'autorité** : `Design/.../Ernest H Photography.dc.html`, section `id="t5"` / option `5a`.

```
┌─────────────────────────────────────────────────────────┐
│ NAVBAR : GALERIE · DEVIS | ERNEST H. (logo serif, centré)│
│          | À PROPOS · CONTACT — cadran horaire discret   │
│          (−2 −1 [0] +1 +2) juste sous la navbar           │
├─────────────────────────────────────────────────────────┤
│  HERO : cadran circulaire (photo signature dans un cercle,│
│  graduations 00H/06H/12H/18H, léger dégradé conique or)   │
│  Nº014 · 18H32 · 1/125 ƒ2.0 (caption EXIF sous le cadran) │
│  Titre serif italique : accroche émotionnelle             │
│  [ Demander un devis ]  [ Voir la galerie ]  (2 CTA cote  │
│  à cote — dérogation au "1 CTA/écran" assumée, cf. §5)    │
├─────────────────────────────────────────────────────────┤
│  Nº002 · À PROPOS — 2 photos + texte court                │
├─────────────────────────────────────────────────────────┤
│  Nº003 · LE FIL D'UNE JOURNÉE — bande dégradée bronze→or, │
│  4 étapes horaires (05H/14H/19H/23H) avec photo + heure    │
├─────────────────────────────────────────────────────────┤
│  Nº004 · GALERIE — planche-contact 3 photos (proportions  │
│  0.85/1.15/0.85), lien "Voir toute la galerie"            │
├─────────────────────────────────────────────────────────┤
│  Nº005 · DEVIS — 3 cercles concentriques (Event unique     │
│  350€ / Demi-journée 650€ mis en avant, cercle plus grand +│
│  pointillé or / Journée complète 1250€) — **adapter pour  │
│  PID** : ces 3 forfaits deviennent l'aperçu des            │
│  `types_prestation` seedés, cliquer un cercle lance le     │
│  tunnel de devis pré-rempli sur ce type                    │
├─────────────────────────────────────────────────────────┤
│  Témoignage isolé (citation serif italique + nom du couple)│
├─────────────────────────────────────────────────────────┤
│  FOOTER sombre (fond `--color-ink-dark`) : mentions,       │
│  Instagram, contact                                        │
└─────────────────────────────────────────────────────────┘
```
**Composants réels du mockup** : cadran circulaire (motif signature, réutilisé aussi en hero mobile), coins d'angle décoratifs (haut-gauche/haut-droit/bas-gauche/bas-droit), bande dégradée bronze/or, cercles de prix concentriques. **Corner cases à couvrir** (absents du mockup, à ajouter) : état "photo non uploadée" du cadran (placeholder neutre, jamais une icône cassée), navbar avec zone connexion à droite quand un utilisateur est identifié (le mockup marketing ne montre que l'état visiteur déconnecté).

### 4.2 Portfolio / Galerie (Public) — fidèle au mockup "7a" (détail par couple) + variante "8a" (mosaïque, optionnelle)

**Endpoint** : `GET /portfolio` + `GET /ajax/portfolio/{media}` (lightbox). **Source d'autorité** : section `id="t7"` (`7a`, direction retenue) et `id="t8"` (`8a`, variante mosaïque expérimentale — optionnelle, à activer seulement si le Photographe veut un rendu plus dense).

```
┌─────────────────────────────────────────────────────────┐
│ NAVBAR (identique à l'accueil)                            │
├─────────────────────────────────────────────────────────┤
│ Nº006 · GALERIE PAR COUPLE — titre serif "Une bobine,      │
│ une histoire."                                             │
├─────────────────────────────────────────────────────────┤
│ Sélecteur de couples : avatars circulaires en ligne,       │
│ flèches ‹ › de part et d'autre (≤ 5 visibles — Hick-Hyman) │
├─────────────────────────────────────────────────────────┤
│ Nom du couple (serif italique) + lieu/date (monospace)     │
├─────────────────────────────────────────────────────────┤
│ Photo centrale grande, flèches ‹ › symétriques,             │
│ caption EXIF-style "Nº07 SUR 24 · 19H10 · ƒ2.0"             │
│ Filmstrip de vignettes sous la photo (miniature active      │
│ encadrée en accent bronze)                                  │
├─────────────────────────────────────────────────────────┤
│ Témoignage isolé (trait vertical séparateur) + pagination  │
│ par points (jamais de numéros de page bruts)                │
├─────────────────────────────────────────────────────────┤
│ Bandeau CTA sombre : "Ajoutez votre bobine à la collection"│
│ → [ Demander un devis ]                                     │
└─────────────────────────────────────────────────────────┘
```
**Variante filtrable simple** (pas dans le mockup, nécessaire pour PID) : au-dessus du sélecteur de couples, filtres par `types_prestation` (`[ Tous ] [ Mariage ] [ Portrait ] [ Événement ]`, ≤ 4 visibles) — même style de labels monospace/letter-spacing que la navbar de catégories de la variante mosaïque "8a".

### 4.3 Présentation des services (Public)

Pas de section dédiée dans le mockup existant (le contenu "services" y est distribué entre le hero et le bloc "À propos"). Pour PID : reprendre le même habillage (Nº00X numéroté, titre serif, texte Manrope) pour une page dédiée listant les `types_prestation` avec leur forfait de base indicatif — CTA devis répété en fin de page. Pas de logique interactive spécifique.

### 4.4 Tunnel de devis — écran le plus différenciant (P0)

**Layout général** : split **φ = 62/38** — colonne gauche (62%) = étape courante, colonne droite (38%) = panneau récapitulatif sticky (répond directement au point de friction "tunnel perçu comme long").

#### 4.4.a Étape 1 — Choix du type de prestation
`POST /devis/type`
```
┌─────────────────────────────────────────────┬─────────────┐
│ [●───○───○] Type → Segments → Récapitulatif  │  RÉCAP      │
├───────────────────────────────────────────────┤  (vide)     │
│ Quel type de prestation ?                     │             │
│                                                │             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐      │             │
│  │ Mariage  │ │ Portrait │ │Événement.│      │             │
│  │ dès 450€ │ │ dès 120€ │ │ dès 300€ │      │             │
│  └──────────┘ └──────────┘ └──────────┘      │             │
│  (cartes larges, ≥ 44px cliquable, 1 clic)   │             │
└───────────────────────────────────────────────┴─────────────┘
```
**Règle visible** : forfait de base affiché **immédiatement** sur chaque carte (US-DEVIS-01), pas besoin de cliquer pour le connaître (Nielsen #1). Max 3-4 cartes affichées (Hick-Hyman) — si le Photographe crée plus de types, prévoir un lien "voir plus" plutôt que d'étaler.

#### 4.4.b Étape 2 — Composition multi-segments
`POST /ajax/devis/segments` (ajout), `DELETE /ajax/devis/segments/{ordre}` (suppression)
```
┌─────────────────────────────────────────────┬─────────────┐
│ [✓───●───○] Type → Segments → Récapitulatif  │ RÉCAPITULATIF│
├───────────────────────────────────────────────┤ Mariage      │
│ Segments ajoutés (0 à N) :                    │ Forfait: 450€│
│  ┌─────────────────────────────────────┐ [✕] │──────────────│
│  │ 1. Mairie — 10h00-11h00 — 30 pers.   │      │ Seg.1: +0€  │
│  │    distance: 0 km (départ)           │      │ Seg.2: +18€ │
│  └─────────────────────────────────────┘      │──────────────│
│  ┌─────────────────────────────────────┐ [✕] │ SOUS-TOTAL   │
│  │ 2. Église — 11h30-12h30 — 60 pers.   │      │  468 €       │
│  │    distance: 4.2 km depuis seg.1     │      │  (live)      │
│  └─────────────────────────────────────┘      │──────────────│
│                                                │             │
│ ── Ajouter un segment ── (1 seul formulaire   │             │
│    visible à la fois — Hick-Hyman)            │             │
│  Adresse : [_____________] (autocomplétion)   │             │
│  Heure début : [__:__]   Heure fin : [__:__]  │             │
│  Nb personnes : [___]                          │             │
│  [ + Ajouter ce segment ]  (état: spinner      │             │
│   pendant géocodage — feedback < 200ms)        │             │
│                                                │             │
│  [ Terminer et voir le récapitulatif → ]      │             │
│  (visible dès 1 segment ajouté — pas besoin   │             │
│   d'ajouter tous les segments avant de sortir) │             │
└───────────────────────────────────────────────┴─────────────┘
```
**Règles de validation visibles** :
- Au moins 1 segment requis pour continuer (bouton "Terminer" désactivé tant que 0 segment, avec tooltip explicite).
- Heure fin > heure début (erreur inline immédiate, avant tout appel serveur — Nielsen #5).
- Échec de géocodage (timeout/adresse introuvable) → **jamais un blocage silencieux** : message inline "Adresse introuvable. Vérifiez l'orthographe ou [saisissez les coordonnées manuellement]" (lien vers un mode dégradé, cf. US-DEVIS-03/friction #2).
- Segments réordonnés automatiquement par heure de début croissante après chaque ajout — l'ordre affiché correspond toujours à `ordre` côté serveur, jamais à l'ordre de saisie.

**Friction "tunnel perçu long" (§11.4)** : sous-total live visible en permanence (panneau droit), stepper à 3 étapes seulement (pas une étape par segment), CTA de sortie anticipée dès le premier segment.

#### 4.4.c Étape 3 — Récapitulatif avant validation
`GET /ajax/devis/recapitulatif`, puis `POST /devis`
```
┌───────────────────────────────────────────────────────────┐
│ [✓───✓───●] Type → Segments → Récapitulatif                │
├───────────────────────────────────────────────────────────┤
│  Récapitulatif complet — Mariage                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Segment 1 — Mairie — 10h-11h — 30 pers. — 0 km        │  │
│  │ Segment 2 — Église — 11h30-12h30 — 60 pers. — 4.2 km  │  │
│  └─────────────────────────────────────────────────────┘  │
│  Décomposition du prix :                                    │
│    Forfait de base ................. 450,00 €               │
│    Distance (4.2 km × 2,50 €/km) ....  10,50 €               │
│    Heures supplémentaires (0h) .......   0,00 €              │
│    ─────────────────────────────────                        │
│    TOTAL ............................ 460,50 €               │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ℹ️  En validant, vous générez un document devis-contrat │ │  ← FRICTION #4
│  │    de référence pour cette prestation — pas un contrat │ │
│  │    juridique formel, mais l'accord commercial engageant│ │
│  │    entre vous et le photographe.                        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                               │
│  [ ← Modifier ]              [ Valider mon devis → ]         │
└───────────────────────────────────────────────────────────┘
```
**Règle visible critique (US-DEVIS-07)** : le prix affiché ici est **indicatif côté client** — le bouton "Valider" déclenche un recalcul serveur intégral ; si un écart survient (ex. tarif modifié entre-temps par le photographe), l'écran affiche le **nouveau total recalculé avant confirmation finale** plutôt que de valider silencieusement un prix différent (transparence, Nielsen #1 + #9).

**Friction #4 (confusion devis/contrat)** adressée explicitement par le bandeau `info` ci-dessus — vocabulaire volontairement choisi : "document devis-contrat de référence... pas un contrat juridique formel" (reprend le libellé exact du point de friction FOUNDATION §11.4).

### 4.5 Écran d'inscription intercalé (si visiteur non connecté à la validation)

**Friction #1 (perte perçue du devis)** — traitement explicite :
```
┌───────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 📌 Votre devis "Mariage — 460,50 €" est conservé.    │  │  ← bandeau accent-tint,
│  │    Créez votre compte pour le finaliser — vous ne     │  │    permanent, en tête
│  │    perdez rien de votre composition.                   │  │    de l'écran d'inscription
│  └─────────────────────────────────────────────────────┘  │
│  Formulaire d'inscription : Nom, Email, Mot de passe,       │
│  Confirmation mot de passe                                  │
│  [ Créer mon compte et récupérer mon devis ]                │
└───────────────────────────────────────────────────────────┘
```
Après soumission → écran "Vérifiez votre email" (statut `en_attente_verification` explicite, bouton "renvoyer l'email" avec cooldown visible) → au clic sur le lien reçu, retour **automatique** au devis en cours et `POST /devis` rejoué sans action utilisateur supplémentaire (US-DEVIS-06).

### 4.6 Authentification (Fortify headless — vues à concevoir intégralement)

Quatre écrans, formulaire centré (max ~420px), un seul CTA primaire chacun :

| Écran | Champs | Règles visibles |
|---|---|---|
| **Inscription** | name, email, password, password_confirmation | Vérification disponibilité email en live (`GET /ajax/check-email`, debounce) ; règles de robustesse du mot de passe affichées **avant** soumission (pas seulement en cas d'erreur) — friction anticipée, pas réactive |
| **Connexion** | email, password | Message d'erreur : identifiants invalides (générique, anti-énumération) vs compte bloqué (message distinct explicite, sans détail sur la raison — US-AUTH-03) ; lien "mot de passe oublié" |
| **Vérification email** | — (lien signé) | Écran d'attente post-inscription avec état explicite + action "renvoyer" (rate-limitée, cooldown visible côté UI) |
| **Mot de passe oublié / Réinitialisation** | email → puis password, password_confirmation | Message générique identique que l'email existe ou non (anti-énumération, US-AUTH-05) ; confirmation "toutes vos sessions ont été déconnectées" après reset réussi |

**Redirection post-connexion (alerte Architecte)** : 3 destinations distinctes selon `role` — Client → `/mes-devis`, Photographe → tableau de bord Photographe, Administrateur → `/admin/utilisateurs`. Aucun écran intermédiaire de "choix d'espace" — la redirection est automatique (Tesler : le système décide, l'utilisateur n'a rien à choisir).

### 4.7 Espace Client — Tableau de bord / Historique / Détail devis

`GET /mes-devis`, `GET /mes-devis/{devis}`, `GET /mes-devis/{devis}/telecharger`
```
┌─────────────────────────────────────────────────────────┐
│ NAVBAR Client : Mes devis | Nouveau devis | Profil        │
├─────────────────────────────────────────────────────────┤
│ Mes devis                                    [+ Nouveau]  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ #12  Mariage      🟡 En attente   460,50 €  [Détail]  │ │
│ │ #08  Portrait     🟢 Réalisé      120,00 €  [Détail]  │ │
│ │ #05  Événementiel 🔴 Annulé       300,00 €  [Détail]  │ │
│ └─────────────────────────────────────────────────────┘ │
│ (pagination si > N devis)                                │
└─────────────────────────────────────────────────────────┘
```
**Détail devis (lecture seule)** : reprend le layout du récapitulatif §4.4.c mais en lecture seule, alimenté par `donnees_figees` (pas les tables courantes — même si le photographe a changé ses tarifs depuis) + badge de statut + bouton `[ Télécharger le PDF ]` (lien direct, pas de prévisualisation custom, cf. alerte Architecte point 4) + rappel visuel discret "Ce document est votre devis-contrat de référence, généré le [date]".

**Isolation stricte (US-CONTRAT-02)** : aucune UI spécifique requise au-delà de la Policy serveur — mais prévoir un écran d'erreur 403 **explicite et non technique** ("Ce devis ne vous appartient pas") si un Client tente d'accéder à l'ID d'un tiers via l'URL, plutôt qu'une page blanche ou une erreur serveur brute.

### 4.8 Profil utilisateur (transversal — Client/Photographe/Administrateur)

`GET/PUT /profil`, `PUT /profil/mot-de-passe`
```
┌─────────────────────────────────────────────────────────┐
│ Mon profil                                                │
│  Nom : [_____________]                                    │
│  Email : [_____________]  ⚠ changer l'email redéclenche  │
│                             une vérification (avertissement│
│                             affiché avant soumission)      │
│  [ Enregistrer ]                                           │
│  ── Changer mon mot de passe ──                            │
│  Mot de passe actuel / nouveau / confirmation             │
│  [ Modifier le mot de passe ]                              │
└─────────────────────────────────────────────────────────┘
```
Un seul écran, deux blocs distincts séparés visuellement (Gestalt proximité) — pas deux pages séparées, pour éviter la sur-navigation sur une fonctionnalité secondaire (US-AUTH-06, priorité P2).

### 4.9 Espace Photographe

#### 4.9.a Tableau de bord
Point d'entrée après connexion : résumé chiffré (devis en attente, confirmés ce mois-ci) + accès rapide aux 4 sections ci-dessous (Miller : 4 blocs max en accueil de dashboard).

#### 4.9.b Configuration tarifaire — répond à la friction #5 (onboarding vide)
`GET/POST/PUT/DELETE /photographe/types-prestation`, `GET/PUT /photographe/parametres-tarifaires`
```
┌─────────────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────────────┐   │
│ │ ℹ️ Valeurs par défaut appliquées à l'installation.  │   │  ← bandeau warning-tint,
│ │   Personnalisez-les ci-dessous à tout moment.        │   │    dismissible, affiché tant
│ └───────────────────────────────────────────────────┘   │    que le Photographe n'a
│ Types de prestation                        [+ Ajouter]   │    jamais modifié aucune valeur
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Mariage       forfait: 450,00 €   [Modifier][Retirer]│ │
│ │ Portrait      forfait: 120,00 €   [Modifier][Retirer]│ │
│ │ Événementiel  forfait: 300,00 €   [Modifier][Retirer]│ │
│ └─────────────────────────────────────────────────────┘ │
│ Paramètres tarifaires                                     │
│  Prix / km ................ [ 2,50 ] €    (valeur actuelle)│
│  Prix / heure supplémentaire [ 40,00 ] €                   │
│  Supplément week-end ....... [ 50,00 ] €                   │
│  [ Enregistrer les paramètres ]                             │
└─────────────────────────────────────────────────────────┘
```
**Règle visible** : "Retirer" un type de prestation déclenche une **modale de confirmation** expliquant qu'il s'agit d'un retrait (soft delete) — les devis historiques déjà liés restent inchangés, formulation à afficher explicitement pour éviter la peur de casser l'historique. Modification d'un paramètre tarifaire affiche un rappel : "n'affecte que les nouveaux devis — les devis déjà validés restent inchangés" (répond en creux à la friction #4, renforce la confiance dans l'immuabilité).

#### 4.9.c Vue globale des devis + changement de statut
`GET /photographe/devis`, `PATCH /photographe/devis/{devis}/statut`
```
┌─────────────────────────────────────────────────────────┐
│ Filtres : Statut[▾] Type[▾] Client[____]     (Hick-Hyman: │
│                                                3 filtres)  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ #12 Dupont   Mariage   🟡 En attente  460,50€ [Voir] │ │
│ │ #11 Martin   Portrait  🔵 Confirmé    120,00€ [Voir] │ │
│ └─────────────────────────────────────────────────────┘ │
│ (pagination — US-CONTRAT-03)                              │
└─────────────────────────────────────────────────────────┘
```
**Détail devis (Photographe)** : lecture seule sur toutes les données figées, **seul le champ statut est éditable**, via un sélecteur qui **n'affiche que les transitions valides** depuis l'état courant (ex. depuis `en_attente` : `confirmé` ou `annulé` uniquement — jamais `réalisé` directement) — le state machine backend (`StatutDevisStateMachine`) est reflété visuellement, pas juste validé après coup (prévention d'erreur, Nielsen #5). Statut `réalisé` : sélecteur **désactivé** avec message "statut final, non modifiable".

#### 4.9.d CMS vitrine
`GET/POST/PUT/DELETE /photographe/vitrine/*`
```
┌─────────────────────────────────────────────────────────┐
│ Onglets : [ Médias ] [ Contenu accueil ] [ Contenu       │
│            services ]                                     │
│ Médias : grille avec [+ Ajouter une photo], drag pour     │
│  réordonner (ordre), toggle publié/masqué par média,       │
│  bouton supprimer avec confirmation                        │
│ Upload : validation type/taille affichée **avant** l'envoi │
│  (ex. "JPEG/PNG/WebP, 5 Mo max") — prévention d'erreur      │
└─────────────────────────────────────────────────────────┘
```
**Règle visible** : "Publié immédiatement" annoncé explicitement à l'upload — pas d'étape de publication séparée qui laisserait croire à un brouillon (US-VITRINE-03).

### 4.10 Espace Administrateur

#### 4.10.a Liste des comptes
`GET /admin/utilisateurs`
```
┌─────────────────────────────────────────────────────────┐
│ Filtres : Rôle[▾] Statut[▾]                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ email@ex.com   Client       🟢 Actif        [Détail] │ │
│ │ jean@ex.com    Client       🔴 Bloqué       [Détail] │ │
│ │ photo@ex.com   Photographe  🟢 Actif        [Détail] │ │
│ └─────────────────────────────────────────────────────┘ │
│ (pagination)                                               │
└─────────────────────────────────────────────────────────┘
```

#### 4.10.b Détail compte
`GET/PATCH /admin/utilisateurs/{user}/...`
```
┌─────────────────────────────────────────────────────────┐
│ jean@ex.com — Client — 🔴 Bloqué depuis le 10/09           │
│ [ Débloquer ]   [ Réinitialiser le mot de passe ]           │
└─────────────────────────────────────────────────────────┘
```
**Règle visible critique** : le bouton `[ Bloquer ]` est **absent/désactivé** sur la fiche de l'administrateur lui-même (US-ADMIN-02 : impossible de s'auto-bloquer) — traité **côté UI en plus** de la Policy serveur (défense en profondeur visuelle, pas une confiance aveugle dans le seul frontend). Toute action (bloquer/débloquer/reset) passe par une **modale de confirmation nommant explicitement l'effet** ("Jean ne pourra plus se connecter immédiatement") — jamais une action à un clic pour un effet irréversible/sensible.

#### 4.10.c Journal des tentatives de connexion échouées
`GET /admin/login-attempts`
```
┌─────────────────────────────────────────────────────────┐
│ Filtres : Email[____] IP[____]                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ jean@ex.com   192.168.1.1   Échec   10/09 14:32       │ │
│ │ jean@ex.com   192.168.1.1   Échec   10/09 14:33       │ │
│ └─────────────────────────────────────────────────────┘ │
│ (pagination — purge > 90j gérée backend, pas d'action UI) │
└─────────────────────────────────────────────────────────┘
```
Table dense, lecture seule, pas d'action possible depuis cet écran (consultation uniquement) — un lien contextuel "voir ce compte" par ligne permet de rebondir vers 4.10.b.

---

## 5. Motifs de marque appliqués aux écrans applicatifs

Les écrans marketing (§4.1-4.3) suivent le mockup à la lettre. Les écrans applicatifs (§4.4-4.10) n'existent pas dans le mockup d'origine — règles pour rester dans le même langage visuel sans le reproduire aveuglément là où ça nuirait à l'usage (une table dense de 50 comptes Admin n'a pas besoin de cadrans circulaires) :

| Élément | Où l'utiliser | Où **ne pas** l'utiliser |
|---|---|---|
| **Cormorant Garamond** (serif, parfois italique) | Titres de section à charge émotionnelle : accroche récapitulatif, bandeau "votre devis est conservé", confirmation devis validé, témoignages | Tables de données, formulaires, labels de champ, navigation — toujours Manrope pour le fonctionnel (lisibilité prioritaire sur l'esthétique dans les écrans de travail) |
| **Monospace + letter-spacing** (`Nº0XX`, métadonnées) | Numéros de devis/compte ("Nº012"), horodatages, IDs techniques, labels de section — cohérent avec le "Nº006 · GALERIE" du mockup | Jamais pour du texte long ou un message d'erreur (lisibilité) |
| **Cercles concentriques** (prix) | Aperçu des 3 types de prestation en accueil (§4.1) **et** étape 1 du tunnel de devis (§4.4.a, remplace les cartes rectangulaires génériques — voir ci-dessous) | Tableaux de bord Photographe/Admin (données tabulaires denses = table classique, pas de cercles) |
| **Coins d'angle décoratifs** (viseur) | Cadre du panneau récapitulatif sticky (§4.4.c) et de la carte "devis conservé" (§4.5) — signale "ceci est important, regardez-le" | Pas sur des éléments répétés en liste (une ligne de table, une carte segment) — bruit visuel si dupliqué |
| **Accent or `#C9A46B`** | Élément mis en avant dans un choix (segment actif, offre recommandée), jamais pour une action | Boutons/CTA — restent en accent bronze `#8A5A2F` (rôle "action" réservé, cf. PALETTE.md §2) |

### 4.4.a — révisé : cartes de type de prestation → cercles

```
┌─────────────────────────────────────────────┬─────────────┐
│ [●───○───○] Type → Segments → Récapitulatif  │  RÉCAP      │
├───────────────────────────────────────────────┤  (vide)     │
│ Quel type de prestation ?                     │             │
│                                                │             │
│    ⊙ Portrait    ⊚ Mariage    ⊙ Événementiel  │             │
│   dès 120€      dès 450€     dès 300€         │             │
│  (cercle moyen) (cercle plus │(cercle moyen)   │             │
│                  grand, anneau                │             │
│                  pointillé or                 │             │
│                  = mis en avant)              │             │
└───────────────────────────────────────────────┴─────────────┘
```
Reprend directement le motif "3 formules en cercles" du mockup (§4.1 Nº005). Le cercle "mis en avant" (anneau pointillé or) correspond au type de prestation le plus demandé — champ configurable par le Photographe (`types_prestation.mis_en_avant`, à ajouter à l'Architecture si retenu) plutôt qu'un choix figé arbitrairement.

---

## 6. Réponse explicite aux 5 points de friction (FOUNDATION §11.4)

| # | Friction | Réponse UI concrète | Écran |
|---|---|---|---|
| 1 | Perte perçue du devis en cours à l'inscription | Bandeau permanent "Votre devis [...] est conservé" au-dessus du formulaire d'inscription + retour automatique post-vérification sans ressaisie | §4.5 |
| 2 | Erreurs de géocodage sur adresse mal saisie | Champ adresse avec **autocomplétion** au fil de la frappe + message d'erreur non bloquant avec correction manuelle proposée en cas d'échec serveur | §4.4.b — **alerte technique en §7 : endpoint d'autocomplétion non couvert par API-ENDPOINTS.md actuel** |
| 3 | Tunnel perçu comme long (mariage multi-segments) | Stepper à 3 étapes seulement (pas 1 par segment) + panneau sous-total **live** sticky (φ 38%) + CTA de sortie anticipée dès 1 segment | §4.4.b |
| 4 | Confusion "devis" vs "contrat" | Bandeau explicatif dédié au récapitulatif, formulation reprise du FOUNDATION ("référence d'accord, pas un contrat juridique formel"), répété en rappel discret dans le détail devis Client | §4.4.c, §4.7 |
| 5 | Paramètres tarifaires vides à la première connexion Photographe | Bandeau "valeurs par défaut appliquées, personnalisez-les" sur l'écran de configuration tarifaire (les valeurs existent déjà en base via les seeders Architecte — l'UI ne fait que le signaler, pas de logique d'onboarding forcée en étapes) | §4.9.b |

---

## 7. Alertes pour l'agent suivant (Backend Dev #4 et Frontend Dev #5)

1. **Fortify headless confirmé** : les 4 écrans d'auth (§4.6) sont à coder intégralement — aucune vue Blade fournie par le package, seulement les routes/actions.
2. **État "brouillon" sans ID** (§4.4) : le Frontend doit gérer l'AJAX du tunnel sans supposer un `devis.id` avant `POST /devis` — les endpoints `/ajax/devis/*` opèrent sur la session, pas sur une ressource identifiée par ID.
3. **Autocomplétion d'adresse (friction #2) — endpoint manquant** : aucun endpoint de suggestion d'adresse au fil de la frappe n'est présent dans `API-ENDPOINTS.md` actuel (seul `POST /ajax/devis/segments` existe, et il déclenche le géocodage complet de validation, pas une recherche légère). **Décision à prendre avec le Backend Dev** : soit ajouter un endpoint léger de proxy Nominatim (`/ajax/adresses/suggestions?q=...`, rate-limité et distinct du géocodage de validation), soit accepter un scope réduit (pas d'autocomplétion en V1, seulement le message d'erreur de correction manuelle) — **non bloquant pour le MVP**, à trancher par mentalyas/Backend selon le temps disponible.
4. **Transitions de statut visibles = reflet du `StatutDevisStateMachine`** (§4.9.c) : le sélecteur de statut doit être généré/filtré dynamiquement selon l'état courant, pas une liste statique des 4 valeurs de l'enum — sinon un Photographe pourrait tenter une transition invalide côté UI (rejetée serveur, mais mauvaise UX).
5. **Format PDF confirmé** : aucun composant de prévisualisation HTML custom à construire — un simple lien `<a href="...">` suffit (§4.7), le navigateur gère l'ouverture native.
6. **Design Claude Design réconcilié** (§0, fait le 2026-09-12 avec mentalyas) : tokens réels intégrés dans `PALETTE.md` §0-2, écrans vitrine (§4.1-4.3) alignés sur le mockup, motifs de marque appliqués aux écrans applicatifs en §5. Reste à faire par le Frontend Dev : récupérer les vraies photos du pack `Design/.../uploads/` (ou équivalent) pour remplacer les `image-slot` placeholders.
7. **Palette** : voir `docs/PALETTE.md` — tokens nommés sémantiquement, pas de hex en dur attendu dans le CSS final ; dark mode explicitement hors scope MVP (YAGNI, voir PALETTE.md §4) ; **contrastes §3 (couleurs sémantiques) à revalider par script contre le nouveau fond `#EFE7D8`** (non refait lors de la réconciliation, cf. PALETTE.md en-tête).

---

## 8. Bloc Selfdoubt

Protocole appliqué sur toute décision de structure UI non explicitement dictée par le FOUNDATION ou les User Stories.

| Affirmation | Niveau | Action |
|---|---|---|
| Le split panel φ (62/38%) pour le tunnel de devis et le récapitulatif est le bon pattern de composition | ✅ Confirmé (révisé après réconciliation §0) | Cohérent avec le mockup réel, qui utilise déjà des colonnes asymétriques (ex. mosaïque Nº008 : grille 1fr/300px) — le principe de panneau latéral fixe à côté d'un contenu principal est bien dans l'esprit de la marque, pas juste une convention générique importée |
| Un stepper à exactement 3 étapes (Type → Segments → Récapitulatif) est le bon découpage du tunnel | ⚠️ Probable | Dérivé du workflow FOUNDATION §9.3 (UC-1 à UC-7) qui suit cette logique, mais le nombre d'étapes visibles à l'écran est un jugement UI, pas une donnée du cahier des charges — pourrait aussi être fusionné en 2 étapes (Type+Segments / Récapitulatif) |
| L'autocomplétion d'adresse nécessite un nouvel endpoint non prévu par l'Architecte | ⚠️ Probable | Déduit du fait qu'aucun endpoint de suggestion léger n'apparaît dans `API-ENDPOINTS.md` — mais il est possible que le Backend Dev choisisse un appel direct côté client à l'API Nominatim (sans passer par le backend), ce qui changerait la réponse technique sans changer l'UX ; signalé comme point ouvert plutôt que tranché unilatéralement |
| Le bandeau "valeurs par défaut" sur la configuration tarifaire doit être dismissible et non permanent | ⚠️ Probable | Choix UX pour éviter une bannière permanente agaçante une fois les valeurs personnalisées, mais le FOUNDATION ne précise pas ce comportement (l'Architecte a explicitement laissé ce point "optionnel côté interface", ARCHITECTURE.md §1.4) — la condition de disparition ("tant que jamais modifié") est une interprétation, pas une règle métier tracée |
| Une confirmation modale est nécessaire pour le retrait (soft delete) d'un type de prestation | ✅ Certain | Découle directement de la Constitution Principe III (immuabilité) et de la règle de soft delete de l'Architecte (ARCHITECTURE.md §2.1) — une suppression apparente d'un type doit être explicitement rassurante sur le fait que l'historique n'est pas cassé |
| La palette accent "brun terracotta" est appropriée sans avoir vu le design Claude Design de référence | ❌ Hypothèse | Choix fait en l'absence d'accès à l'outil Claude Design référencé en FOUNDATION §8 — cohérent avec le profil "photographe mariage, lumière naturelle" du CLAUDE.md global, mais **peut entrer en conflit direct** avec la direction visuelle déjà maquettée ; explicitement signalé en §0 comme non tranché définitivement |
| Le badge de statut compte `desactive` doit être visuellement neutre (gris) plutôt que "danger" | ⚠️ Probable | `desactive` n'a pas de définition métier explicite distincte de `bloque` dans le FOUNDATION/USER-STORIES (seul `bloque` a une DoD précise, US-ADMIN-02) — traité par analogie comme un état volontaire/neutre, à confirmer si une US future distingue clairement les deux statuts |

**Hedge-to-Verify Ratio** : 5 affirmations sur 7 marquées ⚠️/❌ (0,71) — ratio élevé et **attendu** pour un livrable UI/UX : contrairement au PO et à l'Architecte qui disposaient de critères d'acceptation et de contraintes techniques déjà tranchés, la majorité des décisions de structure visuelle et d'interaction (layout, nombre d'étapes, comportement des bandeaux) ne sont **jamais** entièrement dictées par un cahier des charges fonctionnel — c'est le rôle de cet agent de proposer une direction, pas de la déduire avec certitude. Aucune incertitude ne porte sur la couverture fonctionnelle des écrans (dérivée directement des 25 User Stories et de FOUNDATION §11.2) ni sur les règles de sécurité/isolation reflétées dans l'UI (issues directement des Policies de l'Architecte). **Point le plus sensible à trancher par mentalyas avant l'implémentation Frontend** : la réconciliation avec le design Claude Design existant (§0), qui peut invalider les choix esthétiques (palette, composition) sans invalider la structure fonctionnelle de ce document.
