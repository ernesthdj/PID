---
type: glossaire
subject: Visibilité (public/protected/private) et encapsulation en PHP
tags: [#PHP, #glossaire, #POO, #encapsulation]
date: 2026-09-18
niveau: intermédiaire
---

# Visibilité et encapsulation en PHP

> Trois portes avec trois niveaux d'accès sur le même bâtiment : `public` — porte d'entrée ouverte à tout le monde ; `protected` — porte réservée au personnel **et** aux stagiaires qui ont fait leur formation dans ce bâtiment (les classes filles) ; `private` — porte dont seul l'occupant exact du bureau a la clé, même son propre remplaçant n'y a pas accès s'il travaille dans un bureau "hérité".

## En une phrase simple

`public`, `protected` et `private` sont trois mots-clés qui contrôlent **depuis où** une propriété ou une méthode d'une classe PHP peut être lue/appelée, et l'**encapsulation** est le principe général qui consiste à cacher les données internes d'un objet derrière des méthodes qui contrôlent tout accès.

## En détail

### Les trois niveaux

| Mot-clé | Accessible depuis... |
|---|---|
| `public` | N'importe où — l'extérieur de la classe, une classe fille, la classe elle-même |
| `protected` | La classe elle-même **et** ses classes filles (héritage), jamais depuis l'extérieur |
| `private` | **Uniquement** le code écrit à l'intérieur de cette classe précise — même une classe fille n'y a pas accès |

```php
class CPersonne
{
    private $m_Nom;   // accessible seulement depuis l'intérieur de CPersonne

    public function Nom($valeur = null)   // accessible depuis n'importe où
    {
        if ($valeur !== null) { $this->m_Nom = $valeur; return true; }
        return $this->m_Nom;
    }
}

$p = new CPersonne();
$p->m_Nom = "test";   // ERREUR FATALE — m_Nom est private, inaccessible depuis l'extérieur
$p->Nom("test");      // OK — passe par la méthode publique
```

### Pourquoi cacher les données (l'encapsulation)

Sans `private`, n'importe quel code extérieur pourrait écrire `$p->m_Nom = 3.14159` directement — un nombre là où on attend un nom. En rendant `$m_Nom` `private` et en n'exposant que la méthode `Nom()`, la classe **garantit** que toute tentative de modification passe par sa validation (`is_string`, `trim`, `empty`...). C'est le principe d'encapsulation : les données internes ne sont jamais accessibles "brutes", toujours à travers une interface contrôlée.

### Le piège précis de `private` avec l'héritage

Une confusion très fréquente : `private` ne bloque pas *seulement* l'extérieur, il bloque **aussi** les classes filles. Si `CApplication` déclare `private static $s_Instance`, une classe `CMonApp extends CApplication` ne peut **pas** accéder directement à `$s_Instance` — elle doit passer par des méthodes `public`/`protected` de la classe parente. Seul `protected` autoriserait cet accès direct depuis une classe fille.

## Utilisé dans ce cours

- [[Structure POO — CPersonne, CPersonne2 et CAutre]] — `private $m_Nom`/`$m_Prenom`, accès uniquement via `Nom()`/`Prenom()` publiques.
- [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] — le constructeur `protected` de `CApplication` empêche `new CApplication()` depuis l'extérieur ; c'est la même logique de visibilité appliquée non pas à une propriété mais à une méthode (le constructeur).

## Questions de rappel actif

> **Q :** Pourquoi `$p->m_Nom = "test"` échoue-t-il si `$m_Nom` est `private`, alors que `$p->Nom("test")` fonctionne ?
> **R :** `private` interdit tout accès direct à la propriété depuis l'extérieur de la classe — seule une méthode `public` de cette même classe (ici `Nom()`) peut la lire ou l'écrire, et elle peut appliquer sa propre validation avant de le faire.

> **Q :** Une classe fille peut-elle accéder à une propriété `private` de sa classe parente ?
> **R :** Non — contrairement à `protected`, `private` reste invisible même pour l'héritage. Seule la classe qui déclare la propriété `private` peut y accéder directement.

## Pièges fréquents

- ⚠️ **Confondre `protected` et `private`** — `protected` = "famille" (classe + descendants), `private` = "cette classe précise et rien d'autre", jamais les descendants.
- ⚠️ **Oublier qu'un constructeur peut aussi avoir une visibilité** — `protected function __construct()` n'est pas juste une propriété cachée, c'est une **méthode** cachée, ce qui empêche `new` directement (base du motif Singleton, voir [[Glossaire — Le motif de conception Singleton]]).

## Explorer ensuite
- [[Glossaire PHP — Méthodes magiques]] — `__construct` est justement la première méthode magique à connaître, et sa visibilité change tout.
