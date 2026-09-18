---
type: glossaire
subject: Propriétés et méthodes statiques en PHP (static, self::)
tags: [#PHP, #glossaire, #POO, #static]
date: 2026-09-18
niveau: intermédiaire
---

# Propriétés et méthodes statiques en PHP

> Une propriété normale, c'est un tiroir personnel à chaque employé (chaque objet a le sien). Une propriété `static`, c'est **une seule armoire partagée**, accrochée au mur du bureau (la classe) lui-même, pas à un employé en particulier — tous les employés de ce service regardent la même armoire.

## En une phrase simple

`static` déclare une propriété ou une méthode qui appartient à la **classe elle-même**, pas à une instance particulière — une seule copie existe, partagée par tout le code qui utilise cette classe.

## En détail

### Propriété statique — une seule valeur partagée

```php
class CApplication
{
    private static $s_Instance;   // une seule valeur pour TOUTE la classe

    public static function Instance()
    {
        if (self::$s_Instance === null) { /* ... créer ... */ }
        return self::$s_Instance;
    }
}
```

`self::$s_Instance` (et non `$this->s_Instance`) accède à la propriété statique. `self::` désigne la classe **dans laquelle le code est écrit** (à ne pas confondre avec `$this` qui désigne une instance précise). Peu importe combien d'appels à `CApplication::Instance()` ont lieu, ou depuis quel objet, `self::$s_Instance` reste **une seule et même valeur** partagée.

### Méthode statique — appelable sans instance

```php
CApplication::Instance();   // pas de $obj-> devant, juste NomDeClasse::
```

Une méthode `static` s'appelle avec `::` sur le nom de la classe, sans avoir besoin d'un objet créé au préalable (`new`) — logique, puisque le but ici est justement de **fournir** l'unique instance, on ne peut pas encore en avoir une entre les mains pour l'appeler.

### La portée réelle d'une propriété statique : le temps d'une requête PHP

Point crucial et souvent mal compris : une propriété `static` n'est partagée que **pendant l'exécution d'un seul script PHP** (une seule requête HTTP). PHP ne garde aucun état en mémoire entre deux requêtes différentes (contrairement à un serveur Node.js ou une application desktop qui tournerait en continu) — chaque requête HTTP redémarre tout à zéro, `self::$s_Instance` revaut `null` au tout début de chaque nouvelle requête. C'est précisément pour ça que `CApplication` a aussi besoin de `$_SESSION` en plus du `static` : `static` = unique *pendant* une requête, `$_SESSION` = persistant *entre* les requêtes.

## Utilisé dans ce cours

- [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] — `self::$s_Instance` et `CApplication::Instance()` sont l'exemple central : la propriété statique évite de recréer l'objet plusieurs fois dans la même requête, la session prend le relais entre deux requêtes.

## Questions de rappel actif

> **Q :** Pourquoi `CApplication::Instance()->DoSomething();` appelé deux fois dans le même script ne crée-t-il l'objet qu'une seule fois ?
> **R :** Parce qu'après le premier appel, `self::$s_Instance` n'est plus `null` — la propriété statique garde sa valeur pour toute la durée du script, donc le second appel saute directement au `return self::$s_Instance;` sans repasser par la création.

> **Q :** Pourquoi `self::$s_Instance` redevient-il `null` à la requête HTTP suivante, alors que rien dans le code ne le réinitialise explicitement ?
> **R :** Parce que PHP ne conserve aucun état en mémoire entre deux requêtes distinctes — chaque requête est un nouveau démarrage complet du script, y compris pour les propriétés statiques. Seul un mécanisme de persistance explicite (comme `$_SESSION`) survit d'une requête à l'autre.

## Pièges fréquents

- ⚠️ **Croire qu'une propriété `static` est "globale" au sens de "partagée entre tous les visiteurs du site"** — non, elle n'est partagée qu'au sein d'une seule exécution de script (une seule requête, un seul visiteur, un seul instant). Deux visiteurs simultanés ont chacun leur propre exécution PHP totalement indépendante.
- ⚠️ **Utiliser `$this::` à la place de `self::`** — les deux fonctionnent souvent de façon similaire mais ont une nuance sur l'héritage (liaison statique tardive, hors du périmètre du cours) ; `self::` est le choix simple et explicite utilisé ici.

## Explorer ensuite
- [[Glossaire PHP — Superglobales et sessions]] — comprendre `$_SESSION`, le complément indispensable du `static` pour survivre entre les requêtes.
- [[Glossaire — Le motif de conception Singleton]] — `static` + constructeur `protected` sont les deux ingrédients de ce motif.
