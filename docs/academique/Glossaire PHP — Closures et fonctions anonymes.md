---
type: glossaire
subject: Closures et fonctions anonymes en PHP
tags: [#PHP, #glossaire, #fonctions, #closures]
date: 2026-09-21
niveau: intermédiaire
---

# Closures et fonctions anonymes en PHP

> Une fonction anonyme, c'est un post-it avec des instructions dessus, sans nom écrit en haut — on ne peut pas l'appeler par son nom plus tard, seulement la donner directement à quelqu'un ("tiens, voici quoi faire quand il le faudra") au moment où on la crée.

## En 30 secondes

Une **fonction anonyme** est une fonction sans nom, définie à l'endroit même où on l'utilise (souvent passée en argument à une autre fonction) ; une **closure** est une fonction anonyme qui, en plus, "se souvient" des variables de son contexte de création.

## En détail

### Syntaxe

```php
$maFonction = function($x) {
    return $x * 2;
};

echo $maFonction(5);   // 10
```

Pas de nom après `function` — juste `function(...) { ... }`. On peut la stocker dans une variable (comme ci-dessus), ou la passer **directement** comme argument à une autre fonction, ce qui est l'usage le plus courant.

### `spl_autoload_register` — passer une fonction en argument

```php
spl_autoload_register(function($className) {
    // ... logique de chargement ...
});
```

`spl_autoload_register()` est une fonction native de PHP qui attend, comme argument, **une autre fonction** à appeler plus tard. Plutôt que de définir une fonction nommée séparément puis de passer son nom, on écrit directement la fonction anonyme sur place — plus lisible quand cette fonction n'est utilisée qu'à cet unique endroit.

### La "closure" — capturer une variable extérieure avec `use`

```php
$prefixe = "M. ";
$saluer = function($nom) use ($prefixe) {
    return $prefixe . $nom;
};
echo $saluer("Duchemin");   // "M. Duchemin"
```

Sans le mot-clé `use`, une fonction anonyme ne voit **aucune** variable de son environnement extérieur — chaque fonction a normalement sa propre portée (scope) isolée. `use ($prefixe)` **capture** explicitement la variable `$prefixe` telle qu'elle valait à la création de la closure, et la rend disponible à l'intérieur. C'est cette capture qui transforme une simple "fonction anonyme" en véritable "closure" (fermeture) au sens strict.

## Sous le capot
- En PHP, une fonction anonyme est un **objet** (de la classe interne `Closure`) créé en mémoire au moment où l'exécution rencontre le mot-clé `function`. La variable qui la « contient » ne détient qu'un identifiant vers cet objet.
- `use ($x)` **copie la valeur** de `$x` **au moment de la création** de la closure (elle ne suit pas les changements ultérieurs, sauf capture par référence avec `&`).
- `spl_autoload_register(function(...) {...})` range cet objet dans une **pile interne** du moteur ; c'est là que PHP va le rappeler quand une classe est inconnue.

## Utilisé dans ce cours

- [[Autoloading PID — spl_autoload_register et le Cache]] — toute la logique de l'autoloader (décodage du nom, recherche récursive, cache) est écrite à l'intérieur d'une fonction anonyme passée à `spl_autoload_register()`. C'est cette fonction que PHP appelle automatiquement chaque fois qu'un nom de classe inconnu est rencontré.

## Questions de rappel actif

> **Q :** Pourquoi `spl_autoload_register` attend-il une fonction en argument plutôt qu'un simple bout de code ?
> **R :** Parce qu'il a besoin de pouvoir **rappeler** cette logique plus tard, potentiellement plusieurs fois, à chaque fois qu'un nom de classe inconnu apparaît — une fonction est justement un bloc de code réutilisable et rappelable à volonté, contrairement à du code exécuté une seule fois immédiatement.

> **Q :** Que se passerait-il si l'autoloader avait besoin d'une variable définie juste avant `spl_autoload_register(...)`, sans utiliser `use` ?
> **R :** La fonction anonyme ne verrait pas cette variable — elle lèverait une erreur "variable non définie" à l'intérieur d'elle-même, car chaque fonction a sa propre portée isolée par défaut ; il faudrait la capturer explicitement avec `use (...)`.

## Pièges fréquents

- ⚠️ **Croire qu'une fonction anonyme voit automatiquement les variables autour d'elle** — faux, contrairement à JavaScript où les closures capturent tout implicitement, PHP exige une capture explicite via `use (...)`.
- ⚠️ **Confondre "fonction anonyme" et "closure"** — toute closure est une fonction anonyme, mais le terme "closure" insiste spécifiquement sur la capture de variables extérieures.

## Explorer ensuite
- [[Autoloading PID — spl_autoload_register et le Cache]] — voir une closure complète et réelle à l'œuvre.
