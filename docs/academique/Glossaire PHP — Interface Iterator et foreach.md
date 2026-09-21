---
type: glossaire
subject: L'interface Iterator en PHP — rendre un objet parcourable avec foreach
tags: [#PHP, #glossaire, #POO, #interface, #iterator]
date: 2026-09-21
niveau: intermédiaire
---

# L'interface `Iterator` et `foreach`

> Un **convoyeur** de cuisine (dans Satisfactory : un tapis roulant) sort les plats un par un. Pour qu'un serveur puisse dire "donne-moi tous les plats, un après l'autre", le convoyeur doit savoir répondre à cinq questions simples : *"recommence au début", "y a-t-il encore un plat ?", "quel numéro ?", "quel plat ?", "passe au suivant"*. Ces cinq questions sont l'interface `Iterator`.

## En une phrase simple

Une **interface** est un contrat ("cette classe promet d'avoir ces méthodes"), et `Iterator` est le contrat qui dit à PHP **comment parcourir un objet** avec `foreach`.

## En détail

### Le contrat : cinq méthodes obligatoires

| Méthode | Question posée à l'objet |
|---------|---------------------------|
| `rewind()` | Reviens au début. |
| `valid()` | Y a-t-il encore un élément à cette position ? |
| `key()` | Quelle est la clé (le numéro) de cet élément ? |
| `current()` | Quelle est la valeur de cet élément ? |
| `next()` | Avance à l'élément suivant. |

Une classe qui écrit `implements Iterator` **s'engage** à définir ces cinq méthodes ; sinon PHP refuse de la charger.

### Ce que PHP fait à ta place

```php
foreach ($collection->All() as $index => $url) { /* ... */ }
```
À chaque tour, PHP appelle lui-même : `rewind()` une fois au départ, puis répète `valid()` → `current()` (et `key()`) → corps de la boucle → `next()`, jusqu'à ce que `valid()` renvoie `false`. On n'écrit jamais ces appels soi-même.

### Dans le cours : `CFileCollectionIterator`

```php
class CFileCollectionIterator implements Iterator
{
    public function rewind(): void  { $this->m_Index = 0; }
    public function valid(): bool   { /* index < nombre d'éléments ? */ }
    public function key(): mixed    { return $this->m_Index; }
    public function current(): mixed{ return $this->m_Collection->Item($this->m_Index); }
    public function next(): void    { $this->m_Index++; }
}
```
La collection garde ses éléments, l'itérateur ne garde **que la position** (`$m_Index`) : on peut donc parcourir la même collection plusieurs fois, ou avec plusieurs itérateurs en parallèle, sans qu'ils se gênent.

### Les `: void`, `: bool`, `: mixed`

Ce sont des **types de retour** déclarés : `void` (ne renvoie rien), `bool` (vrai/faux), `mixed` (n'importe quoi). PHP 8.1+ les attend pour `Iterator` afin de respecter la signature du contrat (leur absence provoque un avis de dépréciation).

## Utilisé dans ce cours

- [[TCssJsFiles et CFileCollection — Collections de fichiers CSS et JS]] — `CFileCollection::All()` renvoie un itérateur ; `CPage::WriteDocument` le parcourt avec `foreach` pour écrire les balises `<link>` et `<script>`.

## Questions de rappel actif

> **Q :** Combien de méthodes doit définir une classe qui `implements Iterator`, et lesquelles ?
> **R :** Cinq : `rewind`, `valid`, `key`, `current`, `next`.

> **Q :** Qui appelle ces méthodes quand on écrit un `foreach` ?
> **R :** PHP lui-même, automatiquement, à chaque tour de boucle — le développeur n'écrit jamais ces appels.

> **Q :** Pourquoi séparer la collection et son itérateur en deux classes ?
> **R :** La collection stocke les données ; l'itérateur ne retient que la position courante. Ça permet plusieurs parcours indépendants et garde la collection simple.

## Pièges fréquents

- ⚠️ **Oublier une des cinq méthodes** — PHP refuse la classe avec une erreur fatale.
- ⚠️ **Modifier la collection pendant le parcours** — la position de l'itérateur ne sait pas que la liste a changé ; les résultats peuvent surprendre.

## Explorer ensuite
- [[Glossaire PHP — Traits]] — l'autre mécanisme de conception introduit le 19/09.
