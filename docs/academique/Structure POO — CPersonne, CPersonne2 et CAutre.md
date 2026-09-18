---
type: concept
subject: Structure POO des classes d'exercice (CPersonne, CPersonne2, CAutre)
module: PID — Framework maison (samedis 29/08, 05/09, 12/09)
tags: [#PID, #PHP, #POO, #encapsulation]
date: 2026-09-12
niveau: débutant
statut: complet
analogie_domaine: restauration / logistique
---

# Structure POO — CPersonne et CAutre

> ⚠️ **Correction (12/09, publication post-cours)** : cette note avait été rédigée à partir du matériel publié *avant* le cours du 12/09, qui décrivait encore deux classes quasi identiques (`CPersonne` et `CPersonne2`) dans deux fichiers séparés. La version réellement publiée après le cours **fusionne** ces deux classes en une seule, renommée `CPersonne`, colocalisée avec `CAutre` dans le même fichier `dir1/dir2/personne.php` — `dir1/truc/machin/personne.php` n'existe plus du tout. Le contenu ci-dessous a été corrigé en conséquence.

> Cette classe, c'est comme le dossier RH d'un employé dans un restaurant : ses informations personnelles (nom, prénom) sont **privées**, rangées dans un tiroir fermé (`private`) auquel seul le service RH a la clé. Un client ou un collègue ne peut jamais fouiller le tiroir directement — il doit passer par le guichet RH (les méthodes publiques `Nom()`/`Prenom()`), qui vérifie chaque demande avant de répondre.

## En une phrase simple

`CPersonne` et `CAutre` sont deux classes d'exercice déclarées **dans le même fichier** (`dir1/dir2/personne.php`, POO = Programmation Orientée Objet) : la première illustre le principe d'**encapsulation** (données privées, accès uniquement via des méthodes publiques validantes), la seconde est volontairement vide — un simple cas de test pour l'autoloader.

## Pourquoi ça existe ?

Le prof a fait évoluer cet exercice entre le 05/09 et le 12/09. Dans la version du 05/09, `CPersonne` (`dir1/truc/machin/personne.php`) et `CPersonne2` (`dir1/dir2/personne.php`) étaient deux copies structurellement identiques, chacune dans son propre fichier — pour prouver que la recherche récursive de l'autoloader (voir [[Autoloading PID — spl_autoload_register et le Cache]]) fonctionne peu importe où une classe se trouve dans l'arborescence. Le 12/09, le prof **consolide** l'exercice : `CPersonne2` disparaît, `CPersonne` est déplacée dans `dir1/dir2/personne.php` et rejoint `CAutre` (une classe vide) **dans le même fichier**, avec en prime un commentaire glissé entre le mot-clé `class` et le nom de la classe (`class /* OUPS un commentaire */ CPersonne`). Cette évolution sert désormais **deux raisons pédagogiques différentes** de celles d'origine :
1. Démontrer la POO de base (encapsulation, accesseurs avec validation, constructeur) sur un cas simple.
2. Prouver que la recherche de l'autoloader par tokenisation (`token_get_all()`, voir [[Autoloading PID — spl_autoload_register et le Cache]]) isole correctement **le bon nom de classe parmi plusieurs déclarées dans le même fichier**, et reste robuste face à un commentaire inséré au milieu de la déclaration — un cas plus exigeant que "deux fichiers différents".

## Comment ça fonctionne ?

### 1. Les propriétés privées — le tiroir fermé

```php
private $m_Nom;
private $m_Prenom;
```

Préfixe `m_` = convention de nommage pour "membre" (propriété d'instance). `private` signifie que **seul le code à l'intérieur de la classe elle-même** peut lire ou écrire directement ces variables — ni le script appelant, ni même une classe qui hériterait de celle-ci (contrairement à `protected`).

### 2. Les méthodes accesseurs — le guichet, avec un seul point d'entrée pour lire ET écrire

```php
public function Nom($valeur = null)
{
    if ($valeur !== null)
    {
        if (!is_string($valeur)) return false;
        $valeur = trim($valeur);
        if (empty($valeur)) return false;
        $this->m_Nom = $valeur;
        return true;
    }
    else
    {
        return $this->m_Nom;
    }
}
```

Une seule méthode `Nom()` fait office de **getter et de setter à la fois** : appelée sans argument (`$p1->Nom()`), elle renvoie la valeur actuelle ; appelée avec un argument (`$p1->Nom("Duvivier")`), elle tente de **modifier** la valeur, mais seulement après validation (`is_string`, `trim`, `empty`) — un `float` comme `3.141592` ou une chaîne vide/uniquement des espaces sont rejetés (`return false`), la propriété n'est pas touchée. `Prenom()` suit exactement le même patron.

### 3. Le constructeur — passer par les accesseurs, pas par un raccourci

```php
public function __construct($nom, $prenom)
{
    $this->Nom($nom);
    $this->Prenom($prenom);
}
```

`__construct` est la méthode magique appelée automatiquement à chaque `new CPersonne(...)`. Point important : le constructeur **réutilise les méthodes `Nom()`/`Prenom()`** plutôt que d'écrire directement `$this->m_Nom = $nom;` — la même validation s'applique donc à la création qu'à une modification ultérieure. Aucune donnée n'entre dans l'objet sans passer par le contrôle qualité du guichet.

### 4. `CAutre` et le commentaire piégé — le figurant qui teste la tokenisation

```php
class CAutre
{
}
// Ma classe personne
class /* OUPS un commentaire */ CPersonne
{
    ...
}
```

`CAutre` est une classe vide, sans aucune propriété ni méthode, déclarée **dans le même fichier** que `CPersonne` — `dir1/dir2/personne.php`. Son rôle : vérifier que l'autoloader (qui cherche un nom de classe précis via tokenisation, voir [[Autoloading PID — spl_autoload_register et le Cache]]) ne se laisse pas perturber par la présence d'une autre classe dans le même fichier et isole bien `class CPersonne`, pas `class CAutre`. Le commentaire `/* OUPS un commentaire */` inséré **entre le mot-clé `class` et le nom `CPersonne`** pousse le test un cran plus loin : `token_get_all()` découpe ce commentaire en un token à part entière (`T_COMMENT`), distinct du mot-clé `class` (`T_CLASS`) et du nom (`T_STRING`) — l'autoloader doit donc reconnaître la séquence "`class`, puis *éventuellement* du bruit (commentaire, espaces), puis le nom" plutôt qu'un simple "`class` suivi immédiatement du nom", sous peine de rater la classe alors même qu'elle est syntaxiquement valide en PHP.

## Schéma

```mermaid
classDiagram
    class CPersonne {
        -string m_Nom
        -string m_Prenom
        +Nom(valeur) 
        +Prenom(valeur)
        +__construct(nom, prenom)
    }
    class CAutre {
    }
    note for CPersonne "dir1/dir2/personne.php — class /* OUPS un commentaire */ CPersonne"
    note for CAutre "meme fichier que CPersonne, classe vide, declaree AVANT dans le fichier"
```

## Exemple concret

Tiré directement de `test_poo.php` :

```php
$p1 = new CPersonne("Duchemin", "Robert");
var_dump($p1->Nom(), $p1->Prenom());   // "Duchemin", "Robert"

$p1->Nom(3.141592);      // rejeté : ce n'est pas une chaîne -> false, m_Nom inchangé
$p1->Prenom("   ");      // rejeté : chaîne vide après trim -> false, m_Prenom inchangé
var_dump($p1->Nom(), $p1->Prenom());   // toujours "Duchemin", "Robert"

$p1->Nom("Duvivier");
$p1->Prenom(" Marcel  ");             // accepté, trim() applique -> "Marcel"
var_dump($p1->Nom(), $p1->Prenom());   // "Duvivier", "Marcel"
```

Le script stocke même l'objet en session (`$_SESSION["personne"]`) pour montrer qu'un objet PHP peut être sérialisé et retrouvé entre deux requêtes — l'objet "survit" au rechargement de la page.

## Connexions

- [[Glossaire PHP — Visibilité et encapsulation]] — détail complet de `private`/`public` et du principe d'encapsulation illustré ici.
- [[Glossaire PHP — Méthodes magiques]] — détail complet de `__construct()` et des autres méthodes que PHP appelle automatiquement.
- [[Glossaire PHP — Superglobales et sessions]] — comment `$_SESSION["personne"]` fait réellement survivre cet objet entre deux requêtes.
- [[Autoloading PID — spl_autoload_register et le Cache]] — c'est précisément ce mécanisme qui charge ces classes la première fois qu'on écrit `new CPersonne(...)`.
- [[Evolution de l'Autoloader — Boucle de Retry (0509 vers 1209)]] — ces mêmes classes servent de cas de test au mécanisme de vérification `class_exists` après inclusion.
- [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] — `test_poo.php` (12/09) active désormais aussi `CApplication` avant de manipuler `CPersonne` ; les deux exercices cohabitent dans le même script de test et partagent le même principe de persistance en session.

## Questions de rappel actif

> **Q :** Pourquoi `Nom()` et `Prenom()` sont-elles à la fois getter et setter au lieu d'avoir deux méthodes séparées (`getNom()`/`setNom()`) ?
> **R :** C'est un choix de style du prof (un seul point d'entrée par propriété, le paramètre optionnel `$valeur = null` distingue lecture et écriture) — le principe d'encapsulation reste le même que des getters/setters séparés : validation systématique avant toute modification.

> **Q :** Que se passe-t-il si on appelle `$p1->Nom(3.141592)` — la propriété `m_Nom` change-t-elle ?
> **R :** Non — `is_string(3.141592)` renvoie `false`, la méthode retourne `false` immédiatement sans toucher à `$this->m_Nom`, qui garde donc sa valeur précédente.

> **Q :** Pourquoi le constructeur appelle-t-il `$this->Nom($nom)` plutôt que d'écrire directement `$this->m_Nom = $nom` ?
> **R :** Pour garantir que **toute** entrée de donnée dans l'objet — que ce soit à la construction ou plus tard — passe par la même validation, évitant qu'un objet soit créé avec un nom invalide qu'on ne pourrait jamais fixer via la construction.

> **Q :** À quoi sert `CAutre`, une classe complètement vide, dans le cadre du cours ?
> **R :** À vérifier que l'autoloader sait retrouver précisément la bonne classe (`CPersonne`) même quand plusieurs classes sont déclarées dans le même fichier — la tokenisation doit isoler le bon nom, pas se contenter du premier `class` rencontré.

> **Q :** Pourquoi le prof insère-t-il un commentaire entre `class` et `CPersonne` (`class /* OUPS un commentaire */ CPersonne`) ?
> **R :** Pour vérifier que la recherche par tokenisation de l'autoloader reste robuste même quand du "bruit" syntaxiquement valide (un commentaire) sépare le mot-clé `class` du nom réel de la classe — un test plus exigeant qu'une déclaration "propre" sans rien entre les deux.

## Pièges fréquents

- ⚠️ **Croire que `private` empêche uniquement l'accès depuis l'extérieur, mais pas depuis une classe fille** — en PHP, `private` bloque aussi les classes qui hériteraient de celle-ci ; seul `protected` autoriserait l'accès depuis une sous-classe.
- ⚠️ **Oublier que `Nom()` sans argument et `Nom(null)` sont indistinguables ici** — la vérification `$valeur !== null` fait qu'on ne peut pas "remettre le nom à null" volontairement via cette méthode ; c'est une limite assumée de ce patron simplifié.
- ⚠️ **Chercher `CPersonne2` ou `dir1/truc/machin/personne.php`** — ces deux noms appartenaient à la version du 05/09 et à la première publication (avant-cours) du 12/09. Depuis la publication post-cours du 12/09, il n'y a plus qu'une seule classe `CPersonne`, dans `dir1/dir2/personne.php`, aux côtés de `CAutre`.

## À retenir absolument
- Encapsulation = données privées + accès contrôlé par méthode publique validante.
- Le constructeur ne doit jamais contourner la validation des accesseurs.
- `CAutre` n'a de valeur que comme cas de test pour l'autoloader, pas comme code métier — et depuis le 12/09, elle partage son fichier avec `CPersonne` pour durcir ce test (plusieurs classes + commentaire au milieu d'une déclaration).

## Explorer ensuite
- Retour à [[Autoloading PID — spl_autoload_register et le Cache]] pour boucler la boucle : comment ces classes sont concrètement retrouvées et chargées.
