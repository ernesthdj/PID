---
type: glossaire
subject: MySQL — base, table, clé primaire / étrangère / unique, utilisateur et droits, fonction stockée
tags: [#glossaire, #MySQL, #SQL, #BDD, #sécurité]
date: 2026-11-11
niveau: débutant
---

# MySQL — tables, clés et droits

> **En 30 secondes** — **MySQL** est un **SGBD** (*Système de Gestion de Base de Données* — le programme qui range, protège et retrouve les données). PHP ne lit pas les fichiers de la base : il **envoie des requêtes SQL** (*Structured Query Language* — langage de requêtes structuré) à un **serveur MySQL** qui répond. Une base = des **tables** ; une table = des **lignes** et des **colonnes** typées ; des **clés** garantissent l'unicité et les liens.

> 📘 **Introduction (ajoutée)** — Le 07/11, le prof publie `pid.struct.sql` sans séance d'introduction à MySQL dans le matériel. Ce glossaire pose les bases ; le schéma lui-même est expliqué dans [[Schéma PID — tables Role et Utilisateur et fonctions stockées]]. Tu connais déjà SQL (profil) : l'accent est mis sur ce qui est **spécifique à MySQL** et à la **sécurité**.

## 1. C'est quoi, et pourquoi ça existe ?
- **Problématique** : la session PHP s'efface ; un fichier texte ne supporte pas 100 visiteurs qui écrivent en même temps. Il faut un stockage **durable**, **partagé** et **cohérent** (pas deux comptes avec le même login).
- **Analogie (restauration)** : la base est la **chambre froide** du restaurant. PHP est le cuisinier : il n'entre pas, il **passe commande au magasinier** (le serveur MySQL) avec un bon normalisé (SQL). Le magasinier a des **règles** : un emplacement par produit (clé primaire), pas deux étiquettes identiques (UNIQUE), pas de plat qui référence un ingrédient inexistant (clé étrangère). Et chaque cuisinier a un **badge** qui limite ce qu'il peut faire (droits).

## 2. Comment ça marche (sous le capot)
- **Deux processus** : PHP (dans Apache) et MySQL (`mysqld`) sont deux programmes. Ils se parlent par une **connexion réseau** (port 3306, même en local) authentifiée par un **utilisateur MySQL** + mot de passe.
- **Disque** : le moteur **InnoDB** range les tables dans des fichiers, tient un journal (pour survivre à une coupure) et gère les **transactions** et les clés étrangères (l'ancien moteur MyISAM ne les vérifie pas).
- **Index** : une clé primaire ou UNIQUE crée un **index** (un arbre trié, comme l'index d'un livre) : retrouver un login parmi un million de lignes prend quelques lectures, pas un million.

## 3. En pratique — le vocabulaire du fichier du prof
| Instruction | Rôle |
|---|---|
| `CREATE DATABASE IF NOT EXISTS x; USE x;` | Créer la base si absente, puis travailler dedans |
| `INT NOT NULL AUTO_INCREMENT` + `PRIMARY KEY (Id)` | Identifiant unique, numéroté par MySQL |
| `UNIQUE (Login)` | Refuse un doublon → **erreur 1062** (*Duplicate entry*) |
| `FOREIGN KEY (Ref_Role) REFERENCES role (Id) ON DELETE RESTRICT` | Lien vers une autre table ; interdit de supprimer un rôle encore utilisé |
| `CREATE USER ... ; GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON base.*` | Un **compte MySQL dédié au site**, limité à ses tables, sans droit de modifier la structure |
| `CREATE FUNCTION ... BEGIN ... END` + `DELIMITER $$` | **Fonction stockée** : du code qui s'exécute **dans** MySQL ; `DELIMITER` change le séparateur pour que les `;` internes ne coupent pas la définition |

**Principe du moindre privilège** : le site se connecte avec `u_pid_exemple`, qui peut lire/écrire les données mais **ni créer ni supprimer de table**. Une injection SQL réussie ferait donc moins de dégâts qu'avec `root`.

## Utilisé dans ce cours
- [[Schéma PID — tables Role et Utilisateur et fonctions stockées]] — le premier schéma du cours (07/11)
- [[Hachage du mot de passe — SHA-512 du prof ↔ bcrypt du projet]] — où et comment le mot de passe est transformé

## Retenir et vérifier
- **À retenir** : MySQL est un serveur séparé interrogé en SQL ; les clés (PRIMARY, UNIQUE, FOREIGN) font respecter les règles **par la base elle-même** ; le site utilise un compte MySQL aux droits minimaux.
> **Q :** Pourquoi `UNIQUE (Login)` alors que PHP vérifiera déjà que le login est libre ? **R :** Deux inscriptions simultanées peuvent passer la vérification PHP en même temps ; seule la base tranche de façon sûre (erreur 1062).
> **Q :** Pourquoi ne pas connecter le site avec `root` ? **R :** Moindre privilège : en cas de faille, l'attaquant n'aurait que les droits du compte du site.

**Pièges** : ⚠️ un mot de passe MySQL écrit dans un fichier commité sur git est public pour qui voit le dépôt · ⚠️ sous Linux, les noms de tables sont sensibles à la casse (`Role` ≠ `role`) — le script du prof mélange les deux (voir la note du schéma).
