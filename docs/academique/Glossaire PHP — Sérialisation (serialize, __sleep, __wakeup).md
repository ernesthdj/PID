---
type: glossaire
subject: Sérialisation PHP — transformer un objet en texte (serialize/unserialize, __sleep, __wakeup)
tags: [#PHP, #glossaire, #session, #POO, #serialisation]
date: 2026-10-11
niveau: intermédiaire
---

# Sérialisation en PHP (`serialize`, `__sleep`, `__wakeup`)

> Un objet vit dans la mémoire du serveur le temps d'une requête, puis disparaît. Pour le ranger dans un tiroir (la session, un fichier, une base) et le retrouver plus tard, il faut le **mettre en boîte** : le décrire en texte, puis le reconstruire à partir de ce texte. C'est la sérialisation.

## En 30 secondes

**Sérialiser** = convertir un objet en une chaîne de caractères qui décrit sa classe et ses membres ; **désérialiser** = recréer l'objet à partir de cette chaîne. PHP le fait **tout seul** quand on range un objet dans `$_SESSION` (voir [[Glossaire PHP — Superglobales et sessions]]) : à la fin de la requête, la session est sérialisée dans un fichier ; à la requête suivante, elle est désérialisée.

## C'est quoi et comment ça marche

### Le problème
Une requête HTTP est amnésique : tout ce qui est en mémoire disparaît à la fin du script. Pour garder un objet d'une requête à l'autre, il faut l'écrire quelque part **sous une forme qui survit** — du texte. Or un objet est un assemblage de membres (`m_Nom`, `m_Prenom`…) et de références vers d'autres objets : on ne peut pas simplement « copier la mémoire ».

### Le mécanisme
```php
$texte = serialize($personne);
// O:9:"CPersonne":2:{s:11:"\0CPersonne\0m_Nom";s:8:"Duchemin";...}
$copie = unserialize($texte);
```
Le texte contient : le **nom de la classe**, le **nombre de membres**, puis chaque membre avec son nom et sa valeur. Pour un membre `private`, le nom est **« mangled »** (« déformé ») : `"\0CPersonne\0m_Nom"` — le caractère nul `\0`, le nom de la classe, `\0`, le nom du membre. C'est ainsi que PHP distingue un `private` de la classe mère d'un `private` de la classe fille.

### Les deux crochets : `__sleep` et `__wakeup`
- **`__sleep()`** — appelée **juste avant** la sérialisation. Elle renvoie **la liste des noms de membres à conserver** (au format mangled pour les `private`). Tout ce qui n'est pas dans la liste est abandonné.
- **`__wakeup()`** — appelée **juste après** la désérialisation, pour réinitialiser ce qui n'a pas été conservé (voir [[Glossaire PHP — Méthodes magiques]]).

### Ce qui ne se sérialise pas
Une **closure** (fonction anonyme, [[Glossaire PHP — Closures et fonctions anonymes]]) ne peut pas être mise en boîte : PHP lève une exception (`Serialization of 'Closure' is not allowed`). Même chose pour une ressource (connexion, fichier ouvert). D'où l'intérêt de `__sleep()` : **retirer de la liste** ce qui est non sérialisable.

### Pièges
- Un objet **partagé** ou **circulaire** (A pointe vers B qui pointe vers A) : `serialize` sait le gérer, mais si on parcourt soi-même les objets (comme le fait `Exhibit`, voir [[IExhibitable et TExhibitable — Exposer l'état sérialisable d'un objet]]), il faut mémoriser les objets déjà vus pour ne pas tourner en boucle.
- `__sleep()` doit être **publique** et renvoyer un tableau de noms existants.
- Désérialiser des données qui viennent d'un **utilisateur** est dangereux (`unserialize` peut instancier des classes arbitraires) : on ne le fait que sur des données que le serveur a lui-même écrites, comme la session.

## Sous le capot
En fin de script, PHP appelle `session_write_close()` implicitement : il sérialise `$_SESSION` (via le gestionnaire « php » par défaut) et écrit le texte dans un fichier du dossier de sessions du serveur, nommé d'après l'identifiant du cookie `PHPSESSID`. À la requête suivante, `session_start()` relit ce fichier et désérialise : **l'autoloader est appelé** si la classe de l'objet n'est pas encore chargée (c'est pourquoi l'autoloader du framework doit pouvoir retrouver `CPersonne` sans `require` explicite).

## Liens
- Utilisé dans [[IExhibitable et TExhibitable — Exposer l'état sérialisable d'un objet]] et dans le singleton [[CApplication, CMonApp et CPage — Singleton applicatif et charset]].
