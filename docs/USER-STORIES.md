# User Stories — PID
> Rédigé par : Product Owner (Agent #1) — Pipeline IT
> Date : 2026-09-12
> Source : `docs/FOUNDATION.md` (§2 Fonctionnalités, §9 Détail par Fonctionnalité — Niveau 2), `.specify/memory/constitution.md`
> Portée : fonctionnalités MVP uniquement (§2 « Fonctionnalités core »). Les fonctionnalités secondaires (paiement en ligne, signature électronique, notifications email, galerie avancée) sont explicitement hors périmètre de ce document.

---

## Légende

- **DoD** (Definition of Done) : critères mesurables, repris tels quels des « Critères d'acceptation » et « Règles métier » de la section 9 du FOUNDATION — aucun critère inventé.
- **Priorité** : P0 (chemin critique MVP / examen) · P1 (MVP, non bloquant pour un premier parcours de bout en bout) · P2 (MVP, complémentaire). Voir bloc Selfdoubt en fin de document pour le niveau de confiance sur ce classement.
- **Source** : renvoi au use case FOUNDATION correspondant (§9.x, UC-n).

---

## 1. Squelette sécurisé — Authentification & gestion de comptes multi-rôles

*(FOUNDATION §9.1)*

### US-AUTH-01 — Inscription
**En tant que** visiteur, **je veux** créer un compte avec mon email et un mot de passe **afin de** pouvoir accéder aux fonctionnalités réservées (suivi de mes devis, historique).

**Source** : UC-1 Inscription

**DoD** :
- [ ] Le compte est créé avec le statut `en_attente_verification`
- [ ] Un email déjà utilisé ou un mot de passe trop faible produit une erreur explicite (pas de message générique à ce stade — l'utilisateur vient de saisir sa propre information)
- [ ] Le mot de passe est haché (bcrypt), jamais stocké en clair
- [ ] Un email de vérification est envoyé automatiquement à l'inscription

### US-AUTH-02 — Vérification d'email
**En tant que** visiteur venant de m'inscrire, **je veux** recevoir un lien de vérification et l'activer **afin de** prouver que l'email m'appartient et débloquer l'accès à mon compte.

**Source** : UC-1 Inscription (volet vérification)

**DoD** :
- [ ] Inscription + vérification email obligatoire avant toute connexion possible
- [ ] Statut du compte passe de `en_attente_verification` à `actif` après clic sur le lien
- [ ] Lien de vérification expiré → renvoi possible, ancien token invalidé
- [ ] Changement d'email ultérieur (profil) redéclenche une nouvelle vérification

### US-AUTH-03 — Connexion
**En tant qu'**utilisateur inscrit et vérifié, **je veux** me connecter avec mes identifiants **afin d'**accéder à l'espace correspondant à mon rôle (Client / Photographe / Administrateur).

**Source** : UC-2 Connexion

**DoD** :
- [ ] Identifiants corrects + compte `actif` → session ouverte, redirection selon rôle
- [ ] Les 3 rôles redirigent vers 3 espaces distincts
- [ ] Compte bloqué/désactivé → message explicite sans détail sur la raison exacte
- [ ] Toute route protégée rejette côté serveur un accès non autorisé (jamais un contrôle uniquement côté vue)

### US-AUTH-04 — Anti brute-force
**En tant que** responsable de la sécurité du site (rôle porté par le système, supervisé par l'Administrateur), **je veux** que les tentatives de connexion échouées soient limitées et journalisées **afin de** protéger les comptes contre les attaques par essais successifs.

**Source** : UC-4 Anti brute-force

**DoD** :
- [ ] 5 échecs verrouillent temporairement le compte (fenêtre de 15 min, cf. règle métier §9.1)
- [ ] Déverrouillage automatique après expiration, ou manuel par l'Administrateur
- [ ] Chaque tentative (réussie ou échouée) est journalisée dans `login_attempts` (email, IP, horodatage)

### US-AUTH-05 — Mot de passe oublié
**En tant qu'**utilisateur ayant oublié son mot de passe, **je veux** recevoir un lien de réinitialisation à usage unique **afin de** retrouver l'accès à mon compte sans compromettre sa sécurité.

**Source** : UC-3 Mot de passe oublié

**DoD** :
- [ ] Lien de reset à usage unique et à durée de vie limitée
- [ ] Email inconnu en base → même message générique que pour un email connu (anti-énumération)
- [ ] Réinitialisation réussie invalide toutes les sessions actives du compte

### US-AUTH-06 — Modification du profil
**En tant qu'**utilisateur connecté (quel que soit mon rôle), **je veux** modifier mes informations de profil **afin de** garder mes données à jour.

**Source** : UC-5 Modification du profil

**DoD** :
- [ ] Tout rôle peut modifier ses informations depuis son espace
- [ ] Un changement d'email redéclenche une vérification (statut repasse par une étape de confirmation)
- [ ] Aucun message n'expose l'existence d'un compte tiers (ex. lors d'un contrôle d'unicité d'email)

---

## 2. Vitrine / Portfolio

*(FOUNDATION §9.2)*

### US-VITRINE-01 — Consultation du portfolio
**En tant que** visiteur, **je veux** consulter le portfolio filtrable par type de prestation **afin de** me faire une idée du travail du photographe avant de demander un devis.

**Source** : Use cases consultation (§9.2)

**DoD** :
- [ ] Portfolio consultable sans compte
- [ ] Filtrable par type de prestation (catégories alignées sur `types_prestation`)
- [ ] Vue photo en grand format accessible depuis le portfolio

### US-VITRINE-02 — Découverte de l'offre
**En tant que** visiteur, **je veux** consulter l'accueil et la présentation des services **afin de** comprendre l'offre du photographe avant de m'engager dans un devis.

**Source** : Use cases consultation (§9.2)

**DoD** :
- [ ] Page d'accueil et page « présentation des services » accessibles sans compte
- [ ] Chaque page vitrine propose un appel à l'action (CTA) vers le générateur de devis

### US-VITRINE-03 — Gestion du contenu vitrine
**En tant que** Photographe, **je veux** gérer le contenu de ma vitrine (photos, textes) **afin de** maintenir mon portfolio à jour sans intervention technique externe.

**Source** : gestion de contenu réservée au Photographe (§9.2)

**DoD** :
- [ ] Accès à la gestion de contenu réservé au rôle Photographe (vérifié côté serveur)
- [ ] Les modifications sont visibles immédiatement côté public, sans étape de publication séparée
- [ ] Les fichiers uploadés (photos) sont validés en type et en taille avant acceptation

---

## 3. Générateur de devis à la carte

*(FOUNDATION §9.3)*

### US-DEVIS-01 — Choix du type de prestation
**En tant que** visiteur, **je veux** choisir un type de prestation (mariage, portrait, événementiel...) **afin de** démarrer la composition de mon devis avec un forfait de base visible dès le départ.

**Source** : UC-1

**DoD** :
- [ ] Le forfait de base du type de prestation choisi est affiché immédiatement
- [ ] Le choix initialise un devis en cours (session), sans nécessiter de compte

### US-DEVIS-02 — Composition multi-segments
**En tant que** visiteur, **je veux** ajouter un ou plusieurs segments (adresse, heure de début/fin, nombre de personnes) **afin de** décrire précisément le déroulé de ma journée (ex. mariage : mairie → église → salle).

**Source** : UC-2/UC-3

**DoD** :
- [ ] Composition multi-segments possible sans compte
- [ ] Un devis contient au moins 1 segment
- [ ] Les segments sont ordonnés par heure de début croissante

### US-DEVIS-03 — Calcul automatique de la distance
**En tant que** visiteur, **je veux** que la distance entre segments successifs soit calculée automatiquement par géocodage **afin de** ne pas avoir à l'estimer moi-même, avec un prix qui reflète les déplacements réels.

**Source** : UC-4

**DoD** :
- [ ] Distance calculée automatiquement via géocodage (0 pour le premier segment)
- [ ] Distance = distance géodésique depuis le segment précédent
- [ ] Échec ou timeout du géocodage → erreur explicite avec correction manuelle proposée (pas de blocage silencieux)

### US-DEVIS-04 — Prix détaillé
**En tant que** visiteur, **je veux** voir le prix total décomposé ligne par ligne (forfait, distance, heures supplémentaires, suppléments) **afin de** comprendre exactement ce que je paie et pourquoi.

**Source** : UC-5

**DoD** :
- [ ] Prix décomposé ligne par ligne dans l'interface
- [ ] Formule appliquée : forfait_base + Σ(distance × prix/km) + Σ(heures_sup × prix/heure) + suppléments, par segment puis agrégée
- [ ] Paramètres tarifaires lus en base de données, jamais codés en dur

### US-DEVIS-05 — Récapitulatif avant validation
**En tant que** visiteur, **je veux** consulter un récapitulatif complet de ma composition **afin de** vérifier tous les détails avant de m'engager.

**Source** : UC-6

**DoD** :
- [ ] Récapitulatif affiche l'intégralité des segments, distances et décomposition du prix
- [ ] Accessible à tout moment avant validation finale, sans perte de la composition en cours

### US-DEVIS-06 — Conservation du devis pendant l'inscription
**En tant que** visiteur non connecté validant mon devis, **je veux** que ma composition soit conservée pendant que je crée mon compte **afin de** ne pas devoir tout recommencer.

**Source** : UC-7

**DoD** :
- [ ] Devis en cours conservé à travers le parcours d'inscription (perte perçue traitée par un message de réassurance explicite, cf. FOUNDATION §11.4)
- [ ] Après inscription (et selon le flux retenu, après vérification), retour automatique au devis pour finalisation

### US-DEVIS-07 — Intégrité du prix à la validation
**En tant que** Photographe (bénéficiaire de la garantie), **je veux** que le prix soit toujours recalculé côté serveur au moment de la validation **afin de** garantir qu'aucun client ne puisse obtenir un tarif falsifié en manipulant le client (navigateur/requête).

**Source** : Règle métier n°6 (§9.3) ; Constitution principe III

**DoD** :
- [ ] Prix final systématiquement recalculé côté serveur à la validation, jamais fait confiance à une valeur transmise par le client
- [ ] Enregistrement du devis + segments en une transaction atomique unique (tout ou rien)
- [ ] Un devis validé au moins une fois n'est jamais enregistré avec un prix différent de celui recalculé serveur

---

## 4. Devis = contrat (génération & consultation)

*(FOUNDATION §9.4)*

### US-CONTRAT-01 — Génération automatique du document
**En tant que** Client venant de valider un devis, **je veux** recevoir automatiquement un document devis=contrat **afin de** disposer d'une preuve écrite et détaillée de ce qui a été convenu.

**Source** : génération automatique à la validation (§9.4)

**DoD** :
- [ ] Document généré automatiquement à la validation du devis (pas d'action manuelle supplémentaire)
- [ ] Détail complet présent dans le document (segments, distances, décomposition du prix)
- [ ] Valeurs figées (`donnees_figees`) au moment de la génération, immuables ensuite même si les paramètres tarifaires changent
- [ ] Format du document (PDF vs HTML imprimable) : **point ouvert non tranché** (cf. FOUNDATION §12) — à lever par l'Architecte avant implémentation

### US-CONTRAT-02 — Historique et téléchargement (Client)
**En tant que** Client, **je veux** consulter et télécharger l'historique de mes devis/contrats **afin de** retrouver mes documents à tout moment, sans jamais voir ceux d'un autre client.

**Source** : consultation Client, isolation stricte (§9.4)

**DoD** :
- [ ] Un Client ne consulte/télécharge que ses propres devis
- [ ] Isolation stricte même en cas de manipulation directe d'URL (ex. changement d'ID dans l'adresse)
- [ ] Téléchargement sert toujours le même fichier déjà généré (pas de régénération à chaque téléchargement)

### US-CONTRAT-03 — Vue globale et suivi de statut (Photographe)
**En tant que** Photographe, **je veux** consulter une vue globale filtrable de tous les devis clients et faire évoluer leur statut **afin de** suivre l'avancement de mes prestations et servir de base à ma facturation manuelle (Smart).

**Source** : vue globale, cycle de statut (§9.4)

**DoD** :
- [ ] Photographe a un accès global en lecture à tous les devis
- [ ] Écriture limitée au champ statut (pas de modification des données figées)
- [ ] Cycle de statut respecté : `en_attente` → `confirmé` → `réalisé` ; `annulé` possible depuis `en_attente` ou `confirmé`
- [ ] Un devis `réalisé` ne change plus jamais de statut
- [ ] Vue paginée si volume important

### US-CONTRAT-04 — Immuabilité du document
**En tant que** Photographe et Client (garantie mutuelle), **je veux** que le document ne soit jamais recalculé depuis les paramètres tarifaires courants **afin de** préserver sa valeur de preuve en cas de litige, même si les tarifs évoluent après coup.

**Source** : Règle métier n°4 (§9.4) ; Constitution principe III

**DoD** :
- [ ] Le document est toujours régénéré/servi à partir de `donnees_figees`, jamais recalculé depuis `parametres_tarifaires` courants
- [ ] Génération + snapshot exécutés dans une même transaction

---

## 5. Administration des comptes

*(FOUNDATION §9.5)*

### US-ADMIN-01 — Liste des comptes
**En tant qu'**Administrateur, **je veux** lister tous les comptes utilisateurs **afin d'**avoir une vue d'ensemble pour la supervision.

**Source** : liste des comptes (§9.5)

**DoD** :
- [ ] Accès exclusif Administrateur, vérifié côté serveur (pas seulement masqué côté vue)
- [ ] Liste affiche a minima email, rôle, statut du compte

### US-ADMIN-02 — Blocage / déblocage
**En tant qu'**Administrateur, **je veux** bloquer ou débloquer un compte manuellement **afin de** gérer les comptes suspects ou répondre à une demande de déblocage légitime.

**Source** : blocage/déblocage (§9.5)

**DoD** :
- [ ] Blocage effectif immédiatement (le compte bloqué ne peut plus se connecter dès l'action confirmée)
- [ ] Impossible pour un Administrateur de se bloquer lui-même accidentellement
- [ ] Action journalisée avec auteur et horodatage

### US-ADMIN-03 — Réinitialisation à la demande
**En tant qu'**Administrateur, **je veux** réinitialiser le mot de passe d'un compte à la demande **afin d'**aider un utilisateur qui ne peut pas utiliser le flux self-service (mot de passe oublié).

**Source** : réinitialisation à la demande (§9.5)

**DoD** :
- [ ] Action réservée à l'Administrateur, vérifiée côté serveur
- [ ] Action journalisée avec auteur et horodatage
- [ ] Le mécanisme réutilise les garanties de sécurité du reset self-service (lien à usage unique, durée limitée — cf. US-AUTH-05), pas un mot de passe en clair transmis à l'admin

### US-ADMIN-04 — Journal des tentatives échouées
**En tant qu'**Administrateur, **je veux** consulter le journal des tentatives de connexion échouées **afin de** détecter un comportement suspect (brute-force, énumération de comptes).

**Source** : consultation du journal (§9.5) ; table `login_attempts` (§10.1)

**DoD** :
- [ ] Accès exclusif Administrateur, vérifié côté serveur
- [ ] Journal consultable par compte et/ou par IP, avec horodatage
- [ ] Purge des entrées au-delà de 90 jours (cas limite §10.1)

---

## Récapitulatif — priorisation proposée

| Priorité | Stories | Justification |
|----------|---------|----------------|
| **P0** — chemin critique MVP | US-AUTH-01, 02, 03 · US-DEVIS-01 à 07 · US-CONTRAT-01, 02, 04 | Sans ces stories, le parcours principal (FOUNDATION §11.1, Parcours A) est incomplet : un visiteur ne peut ni s'inscrire/se connecter, ni composer un devis fiable, ni recevoir un document probant. |
| **P1** — MVP, sécurité/suivi | US-AUTH-04, 05 · US-CONTRAT-03 · US-ADMIN-01, 02 | Renforce la sécurité (anti brute-force, reset) et le suivi métier (Photographe), mais un premier parcours de bout en bout peut être démontré sans ces éléments finalisés. |
| **P2** — MVP, complémentaire | US-AUTH-06 · US-VITRINE-01, 02, 03 · US-ADMIN-03, 04 | Améliore l'expérience et la supervision mais n'empêche pas la démonstration du cœur de valeur (devis=contrat) si livré en dernier. |

⚠️ Ce tableau de priorisation est une **hypothèse du Product Owner**, non un arbitrage explicite du FOUNDATION.md — voir bloc Selfdoubt ci-dessous pour le détail des points d'incertitude.

---

## Bloc Selfdoubt

| Affirmation | Niveau | Action |
|---|---|---|
| Les 5 fonctionnalités MVP listées en §2 du FOUNDATION correspondent exactement aux 5 sous-sections détaillées en §9 (9.1 à 9.5) | ✅ Certain | Aucune — correspondance directe et explicite dans le document source |
| Les critères d'acceptation et règles métier utilisés comme DoD sont ceux déjà rédigés en §9, sans ajout de nouveaux critères non sourcés | ✅ Certain | Vérifié ligne à ligne lors de la rédaction |
| La priorisation P0/P1/P2 proposée (US-DEVIS et US-CONTRAT en tête, Vitrine et Admin secondaires) reflète l'intention réelle de mentalyas | ⚠️ Probable | Confirmer avec mentalyas avant que l'Architecte ne s'appuie dessus pour séquencer le développement — le FOUNDATION ne classe pas explicitement les 5 fonctionnalités entre elles |
| US-AUTH doit passer avant US-DEVIS dans l'ordre de développement réel malgré leur priorité P0 commune | ⚠️ Probable | Hypothèse fondée sur le fait que le squelette sécurisé est enseigné en direct par le professeur (séances du samedi) et conditionne le reste — mais le générateur de devis peut techniquement démarrer en session sans compte (règle métier §9.3) ; à trancher par l'Architecte selon le calendrier des séances |
| Le format du document devis=contrat (PDF vs HTML imprimable) n'a pas d'impact sur la formulation des User Stories elles-mêmes | ⚠️ Probable | Le point reste explicitement ouvert (FOUNDATION §12) et signalé dans la DoD de US-CONTRAT-01 comme prérequis avant implémentation — l'Architecte doit trancher avant Phase 2 |
| Aucune User Story dédiée n'est nécessaire pour l'onboarding "paramètres tarifaires vides à la première connexion Photographe" (point de friction §11.4) | ❌ Hypothèse | Point de friction identifié en Niveau 4 mais sans use case ni critère d'acceptation formel en §9 — non traduit en story pour respecter la consigne "ne pas inventer de zéro" ; signalé à l'Architecte/UI-UX comme candidat à couvrir en conception (valeurs par défaut ou écran d'onboarding court) |
| Le rattachement de "Modification du profil" (US-AUTH-06) au périmètre MVP P2 plutôt qu'à une fonctionnalité secondaire | ⚠️ Probable | UC-5 est bien listé dans le use case §9.1 (MVP), donc rattachement justifié ; le niveau de priorité (P2, bas dans le MVP) reste un jugement du PO, pas une donnée du FOUNDATION |

**Hedge-to-Verify Ratio** : 4 affirmations sur 6 sont marquées ⚠️/❌ (0,67) — ratio élevé car il concerne uniquement la couche priorisation/séquencement (qui n'est pas fournie explicitement par le FOUNDATION) et deux points ouverts déjà identifiés comme tels dans le cahier des charges. Aucune incertitude ne porte sur le contenu ou le périmètre des User Stories elles-mêmes, qui restent 100% tracées aux use cases et critères d'acceptation existants. **Recommandation** : mentalyas valide (ou corrige) la table de priorisation avant que l'Architecte (#2) ne l'utilise pour séquencer l'architecture et les endpoints.
