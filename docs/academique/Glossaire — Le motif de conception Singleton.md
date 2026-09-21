---
type: glossaire
subject: Le motif de conception Singleton (design pattern, indépendant de PHP)
tags: [#glossaire, #design-pattern, #POO, #singleton]
date: 2026-09-21
niveau: intermédiaire
---

# Le motif de conception Singleton

> Une ville n'a qu'une seule mairie officielle. On peut construire d'autres bâtiments qui ressemblent à une mairie, mais un seul est **la** mairie reconnue par tout le monde — et il existe une procédure unique et contrôlée pour savoir laquelle c'est, jamais de "construis-en une nouvelle si t'en as besoin".

## En 30 secondes

Le Singleton est un motif de conception (design pattern — une solution réutilisable à un problème récurrent, indépendante d'un langage précis) qui garantit qu'**une classe ne peut jamais avoir plus d'une seule instance** à un instant donné, et fournit un point d'accès global unique vers cette instance.

## En détail

### Les trois ingrédients du Singleton

1. **Un constructeur inaccessible de l'extérieur** (`private` ou `protected`) — empêche `new MaClasse()` depuis n'importe où ailleurs que la classe elle-même. Voir [[Glossaire PHP — Visibilité et encapsulation]].
2. **Une propriété statique** qui garde la référence vers l'unique instance créée. Voir [[Glossaire PHP — Propriétés et méthodes statiques]].
3. **Une méthode statique publique** (souvent nommée `Instance()`, `getInstance()`) qui renvoie toujours la même instance — la crée à la demande si elle n'existe pas encore, sinon renvoie celle déjà existante.

```php
class MaClasse
{
    private static $instance;

    public static function Instance()
    {
        if (self::$instance === null) {
            self::$instance = new self();   // seul endroit du code autorisé à créer une instance
        }
        return self::$instance;
    }

    private function __construct() { }   // verrouille toute création externe
}
```

### Pourquoi utiliser ce motif

Certaines ressources n'ont de sens qu'en un seul exemplaire dans un programme : une configuration globale, une connexion à une base de données, un journal d'événements (logger)... Créer plusieurs instances indépendantes de ces objets risquerait des incohérences (deux configurations différentes lues à deux endroits du code, par exemple). Le Singleton **garantit structurellement** — pas juste "par convention" — qu'il n'y en aura jamais qu'une.

### La limite à connaître (hors périmètre strict du cours)

Le Singleton est un motif parfois critiqué en génie logiciel : il introduit un état global implicite (accessible de partout, donc difficile à tracer) et complique les tests automatisés (impossible de remplacer facilement l'instance unique par une version de test). Le cours ne l'aborde pas sous cet angle critique — il l'utilise tel quel comme illustration du motif, ce qui est suffisant pour le niveau visé.

## Sous le capot
- La propriété statique est stockée **une seule fois avec la définition de la classe** (pas dans chaque objet), dans la **RAM du processus PHP**. Un constructeur non public fait refuser `new` par le moteur hors de la classe.
- **Nuance importante** : « une seule instance » vaut **par processus / par requête**. Deux visiteurs simultanés ont chacun leur exécution PHP, donc chacun sa propre instance. Et l'objet rangé en session est **copié en texte** : à la requête suivante c'est un **nouvel objet reconstruit**, pas « le même » — l'unicité est alors maintenue par la logique d'`Instance()` qui reprend la session (voir [[CApplication, CMonApp et CPage — Singleton applicatif et charset]]).

## Utilisé dans ce cours

- [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] — implémentation complète du motif, avec en plus une couche de persistance en session pour que l'unicité survive même entre deux requêtes HTTP différentes (raffinement au-delà du Singleton "classique" mono-requête).

## Questions de rappel actif

> **Q :** Quels sont les trois éléments indispensables pour qu'une classe PHP implémente correctement le motif Singleton ?
> **R :** Un constructeur non `public` (empêche `new` externe), une propriété statique qui garde l'unique instance, et une méthode statique publique qui crée l'instance à la demande si besoin, sinon renvoie celle déjà existante.

> **Q :** Pourquoi le constructeur doit-il être `private`/`protected` et pas simplement "conseillé de ne pas appeler directement" ?
> **R :** Parce qu'une convention non vérifiée par le langage serait tôt ou tard violée par erreur — rendre le constructeur inaccessible transforme la règle "il ne doit y avoir qu'une instance" en garantie structurelle que PHP fait respecter lui-même, pas en simple bonne intention du développeur.

## Pièges fréquents

- ⚠️ **Oublier qu'un Singleton "classique" ne survit que le temps d'un script** — en PHP, sans persistance additionnelle (session, fichier, base de données), l'unicité ne vaut que pour une seule requête HTTP ; voir [[Glossaire PHP — Superglobales et sessions]] pour la suite logique.
- ⚠️ **Croire que Singleton = "variable globale déguisée"** — la nuance est réelle : le Singleton contrôle *la création* (une seule possible) alors qu'une simple variable globale n'empêche personne d'en créer une deuxième ailleurs.

## Explorer ensuite
- [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] — voir ce motif appliqué et étendu avec la persistance en session.
