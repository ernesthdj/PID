---
type: glossaire
subject: include, require et résolution de chemins en PHP natif
tags: [#PHP, #glossaire, #include, #chemins]
date: 2026-09-18
niveau: débutant
---

# include, require et résolution de chemins en PHP

> Donner une adresse à un livreur en disant "prends la deuxième rue à gauche" n'a de sens que si le livreur part **de chez toi**. Si un autre livreur part d'un autre point de la ville avec la même instruction, il finit ailleurs. `include`/`require` fonctionnent pareil : le chemin qu'on leur donne est relatif à **l'endroit d'où on les appelle**, pas à un point fixe.

## En une phrase simple

`include` et `require` chargent le contenu d'un autre fichier PHP dans le fichier courant ; leur différence porte sur la gravité de l'échec, et leur piège principal est que le chemin fourni est **relatif au fichier qui exécute l'instruction**, pas à un dossier fixe du site.

## En détail

### `include` vs `require` — avertissement ou arrêt total

```php
include("fichier_optionnel.php");   // si absent : avertissement (warning), le script continue
require("fichier_essentiel.php");   // si absent : erreur fatale, le script s'arrête immédiatement
```

Les deux font la même chose si le fichier existe. La différence n'apparaît que si le fichier est **introuvable** : `include` se contente d'un avertissement et laisse le script continuer (potentiellement avec des fonctions/classes manquantes plus loin), `require` arrête tout immédiatement. Règle générale : `require` pour tout ce qui est indispensable au fonctionnement du script, `include` pour ce qui est vraiment optionnel.

### Les variantes `_once`

```php
include_once("classe.php");
require_once("classe.php");
```

Garantissent que le fichier ne sera chargé **qu'une seule fois**, même si l'instruction est rencontrée plusieurs fois dans l'exécution. Indispensable pour les fichiers de classe : PHP lève une erreur fatale ("Cannot redeclare class") si la même classe est déclarée deux fois dans un même script.

### Le piège central : la résolution relative

```php
// Dans dir1/index.php :
include("dir2/personne.php");    // cherche dir1/dir2/personne.php

// Dans dir1/truc/index.php :
include("dir2/personne.php");    // cherche dir1/truc/dir2/personne.php — PAS le même fichier !
```

Un chemin relatif écrit dans `include(...)` est résolu **par rapport au fichier qui contient cette instruction**, pas par rapport à un point fixe du site ni par rapport à l'URL demandée dans le navigateur. Si le même code (même chemin relatif) est exécuté depuis deux fichiers situés à des profondeurs différentes de l'arborescence, il pointe vers deux emplacements réels différents — ou vers rien du tout. C'est exactement le problème que le framework du cours résout avec un système d'adressage "depuis la racine" plutôt que "depuis le fichier courant".

## Utilisé dans ce cours

- [[PID_PathTo, PID_Include et PID_IncludeOnce]] — `PID_Include`/`PID_IncludeOnce` sont des fonctions maison qui enveloppent `include`/`include_once` natifs, après avoir d'abord traduit un chemin "écrit depuis la racine du site" en chemin réellement valide depuis l'endroit où le code s'exécute — précisément pour éviter le piège décrit ci-dessus.
- [[Bootstrap PID — Detection de la Racine du Site]] — calcule `PID_PATH_TO_ROOT`, la donnée sans laquelle cette traduction de chemin serait impossible.

## Questions de rappel actif

> **Q :** Pourquoi le même `include("dir2/personne.php")` peut-il pointer vers deux fichiers différents selon l'endroit d'où il est exécuté ?
> **R :** Parce que le chemin fourni à `include` est résolu relativement au fichier qui contient l'instruction, pas par rapport à un point fixe — deux fichiers situés à des profondeurs différentes dans l'arborescence produisent donc des résolutions différentes pour le même chemin écrit.

> **Q :** Dans quel cas précis `require` est-il préférable à `include` ?
> **R :** Quand le fichier est indispensable au bon fonctionnement de la suite du script (ex. une classe dont on va instancier un objet juste après) — un `include` manquant laisserait le script continuer dans un état incohérent, alors que `require` stoppe net avec une erreur claire.

## Pièges fréquents

- ⚠️ **Écrire un chemin absolu du disque en dur** (`include("C:/xampp/htdocs/...")`) — fonctionne en local mais casse dès qu'on change de machine ou d'hébergement ; toujours préférer un chemin relatif calculé dynamiquement.
- ⚠️ **Oublier `_once` pour un fichier de classe** — provoque une erreur fatale "Cannot redeclare class" si le même fichier est inclus deux fois dans la même exécution.

## Explorer ensuite
- [[PID_PathTo, PID_Include et PID_IncludeOnce]] — voir comment le framework du cours neutralise complètement ce piège de résolution relative.
