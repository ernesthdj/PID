# Tâches — PID

> Deux branches séparées, reliées seulement par des correspondances « mécanisme du cours ↔ équivalent Laravel » :
> - **Branche A — PID cours** (lots A*) : rien à implémenter ; on ajoute le code du prof et on en extrait de la documentation.
> - **Branche B — Projet perso** (lots B*) : l'implémentation du site photographe en Laravel, au rythme de ce que le cours a débloqué.
>
> Règle de porte : avant toute tâche de la branche B, vérifier dans `RYTHME-COURS.md` que la notion de cours correspondante est vue.
> Les critères d'acceptation détaillés restent dans `USER-STORIES.md` et `TACHES-Catalogue-services.md` : ce fichier ne les recopie pas.
> Légende : `[x]` fait · `[~]` en cours · `[ ]` à faire.

## A1 · PID cours — Intégrer le cours du samedi

Chaque nouveau cours (`Suivit_Cours/pid.aaaammjj/`) : déposer le code du prof, rédiger les notes dans `docs/academique/`, cocher la notion dans `RYTHME-COURS.md`.

- [x] T001 Cours 29/08 — racine du site, index.content, configuration
- [x] T002 Cours 05/09 — autoloader (première version)
- [x] T003 Cours 12/09 — PID_PathTo/Include, autoloader + retry, POO
- [x] T004 Cours 19/09 — dossier .pid, CPage, trait CSS/JS
- [x] T005 Cours 10/10 — IExhibitable/TExhibitable, sessions, premier JS/jQuery (notes + RYTHME-COURS mis à jour le 2026-10-11)
- [ ] T006 Cours du 17/10 — à intégrer dès que `Suivit_Cours/pid.20261017/` est déposé

## A2 · PID cours — Documentation extraite du cours

- [x] T007 Notes de cours et glossaires PHP / POO / web (`docs/academique/`)
- [x] T008 Correspondances Laravel ↔ framework PID (`academique/Laravel ↔ framework PID — Correspondances.md`), à jour jusqu'au 10/10 — à compléter à chaque cours
- [x] T009 Vidéo explicative Remotion du framework PID (`video/`) — chapitres Bootstrap, Autoloader, Singleton, CPage et Exhibit + premier JS (cours du 10/10) — à compléter à chaque cours

## A3 · PID cours — Points du code du prof à confirmer en cours

Relevés dans le JOURNAL (21/09, 28/09) ; état vérifié dans `src/prof/`.

- [x] T010 `CFileCollection::Add/Insert` : `in_array` sur un booléen — corrigé par le prof le 10/10 (`m_Items`)
- [x] T011 `PID_PathTo("*page.php")` produisait un double slash — corrigé le 10/10 (slash initial retiré)
- [ ] T012 Action `updateIndexes` déclenchable par URL sans contrôle d'accès
- [ ] T013 Écriture concurrente du cache `.class.register.php`
- [ ] T014 `__wakeup()` déclaré `protected` (avertissement probable sous PHP 8)
- [ ] T015 Casse des noms de fichiers sous Linux (le registre note `.pid/FileCollection.php`, le fichier est `filecollection.php`)
- [ ] T016 `new X()->m()` sans parenthèses exige PHP 8.4
- [ ] T017 Comportement de `CMonApp::DoSomething()` avec des arguments vides

## B1 · Projet perso — Aligner les docs sur l'auth écrite à la main

- [ ] T018 Retirer Fortify de `FOUNDATION.md`
- [ ] T019 Retirer Fortify de `ARCHITECTURE.md`
- [ ] T020 Retirer Fortify de `API-ENDPOINTS.md`
- [ ] T021 Retirer Fortify de `UI-DESIGN.md`

## B2a · Projet perso — Socle Laravel, vitrine, Domain/ pur (débloquée)

- [ ] T022 Installer le squelette Laravel dans `src/`
- [ ] T023 Layout Blade + tokens CSS de la palette (`PALETTE.md`, `UI-DESIGN.md`)
- [ ] T024 Classes `Domain/` du catalogue + tests unitaires des règles R1 à R4 (`brainstorm/L2-catalogue-services.md`)
- [ ] T025 Pages vitrine statiques : accueil, portfolio, services

## B2b · Projet perso — Schéma MySQL et migrations (après le cours MySQL/PDO)

- [ ] T026 Schéma MySQL et migrations

## B2c · Projet perso — Auth, rôles, accès restreints (après les cours comptes + sécurité)

- [ ] T027 Auth, rôles, accès restreints (auth écrite à la main sur Hash / Auth::login / middleware)

## B2d · Projet perso — Tunnel de devis jQuery + AJAX (après les cours JS/jQuery et AJAX)

- [ ] T028 Tunnel de devis jQuery + AJAX (endpoints `/ajax/`, voir `API-ENDPOINTS.md`)

## B2e · Projet perso — Document devis = contrat, géocodage (après 2b et 2d)

- [ ] T029 Document devis = contrat, géocodage (trancher PDF ou HTML imprimable)

## B3 · Projet perso — Préparer l'oral « sous le capot »

Défendre son propre code : relier chaque critère de la grille d'examen à ce qui tourne dans le projet et au mécanisme du cours correspondant (oral après le 30/01/2027).

- [ ] T030 Choisir la forme des fiches d'oral (par critère de la grille ?)
- [ ] T031 Rédiger une fiche par critère de la grille, au fil des étapes 2a → 2e
