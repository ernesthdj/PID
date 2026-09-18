---
type: glossaire
subject: Tokenisation PHP — token_get_all() et l'analyse lexicale du code source
tags: [#PHP, #glossaire, #tokenisation, #parsing]
date: 2026-09-18
niveau: avancé
---

# Tokenisation PHP — token_get_all()

> Lire le code source d'un fichier comme du texte brut, c'est comme lire une partition de musique en ne voyant qu'une suite de taches d'encre. La tokenisation, c'est repasser dessus avec des surligneurs de couleurs différentes : jaune pour les notes, vert pour les silences, bleu pour les mesures — d'un coup, la structure musicale saute aux yeux au lieu d'être noyée dans le dessin brut.

## En une phrase simple

`token_get_all()` est une fonction native de PHP qui découpe le **code source** d'un fichier PHP en une liste de "tokens" (unités lexicales identifiées : mot-clé, nom, chaîne, commentaire, espace...) — exactement le travail que fait l'interpréteur PHP lui-même avant d'exécuter le code, mais rendu accessible pour l'inspecter sans l'exécuter.

## En détail

### Le problème que ça résout : chercher du code, pas du texte

```php
$contenu = file_get_contents("personne.php");
if (strpos($contenu, "class Personne") !== false) { /* ... */ }
```

Cette approche naïve (chercher la chaîne `"class Personne"` dans le texte brut) est **fragile** : elle serait trompée par un commentaire (`// class Personne` désactivé), par une chaîne de caractères contenant ce texte par coïncidence, ou par une mise en forme inhabituelle (`class  Personne` avec deux espaces, ou `class /* commentaire */ Personne`). Elle ne comprend pas la **structure** du code, juste son apparence textuelle.

### Ce que fait réellement `token_get_all()`

```php
$tokens = token_get_all("<?php class CAutre {} class /* oups */ CPersonne {} ?>");
```

Renvoie un tableau où chaque élément est soit un simple caractère (`{`, `}`, `;`...), soit un tableau `[type_de_token, texte, ligne]` pour les éléments plus complexes. Le mot-clé `class` devient un token de type `T_CLASS`, un commentaire devient `T_COMMENT`, un identifiant comme `CPersonne` devient `T_STRING`, un espace devient `T_WHITESPACE` — chaque token est **identifié par son rôle réel dans la syntaxe**, pas par son apparence.

### Pourquoi c'est plus fiable pour l'autoloader

En cherchant la **séquence de tokens** `T_CLASS` suivi (en ignorant les `T_WHITESPACE`/`T_COMMENT` intercalés) d'un `T_STRING` valant exactement `"CPersonne"`, l'autoloader du cours confirme que le fichier contient **réellement** une déclaration de classe `CPersonne` — peu importe qu'il y ait un commentaire glissé entre `class` et le nom, ou une autre classe (`CAutre`) déclarée juste avant dans le même fichier. C'est une lecture de la **structure syntaxique** du code, pas une simple recherche de texte.

## Utilisé dans ce cours

- [[Autoloading PID — spl_autoload_register et le Cache]] — la recherche à froid (`$exploreToFind`) utilise `token_get_all()` pour confirmer qu'un fichier candidat contient bien la déclaration `class Personne` avant de l'ajouter au cache.
- [[Structure POO — CPersonne, CPersonne2 et CAutre]] — le commentaire `class /* OUPS un commentaire */ CPersonne` (12/09) est précisément un cas de test conçu pour vérifier que la tokenisation reste robuste face à ce genre de "bruit" syntaxique valide.

## Questions de rappel actif

> **Q :** Pourquoi une simple recherche de texte (`strpos($contenu, "class Personne")`) serait-elle insuffisante pour vérifier qu'un fichier contient bien la classe recherchée ?
> **R :** Parce qu'elle ne comprend pas la structure du code — un commentaire désactivant la ligne, un texte présent dans une chaîne de caractères, ou une mise en forme différente (espaces, commentaire entre les mots) la tromperaient facilement, alors que la tokenisation identifie le rôle réel de chaque élément.

> **Q :** Pourquoi le test avec `class /* OUPS un commentaire */ CPersonne` est-il pertinent pour vérifier la robustesse de la tokenisation ?
> **R :** Parce qu'un commentaire entre `class` et le nom de la classe reste syntaxiquement valide en PHP, mais casserait une recherche naïve attendant `"class CPersonne"` collés l'un à l'autre — la tokenisation, elle, identifie séparément le token `T_CLASS`, le token `T_COMMENT` (à ignorer) et le token `T_STRING` du nom, donc reste correcte.

## Pièges fréquents

- ⚠️ **Croire que `token_get_all()` "exécute" le code** — non, il l'**analyse** seulement (analyse lexicale), sans jamais exécuter la moindre instruction. C'est beaucoup plus sûr que d'inclure/exécuter un fichier juste pour vérifier son contenu.
- ⚠️ **Oublier que les espaces et sauts de ligne sont eux-mêmes des tokens** (`T_WHITESPACE`) — une recherche de séquence de tokens qui ne les ignore pas explicitement échouerait dès qu'il y a plus d'un espace entre deux mots-clés.

## Explorer ensuite
- [[Autoloading PID — spl_autoload_register et le Cache]] — voir la tokenisation utilisée dans son contexte réel, couplée au cache `.class.register.php`.
