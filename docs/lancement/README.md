# Dossier de lancement — PID · Moteur du générateur de devis

> Projet : pid · Type : Web App · Démarré le : 2026-11-11
> **Dossier : prêt à coder** (2026-11-11)
> Périmètre : **logique métier du générateur de devis** (cœur de PID). Le front et la direction artistique sont faits dans le projet PortfolioPhotographe, puis importés dans PID.
> Matière première : `docs/brainstorm/generateur-devis/L1-fondation.md` (11/11, format `/brainstorm` classique, conservé). Les anciens `docs/brainstorm/L*.md` et `docs/FOUNDATION.md` (septembre) ne servent pas d'entrée (décision mentalyas du 11/11 : page blanche).

## Statut des documents

| # | Document | Statut | Version | Validé le | Lit |
|---|----------|--------|---------|-----------|-----|
| 01 | [PRD — exigences produit](01-PRD.md) | validé | 2.1 | 2026-11-11 | — |
| 02 | [TRD — exigences techniques](02-TRD.md) | validé | 1.1 | 2026-11-11 | 01 |
| 03 | [App Flow — navigation](03-APP-FLOW.md) | validé | 1.2 | 2026-11-11 | 01, 02 |
| 04 | [Brief UX/UI](04-UX-UI.md) | validé (sans objet) | 1.0 | 2026-11-11 | 01, 03 |
| 05 | [Schéma Backend](05-BACKEND.md) | validé | 1.1 | 2026-11-11 | 01, 02, 03 |
| 06 | [Plan d'implémentation](06-PLAN.md) | validé | 1.0 | 2026-11-11 | 01 à 05 |

## Signaux de complexité
<!-- Rempli à la validation du PRD. -->
| Signal | Présent | Où il se traduit |
|--------|---------|------------------|
| Logique complexe | Oui | États du dossier (F06, stateDiagram), ordre de calcul (F03), réductions et cumul (F05) → diagrammes de séquence au TRD |
| API tierce | Oui | Géocodage et distance routière (F04) → fiches API et ADR au TRD. Pinterest : lien seul en MVP, aucune API |
| Données sensibles | Oui, moyen | Identité, email et adresses des clients ; domicile du photographe (R04.8) ; montants engageants (P05) → bloc sécurité renforcé au TRD et au Backend |
| Multi-rôles | Oui | Visiteur, Client, Photographe (matrice PRD §3) → permissions par table au Backend |
| Plus de 10 écrans | Sans objet dans PID | Les écrans sont conçus dans PortfolioPhotographe ; l'App Flow de PID décrit les actions du moteur |

## Registre des IDs

| Préfixe | Désigne | Défini dans |
|---------|---------|-------------|
| `P01` | Principe directeur | 01-PRD |
| `F01` | Fonctionnalité | 01-PRD |
| `UC01.1` | Cas d'usage de F01 | 01-PRD |
| `R01.1` | Règle métier de F01 | 01-PRD |
| `MSG01` | Message d'interface hors cas d'usage | 01-PRD |
| `API01` | API tierce (API01 distance, API02 images) | 02-TRD |
| `E01` | Écran | 03-APP-FLOW |
| `P1` | Parcours (sans zéro, distinct des principes P01) | 03-APP-FLOW |
| `T01` | Table | 05-BACKEND |
| `L01` | Lot de développement | 06-PLAN |
| `ADR-001` | Décision | decisions/ |

### Fonctionnalités
| ID | Nom | Périmètre |
|----|-----|-----------|
| F01 | Catalogue : services, options, modes de prix, TVA | MVP |
| F02 | Fiches techniques : types, champs, liaison aux services | MVP |
| F03 | Moteur de calcul du devis | MVP |
| F04 | Transport : calculé depuis les adresses du devis | MVP |
| F05 | Réductions | MVP |
| F06 | Cycle de vie du dossier client | MVP |
| F07 | Dossier en PDF (généré par le moteur) | MVP |
| F08 | ERP — Suivi clients | MVP |
| F09 | ERP — Suivi de production | MVP |
| F10 | ERP — Argent et chiffre d'affaires | MVP |
| F11 | ERP — Statistiques | MVP |
| F12 | ERP — Gestion de la vitrine | MVP |
| F13 | ERP — Planning | MVP |

## Décisions (ADR)
| ID | Décision | Statut |
|----|----------|--------|
| [ADR-001](decisions/ADR-001-moteur-pur-laravel.md) | Moteur PHP pur dans Laravel 13, vues Blade + jQuery | acceptée |
| [ADR-002](decisions/ADR-002-openrouteservice.md) | OpenRouteService pour géocodage et distance | acceptée |
| [ADR-003](decisions/ADR-003-dompdf.md) | Dompdf pour les PDF | acceptée |
| [ADR-004](decisions/ADR-004-pid-local.md) | PID local uniquement ; mise en ligne via PortfolioPhotographe | acceptée |
| [ADR-005](decisions/ADR-005-php-84.md) | PHP 8.4 | acceptée |
| [ADR-006](decisions/ADR-006-herd-mysql.md) | Environnement local : Laravel Herd + MySQL 8.4 LTS | acceptée |
| [ADR-007](decisions/ADR-007-cloudinary.md) | Cloudinary pour les images de la vitrine | acceptée |
| [ADR-008](decisions/ADR-008-mailpit.md) | Emails capturés par Mailpit en local | acceptée |

## Questions ouvertes
| # | Question | Doc concerné | Bloquante | Statut |
|---|----------|--------------|-----------|--------|
| Q1 | Modes de prix P1 à P6 ? | 01 (F01) | Oui | ✅ tranchée : les 6 (11/11) |
| Q2 | Étapes du dossier ? | 01 (F06) | Oui | ✅ tranchée : 7 étapes, transitions par le photographe (11/11) |
| Q3 | Taux de TVA ? | 01 (F01) | Oui | ✅ tranchée : général, remplaçable par service et par option (11/11) |
| Q9 | Portée de la date limite ? | 01 (F02, F06) | Oui | ✅ tranchée : demandes d'ajout et fiches (11/11) |
| Q10 | Arrondi au centime, demi-centime vers le haut (proposé) | 01 (F03) | Oui | ✅ validée (11/11) |
| Q11 | Un prix saisi TVAC reste exact ; HTVA et TVA en sont déduits (proposé) | 01 (F03) | Oui | ✅ validée (11/11) |
| Q12 | Sans adresse, le total s'affiche marqué « incomplet » (proposé) | 01 (F04) | Non | ✅ validée (11/11) |
| Q13 | Le domicile du photographe n'est jamais affiché au client (proposé) | 01 (F04) | Oui | ✅ validée (11/11) |
| Q14 | Parrainage : fonctionnement ? | 01 (F05) | Oui | ✅ tranchée : code personnel, récompenses réglables, bon pour le parrain acquis à l'étape réglée (11/11) |
| Q15 | Interdire l'auto-parrainage (même compte ou même email) (proposé) | 01 (F05) | Oui | ✅ validée (11/11) |
| Q16 | Frais d'annulation au cas par cas, comme un retrait (proposé) | 01 (F06) | Oui | ✅ validée (11/11) |
| Q17 | Date limite calculée par shooting dans un dossier multi-shootings (proposé) | 01 (F06) | Oui | ✅ validée (11/11) |
| Q18 | Quotas du géocodage OpenRouteService et conditions d'utilisation (page des offres non lisible automatiquement) | 02 (API01) | Non | ouverte — vérifier à la création du compte |
| Q19 | Environnement local ? | 02 | Oui | ✅ tranchée : Laravel Herd (gratuit) + MySQL Community 8.4 LTS (11/11) |
| Q20 | Emplacement du projet Laravel ? | 02 | Oui | ✅ tranchée : `src/` = racine Laravel, Auth déplacé dans `src/app/Domain/Auth` (11/11) |
| Q21 | Valeurs proposées du TRD | 02 | Oui | ✅ validées (11/11) |
| Q22 | Envoi d'emails ? | 02 | Oui | ✅ tranchée : Mailpit en local (ADR-008, 11/11) |
| Q23 | Échéances non payées recalculées quand le total change, échéances payées jamais modifiées (proposé) | 01 (F10) | Oui | ✅ validée (11/11) |
| Q24 | API02 Cloudinary ? | 02 | Oui | ✅ tranchée : compte de PortfolioPhotographe, dossier `pid/` (ADR-007, 11/11) |
| Q25 | Capacité : seuls les dossiers acceptés et confirmés occupent un jour, les soumis sont signalés (proposé) | 01 (F13) | Oui | ✅ validée (11/11) |
| Q26 | Messages MSG20-MSG23 (envoi du devis, galeries vides, clients vides, production vide) ajoutés au PRD avec l'App Flow v1.2 | 01, 03 | Oui | ✅ validés (PRD v2.1, 11/11) |
| Q4 | Jeu de cas de calcul commun aux implémentations PHP et TypeScript (proposé par Claude) | 01, 02 | Non | ✅ validée (11/11) |
| Q5 | Rôle Administrateur distinct du Photographe ? | 01 | Oui | ✅ tranchée : non, Photographe seul (11/11) |
| Q6 | Prix d'un ajout validé après soumission ? | 01 (F06) | Oui | ✅ tranchée : prix du jour de la demande (11/11) |
| Q7 | Échange de documents dans le dossier ? | 01 | Oui | ✅ tranchée : pas d'échange de fichiers ; le moteur génère le dossier en PDF → F07 (11/11) |
| Q8 | Montants de la situation actuelle dans le PRD ? | 01 | Non | ✅ tranchée : gardés comme contexte (11/11) |

## Liens
- Canvas Design : sans objet dans PID — `PortfolioPhotographe/docs/front/canvas-da-morphic/`
- Tokens : `PortfolioPhotographe/src/app/globals.css`, copiés dans `src/resources/css/app.css` (04-UX-UI §2)
