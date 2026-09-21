---
type: glossaire
subject: Superglobales PHP et $_SESSION (persistance entre requêtes HTTP)
tags: [#PHP, #glossaire, #session, #http]
date: 2026-09-21
niveau: intermédiaire
---

# Superglobales et sessions en PHP

> Chaque requête HTTP est comme un visiteur amnésique qui frappe à la porte, discute, puis repart et oublie tout. `$_SESSION` est le badge qu'on lui donne à sa première visite : à chaque nouvelle visite, s'il présente le même badge (un cookie contenant un identifiant), le serveur retrouve son dossier — sinon, c'est reparti de zéro comme pour un inconnu.

## En 30 secondes

Les **superglobales** sont des tableaux PHP automatiquement disponibles partout dans le code sans rien déclarer (`$_SESSION`, `$_GET`, `$_POST`, `$_SERVER`...) ; `$_SESSION` en particulier est le seul mécanisme natif qui permette de **conserver des données entre plusieurs requêtes HTTP successives** d'un même visiteur.

## En détail

### Le problème que `$_SESSION` résout : HTTP est "sans état"

Chaque requête HTTP (chaque chargement de page, chaque clic) est **totalement indépendante** de la précédente — PHP redémarre son exécution de zéro à chaque fois, aucune variable normale ne survit d'une requête à l'autre. Sans mécanisme dédié, il serait impossible de savoir, à la requête n°2, ce qui s'est passé à la requête n°1 (ex. "cet utilisateur est-il connecté ?", "quel devis était-il en train de composer ?").

### Comment `$_SESSION` fonctionne concrètement

```php
if (!isset($_SESSION) && !@session_start())
{
    die("impossible de demarrer la session");
}

$_SESSION["personne"] = $objet;   // stocke n'importe quelle donnée, y compris un objet
$p1 = $_SESSION["personne"];       // la relit
```

1. `session_start()` démarre (ou reprend) une session : PHP envoie un cookie au navigateur contenant un identifiant unique de session.
2. À chaque requête suivante, le navigateur renvoie ce cookie automatiquement — PHP retrouve, côté serveur (dans un fichier temporaire ou une base), les données précédemment stockées dans `$_SESSION` pour cet identifiant.
3. Écrire dans `$_SESSION[...]` sauvegarde une donnée **pour toutes les requêtes futures de ce même visiteur**, jusqu'à expiration ou déconnexion.

### Stocker un objet en session — sérialisation automatique

Quand un **objet** (pas juste une chaîne ou un nombre) est stocké dans `$_SESSION`, PHP le convertit automatiquement en texte (`serialize()`) pour le sauvegarder, puis le reconvertit en objet (`unserialize()`) à la requête suivante quand on le relit. C'est précisément ce moment de reconversion qui déclenche la méthode magique `__wakeup()` si la classe en définit une — voir [[Glossaire PHP — Méthodes magiques]].

## Sous le capot
- Les superglobales (`$_GET`, `$_POST`, `$_SERVER`, `$_SESSION`…) sont **remplies par le moteur avant l'exécution du script** : `$_GET` à partir de la query string de l'URL, `$_SERVER` par le serveur web.
- **Session** : `session_start()` lit le cookie d'identifiant envoyé par le navigateur, puis **relit le fichier de session** correspondant sur le disque du serveur et **désérialise** son contenu dans `$_SESSION`. À la **fin** de la requête, PHP **réécrit** ce fichier avec l'état courant. Le cookie est posé par un **en-tête HTTP** ([[Glossaire — En-têtes HTTP et header()]]).
- Par défaut, PHP **verrouille** le fichier de session tant que la session est ouverte : deux requêtes simultanées du même visiteur s'exécutent l'une après l'autre. *(⚠️ Probable : comportement par défaut, dépend de la configuration.)*

## Utilisé dans ce cours

- [[Structure POO — CPersonne et CAutre]] — `$_SESSION["personne"]` conserve l'objet `CPersonne` d'une exécution de `test_poo.php` à l'autre, preuve concrète qu'un objet PHP "survit" au rechargement de la page.
- [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] — `$_SESSION[PID_APPLICATION_SESSION_ITEM_NAME]` formalise exactement le même principe pour le singleton applicatif, avec `__wakeup()` en plus pour tracer la restauration.

## Questions de rappel actif

> **Q :** Pourquoi une variable PHP normale (`$x = 5;`) ne survit-elle jamais d'une requête HTTP à l'autre, contrairement à `$_SESSION["x"]` ?
> **R :** Parce que PHP exécute chaque requête comme un script totalement indépendant qui démarre et se termine — aucune mémoire n'est partagée entre deux exécutions, sauf via un mécanisme de persistance explicite comme `$_SESSION` (sauvegardé côté serveur et retrouvé grâce à un cookie d'identifiant).

> **Q :** Que se passe-t-il en coulisse quand on stocke un objet PHP dans `$_SESSION` puis qu'on le relit à la requête suivante ?
> **R :** PHP le sérialise (convertit en texte) automatiquement à la fin de la première requête, puis le désérialise (reconstruit l'objet) au début de la requête suivante quand `$_SESSION` est relu — et appelle `__wakeup()` sur cet objet juste après, si la classe en définit une.

## Pièges fréquents

- ⚠️ **Oublier `session_start()`** — sans lui, `$_SESSION` n'est tout simplement pas initialisé et toute tentative d'y écrire échoue silencieusement ou génère une erreur.
- ⚠️ **Croire que `$_SESSION` est partagé entre tous les visiteurs** — non, chaque visiteur a sa propre session isolée (identifiée par son cookie) ; deux visiteurs différents ne voient jamais les données de session l'un de l'autre.

## Explorer ensuite
- [[Glossaire PHP — Méthodes magiques]] — `__wakeup()`, le point d'entrée exact où la désérialisation depuis `$_SESSION` redonne vie à un objet.
- [[Glossaire PHP — Propriétés et méthodes statiques]] — le complément "mémoire courte" (une seule requête) de la mémoire longue qu'est `$_SESSION`.
