# API Endpoints — PID
> Rédigé par : Software Architect (Agent #2) — Pipeline IT
> Date : 2026-09-12
> Convention : application monolithique Laravel (session + CSRF, pas de préfixe `/api/v1/` — justifié dans `docs/ARCHITECTURE.md` §1.3). `/ajax/*` = appels XHR jQuery consommés par la même page, pas une API publique.
> Auth-comptes, générateur-devis et devis-contrat reprennent et complètent les contrats déjà détaillés en FOUNDATION §10 (marqués *FOUNDATION §10.x*). Vitrine-portfolio et administration-comptes sont entièrement définis ici (non couverts au niveau 3 du brainstorm).

Légende rôle requis : **Public** (aucune session) · **Authentifié** (tout rôle connecté) · **Client** · **Photographe** · **Administrateur**.

---

## 1. Authentification & gestion de comptes (Fortify)

*FOUNDATION §10.1 — repris tel quel, actions Fortify custom précisées.*

| Endpoint | Méthode | Rôle requis | Entrée | Sortie | Erreurs |
|---|---|---|---|---|---|
| `/register` | POST | Public | `name, email, password, password_confirmation` | Compte créé (`role=client`, `statut_compte=en_attente_verification`) via `CreateNewUser` (Fortify custom) | 422 |
| `/login` | POST | Public | `email, password` | Session ouverte, redirection selon `role` (`LoginResponse` custom) | 422 (identifiants invalides), 423 (compte bloqué/désactivé — message générique) |
| `/logout` | POST | Authentifié | — | Session détruite | — |
| `/email/verify/{id}/{hash}` | GET | Authentifié (lien signé) | Signed URL | `statut_compte → actif` | 403 (signature invalide/expirée) |
| `/email/verification-notification` | POST | Authentifié non vérifié | — | Nouvel email envoyé, ancien token invalidé | 429 |
| `/forgot-password` | POST | Public | `email` | Email de reset (message générique anti-énumération) | 429 |
| `/reset-password` | POST | Public (token signé) | `token, email, password, password_confirmation` | Mot de passe mis à jour, **toutes** les sessions du compte invalidées | 422 |
| `/ajax/check-email` | GET (AJAX) | Public | `email` | `{available: bool}` | 422 |

### Profil (US-AUTH-06, complément — non détaillé §10.1)

| Endpoint | Méthode | Rôle requis | Entrée | Sortie | Erreurs |
|---|---|---|---|---|---|
| `/profil` | GET | Authentifié | — | Informations du profil courant | — |
| `/profil` | PUT | Authentifié | `name, email` | Profil mis à jour. Si `email` change : `email_verified_at=null` + nouvel email de vérification envoyé | 422 |
| `/profil/mot-de-passe` | PUT | Authentifié | `current_password, password, password_confirmation` | Mot de passe mis à jour | 422 (mot de passe actuel incorrect) |

---

## 2. Vitrine / Portfolio (complément — non détaillé au niveau 3 du FOUNDATION)

### Public

| Endpoint | Méthode | Rôle requis | Entrée | Sortie | Erreurs |
|---|---|---|---|---|---|
| `/` | GET | Public | — | Page d'accueil (lit `contenus_vitrine` cle=`accueil`) | — |
| `/services` | GET | Public | — | Présentation des services (lit `contenus_vitrine` cle=`services`) | — |
| `/portfolio` | GET | Public | `type_prestation_id` (query, optionnel) | Liste des médias publiés (`publie=true`), filtrée si fourni | — |
| `/ajax/portfolio/{media}` | GET (AJAX) | Public | — | Détail média (vue grand format/lightbox) | 404 |

### Photographe — gestion de contenu (US-VITRINE-03)

| Endpoint | Méthode | Rôle requis | Entrée | Sortie | Erreurs |
|---|---|---|---|---|---|
| `/photographe/vitrine` | GET | Photographe | — | Tableau de bord CMS (médias + contenus texte) | 403 |
| `/photographe/vitrine/medias` | POST | Photographe | `fichier (image), type_prestation_id?, titre, description?, ordre` | Média créé (validation type/taille avant acceptation) | 422 (type/taille invalide), 403 |
| `/photographe/vitrine/medias/{media}` | PUT | Photographe | `titre?, description?, type_prestation_id?, ordre?, publie?` | Média mis à jour, **visible immédiatement en public** (pas de publication différée) | 404, 403 |
| `/photographe/vitrine/medias/{media}` | DELETE | Photographe | — | Média supprimé | 404, 403 |
| `/photographe/vitrine/contenus/{cle}` | PUT | Photographe | `titre, contenu` | Contenu texte mis à jour (accueil/services) | 404, 403, 422 |

---

## 3. Générateur de devis à la carte

*FOUNDATION §10.2 — repris, complété par la configuration tarifaire côté Photographe (nécessaire au fonctionnement du générateur mais absente du contrat §10.2 d'origine).*

### Public / Session (composition, avant persistance en base — cf. ARCHITECTURE §2.2)

| Endpoint | Méthode | Rôle requis | Entrée | Sortie | Erreurs |
|---|---|---|---|---|---|
| `/devis/type` | POST | Public | `type_prestation_id` | Devis en cours initialisé en session, forfait de base affiché | 422 |
| `/ajax/devis/segments` | POST (AJAX) | Public | `adresse, heure_debut, heure_fin, nb_personnes` | `{distance_km, sous_total}` (géocodage + calcul depuis segment précédent) | 422 (validation), 502 (géocodage indisponible → correction manuelle proposée), 429 (rate limit géocodage) |
| `/ajax/devis/segments/{ordre}` | DELETE (AJAX) | Public | — | Segments recalculés (distances/prix) | 404 |
| `/ajax/devis/recapitulatif` | GET (AJAX) | Public | — | Détail complet (segments, distances, décomposition prix) | — |
| `/devis` | POST | **Authentifié + vérifié** | (confirmation de la session en cours) | Prix **recalculé serveur**, transaction atomique `devis` + `devis_segments`, `donnees_figees` figées, PDF généré | 422, 409 (soumission déjà traitée — token anti-double-clic) |

> Si l'utilisateur n'est pas connecté au moment de `POST /devis`, il est redirigé vers `/register` (US-DEVIS-06) ; la composition reste en session Laravel (driver `database`) jusqu'à inscription + vérification email complétées, puis `POST /devis` est rejoué automatiquement.

### Photographe — configuration tarifaire (nécessaire à US-DEVIS-04, absent de FOUNDATION §10.2)

| Endpoint | Méthode | Rôle requis | Entrée | Sortie | Erreurs |
|---|---|---|---|---|---|
| `/photographe/types-prestation` | GET | Photographe | — | Liste des types (actifs + soft-deleted marqués) | 403 |
| `/photographe/types-prestation` | POST | Photographe | `nom, forfait_base, description?` | Type créé | 422, 403 |
| `/photographe/types-prestation/{id}` | PUT | Photographe | `nom?, forfait_base?, description?` | Type mis à jour | 404, 422, 403 |
| `/photographe/types-prestation/{id}` | DELETE | Photographe | — | **Soft delete** (préserve les devis historiques déjà liés) | 404, 403 |
| `/photographe/parametres-tarifaires` | GET | Photographe | — | Liste clé/valeur | 403 |
| `/photographe/parametres-tarifaires` | PUT | Photographe | `[{cle, valeur}, ...]` | Valeurs mises à jour (jamais rétroactif sur les devis déjà `donnees_figees`) | 422, 403 |

---

## 4. Devis = contrat (génération & consultation)

*FOUNDATION §10.3 — repris tel quel.*

| Endpoint | Méthode | Rôle requis | Entrée | Sortie | Erreurs |
|---|---|---|---|---|---|
| `/mes-devis` | GET | Client | — | Liste paginée des devis du client connecté uniquement | — |
| `/mes-devis/{devis}` | GET | Client | — | Détail lecture seule (Policy `client_id === user.id`) | 403, 404 |
| `/mes-devis/{devis}/telecharger` | GET | Client | — | Stream du PDF déjà généré (`chemin_document`), jamais régénéré | 403 (Policy), 404 |
| `/photographe/devis` | GET | Photographe | filtres (`statut`, `type_prestation_id`, `client`, pagination) | Liste paginée, accès global en lecture | 403 |
| `/photographe/devis/{devis}` | GET | Photographe | — | Détail complet (lecture seule des données figées) | 403, 404 |
| `/photographe/devis/{devis}/statut` | PATCH (AJAX) | Photographe | `nouveau_statut` | Statut mis à jour **si transition valide** (`en_attente→confirme→realise`, `annule` depuis `en_attente`/`confirme`) | 403, 422 (transition invalide ou devis `realise`) |

> Note de nommage : FOUNDATION §10.3 utilisait `/admin/devis*` pour ces deux dernières routes ; renommé `/photographe/devis*` car le rôle réellement autorisé (§9.4, Policy) est **Photographe**, pas Administrateur — évite une confusion de périmètre avec la section 5 ci-dessous, qui est le véritable espace `/admin/*`.

---

## 5. Administration des comptes (complément — non détaillé au niveau 3 du FOUNDATION)

Toutes les routes sous `/admin/*` : middleware `role:administrateur` (défense en profondeur) + `UserPolicy` par action (autorisation de référence). Chaque mutation écrit une entrée `admin_action_logs` (auteur, cible, horodatage).

| Endpoint | Méthode | Rôle requis | Entrée | Sortie | Erreurs |
|---|---|---|---|---|---|
| `/admin/utilisateurs` | GET | Administrateur | filtres (`role`, `statut_compte`, pagination) | Liste paginée : email, rôle, statut | 403 |
| `/admin/utilisateurs/{user}` | GET | Administrateur | — | Détail compte | 403, 404 |
| `/admin/utilisateurs/{user}/bloquer` | PATCH (AJAX) | Administrateur | — | `statut_compte=bloque` effectif immédiatement + log | 403 (dont auto-blocage refusé), 404 |
| `/admin/utilisateurs/{user}/debloquer` | PATCH (AJAX) | Administrateur | — | `statut_compte=actif`, `verrouille_jusqua=null` + log | 403, 404 |
| `/admin/utilisateurs/{user}/reset-mot-de-passe` | POST (AJAX) | Administrateur | — | Réutilise le mécanisme self-service (lien signé usage unique, durée limitée) — **aucun mot de passe en clair transmis** + log | 403, 404 |
| `/admin/login-attempts` | GET | Administrateur | filtres (`email`, `ip_address`, pagination) | Journal des tentatives, horodaté | 403 |

---

## 6. Récapitulatif — couverture des 5 fonctionnalités MVP

| Fonctionnalité | Endpoints | Source |
|---|---|---|
| Auth & comptes multi-rôles | §1 (8 endpoints Fortify + 3 profil) | FOUNDATION §10.1 + complément profil |
| Vitrine / Portfolio | §2 (4 publics + 5 Photographe) | Entièrement défini ici |
| Générateur de devis | §3 (5 session/public + 1 validation + 6 config tarifaire) | FOUNDATION §10.2 + complément configuration |
| Devis = contrat | §4 (6 endpoints) | FOUNDATION §10.3 (renommage `/photographe/devis*` justifié) |
| Administration des comptes | §5 (6 endpoints) | Entièrement défini ici |
