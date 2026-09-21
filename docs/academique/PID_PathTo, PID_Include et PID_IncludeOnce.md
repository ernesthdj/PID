---
type: concept
subject: PID_PathTo, PID_Include, PID_IncludeOnce
module: PID — Framework maison (samedis 29/08, 05/09, 12/09)
tags: [#PID, #PHP, #fonctions-utilitaires, #topologie]
date: 2026-09-12
niveau: intermédiaire
statut: complet
analogie_domaine: multiprise / électricité
---

# PID_PathTo, PID_Include et PID_IncludeOnce

> Ce sont les adaptateurs universels de la multiprise du site : peu importe dans quelle pièce (dossier) tu te trouves, tu branches ta demande ("je veux `dir1/dir2/page.php`") sur `PID_PathTo`, et il te ressort la bonne adresse absolue vers le tableau électrique (la racine), sans jamais te demander où tu es toi-même.

![[attachments/schema-bootstrap-autoloader-avant-apres.png]]
*Même schéma que [[Bootstrap PID — Detection de la Racine du Site]] — colonne "APRÈS", bloc central `PID_PathTo()`/`PID_Include()`.*

## En une phrase simple

Trois fonctions globales du framework qui remplacent les `include`/`require` natifs de PHP : elles reçoivent toutes un chemin **écrit à partir de la racine du site**, et se chargent de le convertir en chemin réellement valide depuis l'endroit où le code s'exécute — tu écris toujours le même chemin, peu importe le fichier depuis lequel tu l'écris.

## Pourquoi ça existe ?

En PHP natif, `include("dir1/dir2/personne.php")` est **relatif au fichier qui exécute le include**, pas à la racine du site. Si le même bout de code se retrouve exécuté depuis `dir1/index.php` et depuis `dir1/truc/machin/index.php`, le même `include("dir1/dir2/personne.php")` pointe vers deux endroits différents (ou vers rien du tout).

Le prof a donc écrit une couche d'abstraction (une couche intermédiaire qui cache la complexité derrière une interface simple) : on écrit désormais un chemin **absolu depuis la racine du site** (grâce à `PID_PATH_TO_ROOT`, vu dans [[Bootstrap PID — Detection de la Racine du Site]]), et ces 3 fonctions se chargent de la traduction.

## Comment ça fonctionne ?

### 1. `PID_PathTo($url, $checkIfFileExists = true)` — le traducteur d'adresse

Prend une URL/chemin écrit depuis la racine (`"dir1/dir2/page12.php"`, `"/dir1/dir2"`, ou même un lien externe `"https://..."`). Détecte d'abord si c'est un **lien externe** (présence de `:` avant le premier `/`, comme dans `http://`) — dans ce cas il le laisse tel quel. Sinon, il retire un éventuel `./` ou `/` de tête, puis **préfixe** avec `PID_PATH_TO_ROOT`. Par défaut, il vérifie aussi que le fichier existe réellement (`file_exists`) avant de renvoyer le chemin — sinon il renvoie `false`.

### 2. `PID_Include($url)` — inclusion "safe"

Appelle `PID_PathTo($url)` pour obtenir le vrai chemin. Si `false` (fichier introuvable) ou si ce n'est pas un fichier régulier (`is_file`), il retourne `false` sans rien inclure. Sinon il fait un `@include($url)` (le `@` supprime les warnings PHP en cas d'erreur non prévue) et retourne `true`.

### 3. `PID_IncludeOnce($url)` — la variante anti-doublon

Identique à `PID_Include`, mais utilise `include_once` en interne : le fichier ne sera inclus **qu'une seule fois** même si la fonction est appelée plusieurs fois avec le même chemin dans la même requête. Utile pour des fichiers de classe qu'on ne veut jamais charger deux fois (PHP lèverait une erreur fatale "Cannot redeclare class").

### 4. Le paramètre `$checkIfFileExists` — la subtilité utile

Dans `PID_PathTo`, ce paramètre peut être mis à `false` — utilisé notamment dans l'autoloader (voir [[Autoloading PID — spl_autoload_register et le Cache]]) au moment d'obtenir le chemin où **écrire** le fichier `.class.register.php` : à cet instant précis, le fichier n'existe pas encore forcément (on est en train de le créer), donc vérifier son existence ferait échouer l'opération à tort.

## Schéma

```mermaid
flowchart LR
    U["Chemin ecrit depuis la racine<br/>ex: dir1/dir2/page.php"] --> PT["PID_PathTo()"]
    PT -->|prefixe avec PID_PATH_TO_ROOT| A["Chemin reel<br/>ex: ../../dir1/dir2/page.php"]
    A --> PI["PID_Include()"]
    A --> PIO["PID_IncludeOnce()"]
    PI -->|include classique| F1["Fichier charge<br/>(peut etre charge plusieurs fois)"]
    PIO -->|include_once| F2["Fichier charge<br/>UNE SEULE FOIS par requete"]
```

## Exemple concret

Depuis `dir1/dir2/page12.php` (donc `PID_PATH_TO_ROOT = "../../"` calculé au bootstrap) :

```php
PID_PathTo("dir.0");                 // -> "../../dir.0" (si le dossier existe)
PID_PathTo("dir1/truc.php");         // -> false (le fichier n'existe pas)
PID_Include("dir1/dir2/a_inclure.php"); // traduit puis inclut réellement le fichier
```

Le même appel `PID_Include("dir1/dir2/a_inclure.php")` fonctionnerait **à l'identique** si on l'écrivait depuis `index.php` à la racine, depuis `dir1/index.php`, ou depuis `dir1/truc/machin/index.php` — seule la traduction interne change, jamais ce que le développeur écrit.

## Évolution du 19/09 — le préfixe `*`
`PID_PathTo` reconnaît désormais un chemin qui **commence par `*`** : il est alors cherché dans le dossier du framework (`PID_FOLDER_PATH`, ex. `.pid/`) au lieu de la racine du site. Sans étoile, rien ne change. **Défini mais pas encore utilisé** dans le code du cours au 19/09. Détail dans [[Dossier .pid et préfixe étoile — Séparer le framework du site]].

## Connexions

- [[Glossaire PHP — include, require et résolution de chemins]] — le mécanisme natif exact que ces 3 fonctions maison enveloppent et corrigent (résolution relative au fichier courant, pas à la racine).
- [[Bootstrap PID — Detection de la Racine du Site]] — fournit la constante `PID_PATH_TO_ROOT` sans laquelle `PID_PathTo` ne peut rien calculer.
- [[Autoloading PID — spl_autoload_register et le Cache]] — utilise `PID_Include` en interne pour charger le fichier trouvé, et `PID_PathTo(..., false)` pour localiser où écrire le cache.

## Questions de rappel actif

> **Q :** Pourquoi `include("dir1/dir2/personne.php")` en PHP natif ne fonctionne-t-il pas de façon fiable dans un framework où le même code peut s'exécuter depuis n'importe quel dossier ?
> **R :** Parce que `include` natif résout un chemin relatif **au fichier qui l'exécute**, pas à la racine du site — le même chemin écrit dans deux fichiers à des profondeurs différentes pointera vers deux emplacements différents.

> **Q :** Que renvoie `PID_PathTo("dir1/truc.php")` si ce fichier n'existe pas, et pourquoi ce comportement est-il volontaire ?
> **R :** Elle renvoie `false` par défaut (paramètre `$checkIfFileExists` à `true`) — c'est volontaire pour éviter de manipuler un chemin vers une ressource inexistante ; à l'appelant de gérer ce cas plutôt que de laisser PHP planter plus loin.

> **Q :** Dans quel cas précis a-t-on besoin de passer `false` en second paramètre de `PID_PathTo` ?
> **R :** Quand on veut obtenir un chemin vers un fichier qui **n'existe pas encore**, typiquement pour savoir où l'écrire (cas du cache `.class.register.php` généré par l'autoloader).

> **Q :** Quelle est la différence pratique entre `PID_Include` et `PID_IncludeOnce`, et quand choisir l'une plutôt que l'autre ?
> **R :** `PID_Include` peut recharger un fichier plusieurs fois dans la même requête, `PID_IncludeOnce` garantit un chargement unique — indispensable pour les fichiers de classe (une classe redéclarée fait planter PHP), moins critique pour un simple fragment HTML.

## Pièges fréquents

- ⚠️ **Écrire un chemin commençant par `../`** — ces fonctions attendent un chemin exprimé **depuis la racine du site**, pas un chemin relatif classique. Un `../` casse la logique de préfixage.
- ⚠️ **Oublier de tester le retour `false`** — `PID_Include` ne lève pas d'exception si le fichier est introuvable, il retourne juste `false` silencieusement (à part le `@` qui masque les warnings). Un code qui ignore ce retour peut continuer à s'exécuter avec des données manquantes sans le savoir.
- ⚠️ **Confondre ces fonctions avec un autoloader** — elles n'interviennent que sur demande explicite (`PID_Include(...)` appelé dans le code) ; l'autoloader, lui, se déclenche tout seul quand PHP rencontre une classe inconnue (voir la note suivante).

## À retenir absolument
- Un seul système d'adressage (depuis la racine) remplace les chemins relatifs fragiles.
- `PID_PathTo` = calcule et vérifie ; `PID_Include`/`PID_IncludeOnce` = calcule et inclut.
- `$checkIfFileExists = false` sert uniquement quand on veut écrire, pas lire.

## Explorer ensuite
- [[Autoloading PID — spl_autoload_register et le Cache]] — ces 3 fonctions sont les briques que l'autoloader assemble pour charger automatiquement une classe inconnue.
