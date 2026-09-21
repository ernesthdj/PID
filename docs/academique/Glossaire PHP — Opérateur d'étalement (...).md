---
type: glossaire
subject: L'opérateur d'étalement ... en PHP (collecter et étaler des arguments)
tags: [#glossaire, #PHP, #fonctions, #variadique]
date: 2026-09-21
niveau: intermédiaire
---

# L'opérateur d'étalement `...`

> **En 30 secondes** — Les trois points ont **deux sens opposés** : dans une **déclaration**, `...$reste` **collecte** les arguments en trop dans un tableau ; dans un **appel**, `...$tableau` **étale** un tableau en autant d'arguments séparés.

## 1. C'est quoi, et pourquoi ça existe ?
- **Problématique** : parfois on ne sait pas à l'avance **combien** d'arguments une fonction recevra (une liste de fichiers CSS, une liste de contenus), ou on **détient déjà** ces valeurs dans un tableau et on veut les passer une par une.
- **Analogie** : à la caisse. **Collecter** = tout ce qui reste sur le tapis finit dans **un panier** ; **étaler** = tu **vides le panier** sur le tapis, article par article.

## 2. Comment ça marche (sous le capot)
- **Étaler à l'appel** : `f(...[1, 2, 3])` équivaut exactement à `f(1, 2, 3)` — PHP déballe le tableau en arguments positionnels au moment de l'appel.
- **Collecter à la déclaration** : `function f($a, ...$reste)` : `$a` prend le 1ᵉʳ argument, **tous les suivants** vont dans le tableau `$reste`. Le paramètre collecteur doit être **le dernier**.
- Rien de magique : c'est du tableau ↔ arguments, résolu à l'appel.

## 3. En pratique (extraits du cours)
```php
$instance = new $className(...$arguments);                       // ÉTALER : $arguments (config) devient les arguments du constructeur
public function __construct($handleUniqueItems = null, ...$items) // COLLECTER : tout le reste → $items
$this->m_CssFiles = new CFileCollection(true, ...$cssFiles);      // ÉTALER : chaque URL devient un argument
private function WriteContent($tabs, ...$contents)                // COLLECTER : autant de contenus que voulu
```
C'est ce qui permet à `CApplication::Instance()` d'instancier **n'importe quelle** classe fille avec des arguments fournis par la configuration (`PID_APPLICATION_INSTANCIATOR_ARGUMENTS`), sans connaître leur nombre ([[Glossaire PHP — Héritage (extends et parent)]]).

## Utilisé dans ce cours
- [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] — `new $className(...$arguments)`.
- [[TCssJsFiles et CFileCollection — Collections de fichiers CSS et JS]] — constructeur de la collection.
- [[CPage — Générer une page HTML (WriteDocument et points d'extension)]] — `WriteContent(...$contents)`.

## Retenir et vérifier
- **À retenir** : `...` dans une déclaration = **collecter** ; `...` dans un appel = **étaler**.
> **Q :** Que fait `new $className(...$arguments)` si `$arguments` vaut `["a", "b"]` ?
> **R :** Il équivaut à `new $className("a", "b")` : le tableau est étalé en deux arguments.

**Pièges** : ⚠️ le paramètre collecteur doit être le dernier de la liste ; ⚠️ on ne peut étaler qu'un tableau (ou un objet parcourable) ; ⚠️ ne pas confondre avec les points de suspension d'un texte.
