# Procédure — intégrer le code d'un nouveau cours

Objectif : la vue Architecture ne montre que la **dernière version** du code du prof (`src/prof/`), sans doublons, tout en gardant l'historique de chaque cours dans git.

## Principe

- Une seule copie du code du prof : `src/prof/` (contenu du dossier `_htdocs` du cours).
- Chaque cours = un commit sur `src/prof` + un tag `cours-aaaammjj`.
- `Suivit_Cours/pid.aaaammjj/` ne garde que les notes `.txt` (jamais le code).
- Tags existants : `cours-20260829`, `cours-20260905`, `cours-20260912`, `cours-20260919`, `cours-20261010`.

## Étapes à chaque nouveau cours

1. Déposer le nouveau `_htdocs` (provisoirement) dans `Suivit_Cours/pid.aaaammjj/_htdocs/`.
2. Remplacer `src/prof/` par son contenu (supprimer l'ancien contenu d'abord, pour que les fichiers retirés par le prof disparaissent aussi).
3. Commiter **uniquement** `src/prof` et poser le tag :
   ```
   git add -f src/prof
   git commit -m "chore(pid): code du prof - cours aaaammjj" -- src/prof
   git tag cours-aaaammjj
   ```
4. Supprimer le code déposé en 1 de `Suivit_Cours/` (il reste dans `src/prof` et dans git). Garder les `.txt`.
5. Mettre à jour le graphe du projet (graphify), puis vider/ignorer le cache `Suivit_Cours/graphify-out/` s'il réintroduit d'anciens fichiers.
6. Rafraîchir la vue Architecture : elle reprend `src/prof/` = dernier cours.

## Ce qui a été ajouté / modifié au dernier cours

Liste des fichiers (A = ajouté, M = modifié, D = supprimé) :

```
git diff --name-status cours-<précédent> cours-<nouveau> -- src/prof
```

Détail d'un fichier : `git diff cours-<précédent> cours-<nouveau> -- src/prof/<chemin>`.

Exemple (19/09 → 10/10) : `git diff --name-status cours-20260919 cours-20261010 -- src/prof`.

## Limite connue : surbrillance

La vue Architecture du Brainstormer n'a pas, à ce jour, de réglage pour mettre en surbrillance les fichiers nouveaux ou modifiés : elle lit juste les fichiers du disque. La liste ci-dessus en tient lieu. La surbrillance dans la vue demande une évolution de l'app (comparer le dossier courant au tag précédent).

## Rappels

- Respecter `docs/RYTHME-COURS.md` : intégrer le cours avant d'avancer le projet.
- Version post-cours = référence ; `pid_avant_cours.*` pour mémoire (notes `.txt` seulement).
