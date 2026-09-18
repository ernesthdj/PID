---
type: introduction
subject: Bases du PHP pour quelqu'un qui n'en a jamais fait
module: PID — Framework maison (samedis 29/08, 05/09, 12/09)
tags: [#PHP, #introduction, #bases]
date: 2026-09-18
niveau: débutant absolu
statut: complet
---

# Introduction au PHP — bases pour débutant

> Ce document ne fait pas partie du cours PID à proprement parler — c'est le **point d'entrée** à lire avant toutes les autres notes de `docs/academique/` si le PHP est nouveau. Chaque fois qu'une note PID utilise une notion PHP générale sans la ré-expliquer depuis zéro, elle pointe soit ici, soit vers une note du **Glossaire PHP** (concepts plus avancés, voir tout en bas). Rien ici n'est spécifique au framework du prof — c'est juste "comment PHP fonctionne", indépendamment de tout framework.

## 0. Qu'est-ce que PHP, en une phrase

PHP est un langage **interprété côté serveur** : contrairement au JavaScript qui tourne dans le navigateur du visiteur, le code PHP s'exécute **sur le serveur**, produit du texte (généralement du HTML) et c'est ce texte final que le navigateur reçoit et affiche — le visiteur ne voit jamais le code PHP lui-même, juste son résultat.

## 1. Un fichier PHP, comment ça s'exécute

```php
<?php
    echo "Bonjour";
?>
<p>Du HTML normal ici</p>
<?php
    echo "Et encore du PHP";
?>
```

Un fichier `.php` peut **mélanger librement** du HTML brut et des blocs de code PHP délimités par `<?php` et `?>`. Tout ce qui est en dehors des balises `<?php ... ?>` est envoyé tel quel au navigateur ; tout ce qui est dedans est exécuté par le serveur. C'est pour ça que les fichiers du cours (`index.content.php`, `page.php`) ressemblent souvent à du HTML avec des `<?php ... ?>` ponctuels dedans plutôt qu'à du code "pur".

`echo` (ou `print`) affiche du texte — c'est littéralement écrire dans la réponse HTTP envoyée au navigateur.

## 2. Variables et types

```php
$nom = "Duchemin";       // string (chaîne de caractères)
$age = 34;                // int (entier)
$prix = 12.50;             // float (nombre décimal)
$estActif = true;          // bool (booléen)
$rien = null;               // null (absence de valeur)
$liste = ["a", "b", "c"];  // array (tableau)
```

Toute variable commence par `$`. PHP est **typé dynamiquement** (on ne déclare jamais le type à l'avance, contrairement à Java ou C#) et **faiblement typé** (PHP convertit automatiquement entre types quand c'est ambigu — source classique de bugs si on n'y prête pas attention). On peut tester le type réel d'une valeur avec des fonctions natives : `is_string($x)`, `is_array($x)`, `is_int($x)`, `is_null($x)`, etc. — ces fonctions reviennent constamment dans le code du cours (voir par exemple la validation dans [[Structure POO — CPersonne, CPersonne2 et CAutre]]).

### Les constantes — des variables qui ne changent plus jamais

```php
define("PID_ANSI", "windows-1252");
echo PID_ANSI;   // pas de $ devant : une constante n'est pas une variable
```

`define("NOM", valeur)` crée une **constante** : une fois définie, sa valeur ne peut plus jamais être modifiée pour le reste de l'exécution du script (contrairement à une variable `$x` qu'on peut réaffecter à volonté). Pas de `$` devant son nom à l'utilisation. Les constantes servent à figer des valeurs de configuration qu'on veut garantir stables (ex. `PID_PATH_TO_ROOT` dans [[Bootstrap PID — Detection de la Racine du Site]]) — toute tentative de les redéfinir ou de les modifier échoue.

> ⚠️ **Piège classique — `==` vs `===`** : `==` compare en **convertissant** les types si besoin (`"5" == 5` vaut `true`), `===` compare la valeur **et** le type sans aucune conversion (`"5" === 5` vaut `false`). Le code du cours utilise systématiquement des vérifications de type explicites (`is_string`, etc.) plutôt que de compter sur `==`, précisément pour éviter ce piège.

## 3. Structures de contrôle

```php
if ($age >= 18) {
    echo "Majeur";
} else {
    echo "Mineur";
}

for ($i = 0; $i < 10; $i++) { /* ... */ }

foreach ($liste as $valeur) { /* parcourt un tableau indexé */ }
foreach ($associatif as $cle => $valeur) { /* parcourt un tableau associatif */ }

while ($condition) { /* ... */ }
```

Syntaxe très proche du C/Java/JavaScript. `foreach` est la façon idiomatique de parcourir un tableau en PHP — on la retrouve partout dans le code du cours (ex. la boucle de remontée de dossiers dans [[Bootstrap PID — Detection de la Racine du Site]] utilise plutôt un `for` classique parce qu'elle a besoin d'un compteur, pas d'un parcours de tableau).

## 4. Fonctions

```php
function addition($a, $b = 0)   // $b a une valeur par défaut
{
    return $a + $b;
}

addition(3, 4);   // 7
addition(3);      // 3 (utilise le défaut de $b)
```

`function` déclare une fonction. Les paramètres peuvent avoir une **valeur par défaut** (`$b = 0`), auquel cas ils deviennent optionnels à l'appel. `return` renvoie une valeur et arrête immédiatement l'exécution de la fonction. C'est le même principe que dans quasiment tous les langages — sauf que PHP a aussi les **fonctions anonymes / closures**, une notion plus avancée traitée dans le glossaire : [[Glossaire PHP — Closures et fonctions anonymes]].

## 5. Tableaux (arrays)

```php
$indexe = ["a", "b", "c"];              // clés 0, 1, 2 implicites
$associatif = ["nom" => "Duchemin", "age" => 34]; // clés explicites
$PID_CLASS_REGISTER["CPersonne"] = "dir1/dir2/Personne.php"; // ajout d'une clé
```

En PHP, un seul type `array` sert à la fois de **liste** (tableau indexé, comme un `Array` JS ou une `List` C#) et de **dictionnaire** (tableau associatif, comme un `Object`/`Map`/`Dictionary`) — la distinction se fait juste par le type de clé utilisé (entier auto-incrémenté, ou chaîne explicite). Le cache d'autoloading `$PID_CLASS_REGISTER` (voir [[Autoloading PID — spl_autoload_register et le Cache]]) est un exemple direct de tableau associatif : nom de classe → chemin de fichier.

## 6. Chaînes de caractères

```php
$prenom = "Robert";
echo "Bonjour " . $prenom;         // concaténation avec le point .
echo "Bonjour $prenom";             // interpolation directe dans une chaîne entre guillemets doubles
$propre = trim("   Robert   ");    // "Robert" — enlève les espaces en début/fin
$position = strpos("CPersonne", "C"); // 0 — position de la première occurrence
```

Le point `.` concatène (assemble) des chaînes — ce n'est **pas** une addition. Entre guillemets **doubles** (`"..."`), PHP interpole automatiquement les variables (`"$prenom"` insère la valeur) ; entre guillemets **simples** (`'...'`), rien n'est interprété, tout est pris littéralement. `trim()`, `strpos()`, `substr()` sont des fonctions natives de manipulation de chaînes qu'on retrouve constamment dans le cours (validation des accesseurs `Nom()`/`Prenom()` dans [[Structure POO — CPersonne, CPersonne2 et CAutre]], décodage du nom de classe dans [[Autoloading PID — spl_autoload_register et le Cache]]).

## 7. Inclure d'autres fichiers

```php
include("config.php");
require("config.php");
```

PHP permet de charger le contenu d'un autre fichier PHP dans le fichier courant, comme si son code était recopié à cet endroit. C'est une notion plus subtile qu'il n'y paraît (résolution de chemin, différences `include`/`require`) — voir le glossaire dédié : [[Glossaire PHP — include, require et résolution de chemins]], directement liée à [[PID_PathTo, PID_Include et PID_IncludeOnce]].

## 8. Introduction à la programmation orientée objet (POO)

```php
class Personne
{
    public $nom;   // propriété

    public function direBonjour()   // méthode
    {
        echo "Bonjour, je m'appelle " . $this->nom;
    }
}

$p = new Personne();   // instanciation — crée un objet concret
$p->nom = "Robert";
$p->direBonjour();
```

Une **classe** est un plan/modèle (comme un plan de maison) ; un **objet** est une instance concrète créée à partir de ce plan (`new Personne()`, comme une maison construite à partir du plan). `$this` (à l'intérieur d'une méthode) désigne toujours l'objet courant sur lequel la méthode a été appelée. Les **propriétés** sont les variables attachées à l'objet, les **méthodes** sont les fonctions attachées à l'objet. C'est la base absolue de la POO — le cours va nettement plus loin (encapsulation, visibilité, constructeurs, héritage, méthodes statiques, méthodes magiques) : voir [[Glossaire PHP — Visibilité et encapsulation]] et [[Glossaire PHP — Méthodes magiques]] pour la suite, puis directement [[Structure POO — CPersonne, CPersonne2 et CAutre]] pour voir ces notions appliquées dans le cours.

## Où aller ensuite

- Tu maîtrises ce qui précède ? → commence directement par [[Bootstrap PID — Detection de la Racine du Site]], premier concept du cours.
- Une note du cours utilise un terme PHP que tu ne comprends pas encore en profondeur (`static`, `eval`, closures, `$_SESSION`, méthodes magiques...) ? → va voir la note correspondante du **Glossaire PHP**, listée dans [[MOC — PID]].
- Tu bloques sur un terme absent de ce document et du glossaire ? → note-le, il manque probablement une entrée à créer.
