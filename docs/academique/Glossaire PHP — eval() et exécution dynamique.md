---
type: glossaire
subject: eval() et exécution dynamique de code en PHP
tags: [#PHP, #glossaire, #eval, #securite]
date: 2026-09-18
niveau: avancé
---

# eval() et exécution dynamique de code

> `eval()`, c'est écrire une phrase sur un bout de papier et la donner à quelqu'un en lui disant "fais exactement ce que dit ce papier" — sans jamais avoir vérifié à l'avance ce qu'il y a d'écrit dessus. Pratique si tu écris toi-même le papier ; dangereux si quelqu'un d'autre a pu y toucher avant toi.

## En une phrase simple

`eval()` est une fonction native de PHP qui **prend une chaîne de caractères et l'exécute comme si c'était du vrai code PHP écrit directement dans le fichier** — elle permet de construire du code "à la volée" plutôt que de l'écrire figé à l'avance.

## En détail

### Le principe

```php
$code = "\$resultat = 2 + 2;";
eval($code);
echo $resultat;   // 4
```

`eval()` compile et exécute la chaîne passée en argument exactement comme si cette chaîne avait été tapée directement dans le script. Toute variable créée à l'intérieur du code évalué (ici `$resultat`) devient disponible dans la portée courante, **après** l'appel à `eval()` — pas avant.

### Pourquoi c'est utile : choisir dynamiquement quelle fonction appeler

```php
$kindName = "class";   // pourrait aussi être "interface" ou "trait"
eval("\$exists = $kindName" . "_exists(\"CPersonne\", false);");
// équivaut à : $exists = class_exists("CPersonne", false);
```

Ici, `eval()` sert à construire dynamiquement le **nom de la fonction** à appeler (`class_exists`, `interface_exists` ou `trait_exists`) en fonction d'une variable, sans écrire un `if`/`switch` explicite pour chaque cas. C'est un raccourci d'écriture — pas un besoin fonctionnel absolu.

### Pourquoi c'est dangereux (et pourquoi ce n'est pas la meilleure pratique)

`eval()` exécute **n'importe quel** code PHP contenu dans la chaîne — s'il arrivait qu'une donnée venant de l'utilisateur (un formulaire, une URL) se retrouve, même indirectement, dans la chaîne passée à `eval()`, un visiteur malveillant pourrait faire exécuter du code arbitraire sur le serveur (faille d'injection de code, une des pires catégories de vulnérabilités web). Dans le cas du cours, `$kindName` provient d'une convention de nommage interne (premier caractère du nom de classe), pas d'une entrée utilisateur directe — le risque concret est donc faible ici, mais le principe général reste : **éviter `eval()` dès qu'une alternative existe**. Une structure `match()` ou `switch()` explicite ferait exactement la même chose sans exécuter de code construit par concaténation de chaînes.

## Utilisé dans ce cours

- [[Evolution de l'Autoloader — Boucle de Retry (0509 vers 1209)]] — `eval()` choisit dynamiquement entre `class_exists`, `interface_exists` et `trait_exists` selon le type détecté (`$kindName`), pour vérifier après inclusion que la classe/interface/trait attendue existe bien réellement.

## Questions de rappel actif

> **Q :** Que fait précisément `eval("\$exists = class_exists(\"CPersonne\", false);")` ?
> **R :** Il exécute cette chaîne comme si elle était écrite en dur dans le code — appelle `class_exists("CPersonne", false)` et stocke le résultat dans une nouvelle variable `$exists`, disponible juste après l'appel à `eval()`.

> **Q :** Pourquoi `eval()` est-il considéré comme risqué en sécurité, même si son usage ici semble inoffensif ?
> **R :** Parce qu'il exécute sans distinction tout code PHP valide contenu dans la chaîne fournie — si une donnée non fiable (venant d'un utilisateur) parvenait un jour à s'y glisser, ce serait une porte ouverte à l'exécution de code arbitraire sur le serveur. La prudence générale s'applique même quand le cas précis est sûr.

## Pièges fréquents

- ⚠️ **Penser que `eval()` est la seule façon d'appeler une fonction dont le nom est dans une variable** — faux : `$nomFonction = "class_exists"; $nomFonction("CPersonne", false);` (appel de fonction "variable") fait la même chose sans passer par `eval()`, et est bien plus sûr et lisible.
- ⚠️ **Oublier que la variable créée par `eval()` n'existe pas avant l'appel** — `$exists` n'est définie qu'après l'exécution de la ligne `eval(...)`, la chercher plus haut dans le code échouerait.

## Explorer ensuite
- [[Evolution de l'Autoloader — Boucle de Retry (0509 vers 1209)]] — voir `eval()` dans son contexte réel, avec l'explication complète du `false` en second argument des fonctions `*_exists`.
