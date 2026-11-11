---
type: pont
subject: BcryptHasher / InscriptionService du projet ↔ PidEx_CrypterMdP / PidEx_CreerUtilisateur du cours
source: pont
seances: [2026-11-07]
tags: [#pont, #sécurité, #hachage, #MySQL, #comptes]
date: 2026-11-11
niveau: intermédiaire
critere_examen: sécurité PHP (20), base de données (10)
statut: complet
---

# Hachage du mot de passe — SHA-512 du prof ↔ bcrypt du projet

> **En 30 secondes** — Le 21/10, tu as codé l'inscription (US-AUTH-01) **avant** le cours : `InscriptionService` + `BcryptHasher` (`password_hash`, PHP). Le 07/11, le prof montre sa version : l'empreinte est calculée **dans MySQL** en SHA-512 avec l'Id et le login comme sel. Les deux protègent le mot de passe, pas de la même façon. À l'oral, il faut savoir expliquer **les deux** et justifier ton choix.

## 1. Vue Macro & Utilité
- **Problématique** : si la table des comptes fuit, l'attaquant ne doit pas retrouver les mots de passe. On stocke donc une **empreinte** (*hash* : résultat d'une fonction à sens unique), jamais le mot de passe.
- **Emplacement dans la carte globale** : frontière **code ↔ donnée**, au moment de l'inscription puis de chaque connexion.
- **Analogie (restauration)** : le prof plastifie le badge avec **le nom de l'employé et son numéro** (sel) dans une machine **très rapide** (SHA-512). bcrypt utilise un sel **tiré au hasard** et une machine **volontairement lente** : un voleur qui veut tester des millions de badges y passe des années au lieu de minutes.

## 2. Le Pont Systémique (sous le capot)
- **SHA-512** est conçu pour être **rapide** (vérifier des fichiers). Une carte graphique en calcule des **centaines de millions par seconde** : une attaque par dictionnaire sur une table volée est rapide, même avec un sel. ⚠️ *Ordre de grandeur général, non mesuré ici.*
- **bcrypt** a un **coût** réglable (par défaut 10 = 2¹⁰ tours) : chaque essai coûte quelques dizaines de millisecondes. Le sel aléatoire et le coût sont **rangés dans l'empreinte** elle-même (`$2y$10$<sel><hash>`), d'où une colonne de 60 caractères.
- **Où se fait le calcul** : chez le prof, le mot de passe en clair va de PHP à MySQL dans la requête. Dans ton projet, il ne quitte jamais PHP ; MySQL ne reçoit que l'empreinte.

## 3. Correspondance

| Ton projet (21/10) | Le cours (07/11) | Note du cours |
|---|---|---|
| `BcryptHasher::hacher()` → `password_hash($mdp, PASSWORD_BCRYPT)` | `PidEx_CrypterMdP` → `SHA2(CONCAT(Id, Login, mdp), 512)` | [[Schéma PID — tables Role et Utilisateur et fonctions stockées]] |
| Sel aléatoire, intégré à l'empreinte | Sel = Id + Login (connus, stables) | idem |
| Vérification : `password_verify($mdp, $hash)` | Vérification : recalculer `PidEx_CrypterMdP(Id, mdp)` et comparer | *(pas encore montré)* |
| `ComptesRepository` + exception `EmailDejaUtiliseException` (contrainte UNIQUE) | `UNIQUE (Login)` + `CONTINUE HANDLER FOR 1062` → `"KO\n…"` | idem |
| Identifiant de connexion = **email** | Identifiant = **Login**, email à part (`EmailAValider`) | idem |
| `StatutCompte` (en_attente_verification, actif, bloque, desactive) | Pas de colonne de statut : déduit de `EmailValide`, `InstantDegel` ⚠️ *Probable* | idem |
| Rôle en texte (`'client'`) | `Ref_Role` → table `Role` (A, G, C) | idem |

**Ce que la version du prof cache** : changer le login change l'empreinte → il faudra la recalculer (donc redemander le mot de passe) à chaque renommage.
**Ce que bcrypt fait mieux** : lenteur réglable, sel aléatoire, standard PHP (`password_*`), mot de passe jamais envoyé à la base. **Ce que la version du prof fait bien** : tout est garanti par la base, même si un autre programme qu'ici écrit dans la table.

## 4. Synthèse & Prochaine Étape
**À retenir (3 puces max)**
- Les deux stockent une **empreinte salée**, jamais le mot de passe.
- Différence clé : SHA-512 est **rapide** (mauvais pour des mots de passe), bcrypt est **lent exprès**.
- Ton schéma (email, statut texte) diverge du sien (login, table `Role`) : à réconcilier quand tu brancheras `ComptesRepository` sur MySQL.

**Question d'oral probable** — *« Pourquoi ne pas avoir repris la fonction SQL du cours ? »* → « Elle sale bien le mot de passe, mais SHA-512 est conçu pour être rapide ; `password_hash` (bcrypt) est lent volontairement et tire un sel aléatoire, ce qui rend une attaque sur une base volée beaucoup plus coûteuse. Et le mot de passe en clair ne transite jamais vers MySQL. »

**Décision ouverte (pour mentalyas)** : garder bcrypt (meilleure pratique, mais écart au cours) ou suivre le schéma du prof pour coller à l'examen — à trancher quand le prof montrera la connexion PHP → MySQL.

**Lien avec la suite** : [[Laravel ↔ framework PID — Correspondances]] — Laravel utilise aussi bcrypt (`Hash::make`), le choix du projet reste cohérent avec la cible Laravel.
