---
type: glossaire
subject: Méthodes magiques PHP (__construct, __wakeup, __destruct, __toString...)
tags: [#PHP, #glossaire, #POO, #methodes-magiques]
date: 2026-09-18
niveau: intermédiaire
---

# Méthodes magiques en PHP

> Ce sont des sonnettes automatiques : tu ne les actionnes jamais toi-même directement (on n'écrit jamais `$obj->__construct()`), c'est PHP qui les déclenche tout seul quand un évènement précis du cycle de vie de l'objet se produit — naissance, réveil, destruction...

## En une phrase simple

Une méthode magique est une méthode dont le nom commence par `__` (deux underscores) et que PHP **appelle automatiquement** à un moment précis du cycle de vie d'un objet — jamais appelée explicitement par le développeur.

## En détail

### Les méthodes magiques rencontrées dans le cours

| Méthode | Déclenchée quand... |
|---|---|
| `__construct()` | Un `new MaClasse(...)` est exécuté — l'objet vient de naître |
| `__wakeup()` | Un objet est **désérialisé** (reconstruit à partir d'une forme sauvegardée, typiquement `$_SESSION`) |
| `__destruct()` | L'objet est détruit (fin de script, ou plus de référence vers lui) — pas rencontrée dans le cours mais bon à connaître |
| `__toString()` | L'objet est utilisé comme s'il était une chaîne (ex. `echo $obj;`) — pas rencontrée dans le cours mais bon à connaître |

### `__construct` — la naissance

```php
public function __construct($nom, $prenom)
{
    $this->Nom($nom);
    $this->Prenom($prenom);
}
```

Appelée automatiquement et **uniquement** à l'instant `new CPersonne("Duchemin", "Robert")`. Les arguments passés à `new` sont transmis directement au constructeur.

### `__wakeup` — le réveil après désérialisation

PHP peut transformer un objet en une chaîne de texte (`serialize()`) puis le reconstruire plus tard depuis cette chaîne (`unserialize()`) — c'est exactement ce qui se passe **automatiquement** avec `$_SESSION` : PHP sérialise les objets en session à la fin d'une requête, puis les désérialise au début de la requête suivante. `__wakeup()` est le point d'entrée que PHP appelle juste après cette reconstruction — l'objet existe déjà (ses propriétés ont leur valeur restaurée), mais c'est l'occasion de refaire une petite initialisation si nécessaire (ex. rouvrir une ressource qui ne se sérialise pas correctement).

```php
protected function __wakeup()
{
    var_dump("RECUPERATION D'UN OBJET DE TYPE CApplication");
}
```

**Différence fondamentale avec `__construct`** : `__construct` s'exécute pour une création **initiale** (`new`), `__wakeup` s'exécute pour une **restauration** depuis un état déjà existant (désérialisation) — l'objet n'est jamais "recréé de zéro" dans ce second cas, juste réactivé.

## Utilisé dans ce cours

- [[Structure POO — CPersonne, CPersonne2 et CAutre]] — `__construct($nom, $prenom)` appelle les accesseurs plutôt que d'écrire directement les propriétés, pour garantir la validation dès la création.
- [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] — `__construct` (protected) crée l'instance unique et la stocke en session ; `__wakeup` la restaure lors des requêtes suivantes. `CMonApp` surcharge les deux et appelle `parent::__construct()`/`parent::__wakeup()` pour ne pas casser la mécanique de la classe de base.

## Questions de rappel actif

> **Q :** Pourquoi `__wakeup()` s'exécute-t-il sans qu'aucun `new` n'ait été écrit dans le code ?
> **R :** Parce qu'il est déclenché par la **désérialisation** d'un objet — PHP reconstruit l'objet automatiquement à partir de sa forme sauvegardée (ex. dans `$_SESSION`) et appelle `__wakeup()` juste après, sans jamais passer par `__construct()`.

> **Q :** Si une classe fille surcharge `__construct()`, pourquoi appelle-t-elle souvent `parent::__construct()` en premier ?
> **R :** Pour que la logique d'initialisation de la classe parente s'exécute quand même (ex. l'enregistrement du singleton dans `self::$s_Instance` et en session) — sans cet appel, seule la partie ajoutée par la classe fille s'exécuterait, cassant potentiellement le comportement attendu de la classe parente.

## Pièges fréquents

- ⚠️ **Essayer d'appeler `__construct()` ou `__wakeup()` directement** (`$obj->__construct()`) — techniquement possible en PHP mais va à l'encontre de leur rôle : ce sont des points d'entrée que PHP est censé gérer lui-même, les appeler manuellement recrée l'état d'un objet déjà initialisé, source de bugs.
- ⚠️ **Oublier `parent::` dans une classe fille qui surcharge une méthode magique** — sans lui, le comportement de la classe parente est silencieusement perdu.

## Explorer ensuite
- [[Glossaire PHP — Superglobales et sessions]] — comprendre `$_SESSION` en détail explique précisément quand PHP sérialise/désérialise, et donc quand `__wakeup()` se déclenche.
- [[Glossaire — Le motif de conception Singleton]] — `__construct` protégée est la pièce maîtresse de ce motif.
