---
type: glossaire
subject: L'héritage en PHP (extends, parent::) — construire une classe à partir d'une autre
tags: [#glossaire, #PHP, #POO, #heritage]
date: 2026-09-21
niveau: intermédiaire
---

# L'héritage en PHP (`extends` et `parent::`)

> **En 30 secondes** — `class B extends A` : la classe `B` **reçoit tout ce qui est `public` ou `protected` dans `A`**, puis ajoute ou remplace ce qu'elle veut. `parent::` permet à `B` d'appeler la version de `A`.

## 1. C'est quoi, et pourquoi ça existe ?
- **Problématique** : plusieurs classes partagent une base commune (ex. toute application a un charset et un échappement HTML, mais chaque site a ses propres données). Sans héritage, on recopierait la base partout.
- **Analogie (restauration)** : un restaurant a un **menu de base**. Une succursale reprend ce menu **tel quel** et y ajoute son **plat du jour**, éventuellement en modifiant un plat existant. La succursale (fille) hérite du menu (mère) ; la mère ne connaît pas ses succursales.

## 2. Comment ça marche (sous le capot)
- **Recherche d'une méthode** : quand tu écris `$app->DoSomething()`, PHP cherche `DoSomething` dans la classe de l'objet (`CMonApp`), puis **remonte** vers la mère (`CApplication`) jusqu'à la trouver.
- **Un objet fille contient tout** : ses propres propriétés **et** celles de la mère en mémoire (celles de la mère marquées `private` existent mais la fille ne peut pas les toucher — [[Glossaire PHP — Visibilité et encapsulation]]).
- **Une seule mère par classe** (héritage simple) — c'est pourquoi PHP offre aussi les traits ([[Glossaire PHP — Traits]]).
- **Le constructeur de la mère n'est PAS appelé automatiquement.** Contrairement à C# ou C++ où un constructeur de base sans paramètre s'exécute implicitement, en PHP la fille doit écrire **`parent::__construct()`** elle-même.

## 3. En pratique (extraits du cours)
```php
class CMonApp extends CApplication          // CMonApp reçoit tout de CApplication
{
    public function __construct($information = null)
    {
        parent::__construct();               // OBLIGATOIRE : enregistre le singleton (self::$s_Instance + $_SESSION)
        $this->Information($information);    // puis la part propre à la fille
    }
}
```
- Oublier `parent::__construct()` = le singleton n'est jamais enregistré ; `CApplication::Instance()` en recréerait un à chaque appel.
- `CettePage extends CPage` redéfinit `WriteBody` ; la mère impose l'ordre ([[CPage — Générer une page HTML (WriteDocument et points d'extension)]]).
- `protected` = visible pour les filles, invisible de l'extérieur (constructeur de `CApplication`).

## Utilisé dans ce cours
- [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] — `CMonApp extends CApplication`.
- [[CPage — Générer une page HTML (WriteDocument et points d'extension)]] — `CettePage extends CPage` (Template Method).

## Retenir et vérifier
- **À retenir** : la fille reçoit `public` + `protected` ; `parent::` appelle la mère ; le constructeur de la mère se rappelle à la main.
> **Q :** Que se passe-t-il si `CMonApp::__construct` n'appelle pas `parent::__construct()` ?
> **R :** Le constructeur de `CApplication` ne s'exécute pas : `self::$s_Instance` et `$_SESSION[...]` ne sont pas remplis, le singleton n'existe pas.

**Pièges** : ⚠️ croire que la mère connaît ses filles (faux : c'est la config `PID_APPLICATION_CLASSNAME` qui désigne la fille) ; ⚠️ supposer l'appel implicite du constructeur de la mère comme en C#.
