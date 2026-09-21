# CLAUDE.md — PID

> **Projet :** PID
> **Slug :** pid
> **Type :** Web App
> **Cree le :** 2026-09-12
> **Description :** Project scolaire d'integration et developpement, avec à la clé un project à developper tout en répondant aux consignes du professeur

---

## Contexte

Ce projet a ete cree via `/hub new` dans le workspace ProjectMaster.
La stack et les dependances seront definies apres le brainstorm initial (`/brainstorm`).

## Structure

```
pid/
├── CLAUDE.md          # Ce fichier
├── docs/
│   └── JOURNAL.md     # Journal du projet
├── graphify-out/      # Graphe de connaissances local (seede a la creation)
├── src/               # Code source
└── tests/             # Tests
```

## Regles specifiques

> Les regles globales de `~/.claude/CLAUDE.md` s'appliquent par defaut.

- **Rythme du cours** — le projet avance au meme rythme que le cours du prof, jamais devant (demande de mentalyas, 2026-09-21). Avant toute tache d'implementation, verifier dans `docs/RYTHME-COURS.md` que la notion de cours correspondante est vue ; sinon la tache attend. Ne pas lancer `/pipeline next` sur la Phase 2 sans cette verification.
- **Nouveau cours** — au debut de session, verifier si un dossier `Suivit_Cours/pid.aaaammjj/` du dernier samedi existe et l'integrer (notes dans `docs/academique/`, mise a jour de `docs/RYTHME-COURS.md`) avant d'avancer sur le projet.
- **Materiel de cours** — dossiers `Suivit_Cours/pid.aaaammjj/` ; la version publiee apres le cours fait reference, `pid_avant_cours.*` est conserve pour memoire uniquement.

## Suivi academique

Active : oui
Dossier : docs/academique/
Derniere mise a jour : 2026-09-21

## Stack

> A definir apres `/brainstorm`.

## Workflows actifs

- [ ] Brainstorm initial (`/brainstorm`)
- [ ] Pipeline agents (`/pipeline`)
- [x] Graphify projet — seede a la creation, mis a jour a chaque `/hub end`
