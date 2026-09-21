---
type: glossaire
subject: Les traits en PHP (trait, use) — partager du code sans héritage
tags: [#PHP, #glossaire, #POO, #trait]
date: 2026-09-21
niveau: intermédiaire
---

# Les traits en PHP (`trait` et `use`)

> Un hôtel livre le même **kit de service** (savon, serviettes, cintres) dans chaque chambre, quel que soit le type de chambre. Le kit n'est pas une chambre, ni une "chambre-mère" dont on hériterait : c'est une **caisse standard** qu'on dépose dans n'importe quelle pièce qui en a besoin. C'est un trait.

## En une phrase simple

Un **trait** est un bloc de propriétés et de méthodes qu'on peut "coller" dans plusieurs classes différentes avec le mot-clé `use`, **sans** créer de lien d'héritage entre elles.

## En détail

### Le problème que ça résout

En PHP, une classe n'a **qu'une seule** classe mère (héritage simple). Si deux classes sans lien logique (ici `CApplication` et `CPage`) ont besoin du **même** code, il y a trois mauvaises options : copier-coller (violation de DRY — *Don't Repeat Yourself*, ne pas se répéter), les faire hériter d'une même mère artificielle (faux lien "est-un"), ou passer par un objet tiers. Le trait est la quatrième option, propre.

### Syntaxe

```php
trait TCssJsFiles                // déclaration (comme une classe, mais avec "trait")
{
    private $m_CssFiles;
    public function Css() { /* ... */ }
}

class CApplication
{
    use TCssJsFiles;             // "colle" le contenu du trait ici
}

class CPage
{
    use TCssJsFiles;             // idem, dans une autre classe sans rapport
}
```

Après `use`, `CApplication` et `CPage` se comportent **exactement comme si** `Css()` et `$m_CssFiles` étaient écrits directement dans leur propre code — y compris l'accès aux propriétés `private` du trait, qui deviennent privées de la classe hôte.

### Ce qu'un trait n'est pas

- **Pas un type** : `$page instanceof TCssJsFiles` est faux — on ne peut pas passer un trait comme argument typé.
- **Pas instanciable** : `new TCssJsFiles()` est une erreur.
- **Pas de lien d'héritage** : deux classes qui utilisent le même trait restent indépendantes l'une de l'autre.

### Convention de nommage vue dans le cours

Le trait `TCssJsFiles` commence par **T** : l'autoloader du framework ([[Autoloading PID — spl_autoload_register et le Cache]]) déduit le type de la **première lettre** du nom (`C` = class, `I` = interface, `T` = trait) et cherche des fichiers `trait.NomDuTrait.php`.

## Utilisé dans ce cours

- [[TCssJsFiles et CFileCollection — Collections de fichiers CSS et JS]] — le trait partagé par `CApplication` et `CPage`.

## Questions de rappel actif

> **Q :** Pourquoi ne pas simplement faire hériter `CPage` de `CApplication` pour partager `Css()` ?
> **R :** Parce qu'une page n'**est pas** une application : ce serait un faux lien d'héritage (et PHP n'autorise qu'une seule classe mère). Le trait partage le code sans imposer de relation "est-un".

> **Q :** Un trait peut-il être instancié avec `new` ?
> **R :** Non. Il n'existe qu'à travers les classes qui l'utilisent avec `use`.

## Pièges fréquents

- ⚠️ **Croire qu'un trait est une classe mère cachée** — c'est un copier-coller géré par PHP, pas un héritage.
- ⚠️ **Collision de noms** — si deux traits (ou un trait et la classe) définissent la même méthode, PHP lève une erreur. D'où la convention du cours de **préfixer** les méthodes privées du trait par son nom (`TCssJsFiles_Initialize`).

## Explorer ensuite
- [[Glossaire PHP — Interface Iterator et foreach]] — l'autre outil de conception utilisé dans le même fichier de cours.
- [[Glossaire PHP — Visibilité et encapsulation]] — pourquoi les propriétés du trait sont `private`.
