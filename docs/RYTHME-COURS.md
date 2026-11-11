# Rythme du cours — ce qui est vu, ce que le projet suppose

> **Règle (mentalyas, 2026-09-21) :** ~~le projet avance au même rythme que le cours, jamais devant~~ — **levée le 2026-11-11** : l'implémentation suit `docs/lancement/06-PLAN.md` sans verrou ; ce fichier reste le suivi pédagogique (notions vues, notions anticipées par le projet).
> **Date de l'état des lieux :** 2026-11-11 — après les cours du 17/10 et du 07/11 (§1-§3 et §6 mis à jour ; le §8 garde l'historique).
> **Fiabilité :** « vu » = présent dans le matériel publié (`Suivit_Cours/pid.aaaammjj/`) et les notes de `docs/academique/`. Ce que le prof a pu dire à l'oral sans laisser de trace **n'est pas compté** — à corriger par mentalyas si besoin.

---

## 1. Ce que le cours a couvert (7 séances)

| Séance | Notion enseignée | Note de cours |
|--------|------------------|---------------|
| 29/08 | Racine du site, `index.php` par dossier, marqueur de racine, chemin « montant », configuration du framework, aide au développeur | (texte du cours) |
| 05/09 | Bootstrap, `PID_PathTo`/`PID_Include`, autoloader + cache, premières classes (`CPersonne`) | [[Bootstrap PID — Detection de la Racine du Site]] · [[Autoloading PID — spl_autoload_register et le Cache]] |
| 12/09 | Autoloader durci (retry), `CApplication` singleton en session, charset, `CPage` squelette | [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] |
| 19/09 | Dossier `.pid/`, `CPage` complète (hooks, `IntoHtml`), trait + collection CSS/JS ; le prof retire les traces de debug (`var_dump`). Notions introduites (glossaire) : héritage, encodage des caractères, en-têtes HTTP, opérateur d'étalement | [[CPage — Générer une page HTML (WriteDocument et points d'extension)]] |
| 10/10 | Sessions démarrées par `index.php` ; objet portant une closure en session : `IExhibitable` + `TExhibitable`, `__sleep()` ; `ToUtf8`/`FromUtf8` étendus aux objets (en chantier) ; **premier JS** : jQuery 4.0.0 + `application.js` chargés par `CApplication`, chemins passés par `data-*` ; correctifs `filecollection` et `PID_PathTo`. Notions introduites (glossaire) : sérialisation, JavaScript/jQuery | [[IExhibitable et TExhibitable — Exposer l'état sérialisable d'un objet]] · [[Premier JavaScript du framework — jQuery, data-path-to-root et application.js]] |
| 17/10 | **Premier AJAX** : `ExecuteCommand` (JS, `$.ajax`) → `.pid/.treatcommand.php` → `TreatCommand` → méthode `Command_<nom>` ; réponse JSON `{success, data / errorMessage}` ; JS en classes ES6 : singleton, `DefineAppClass`, `IsA`. Notion introduite (glossaire) : AJAX/JSON. *Code seul, pas de notes `.txt`.* | [[Commandes AJAX du framework — ExecuteCommand et TreatCommand]] · [[Classes JS du framework — singleton, DefineAppClass et initialiseurs]] |
| 07/11 | **Mode DEV/PROD** (fichier marqueur hors racine, PROD par défaut) + commandes de debug `GetSession`/`ClearSession` ; JS : initialiseurs ; site nettoyé (`classes/`). **Premier MySQL** (`pid.struct.sql`) : base, utilisateur MySQL aux droits limités, tables `Role`/`Utilisateur` + clé étrangère, fonctions stockées `PidEx_CrypterMdP` (SHA-512 salé) et `PidEx_CreerUtilisateur`. Notion introduite (glossaire) : MySQL. *Deux versions publiées (v1, v2) ; v2 = référence. Pas de notes `.txt`.* | [[Mode DEV et PROD — fichiers marqueurs et commandes de debug]] · [[Schéma PID — tables Role et Utilisateur et fonctions stockées]] |

## 2. Ce que le cours **vise** (plan du 24/08) et où on en est

| Objectif du plan de cours | État |
|---------------------------|------|
| Programmation orientée objet | 🟡 en cours (classes, héritage, singleton, trait, interface `Iterator`, interface perso `IExhibitable`, sérialisation) |
| Outils : PHP | 🟡 en cours (base du framework) |
| Outils : HTML5 / CSS3 | ⚪ pas de séance dédiée (acquis préalable) |
| Outils : MySQL | 🟡 amorcé le 07/11 (schéma, clés, utilisateur MySQL, fonctions stockées) ; pas de connexion PHP → MySQL (PDO) |
| Outils : JavaScript + jQuery | 🟡 en cours (10/10 : jQuery, `ready`, `data-*` ; 17/10 : classes ES6, héritage, singleton ; 07/11 : initialiseurs) ; pas de DOM manipulé ni d'événements |
| Communication AJAX | 🟡 vue le 17/10 : canal de commandes `$.ajax` ↔ `TreatCommand`, réponse JSON ; aucune commande métier encore |
| Synchronisation d'objets client/serveur | 🟡 amorcée côté serveur le 10/10 (`Exhibit()` : présenter un objet comme un tableau) ; rien côté échange |
| Comptes de types différents (admin, gérant, client…) | 🟡 table `Role` (A, G, C) le 07/11 ; aucune logique PHP |
| Création / modification de compte, gestion des comptes par l'admin | 🟡 création côté base (`PidEx_CreerUtilisateur`, 07/11) ; ni formulaire ni appel PHP |
| Sécurité des données des comptes (y compris en base) | 🟡 07/11 : empreinte SHA-512 salée en base, compte MySQL au moindre privilège, commandes de debug fermées en PROD |
| Accès restreints (menu filtré, rejet des pages sans droit) | 🔴 pas encore abordé |
| Sécurité par email, oubli de login/mot de passe | 🟡 colonnes prévues (`EmailAValider`, `EmailValide`, `MailToken`) ; aucun envoi |
| Protection contre la force brute, états de compte | 🟡 colonnes prévues (`NombreEchecs`, `InstantDegel`) ; aucune logique |

**Lecture :** 5 séances sur les fondations du framework, puis 2 séances qui ouvrent AJAX (17/10) et la base des comptes (07/11). **Le cœur « comptes/sécurité » est amorcé côté schéma, mais aucune ligne de PHP ne parle encore à MySQL.**

## 3. Ce que la Phase 1 suppose, brique par brique

Correspondances détaillées avec Laravel : [[Laravel ↔ framework PID — Correspondances]].

Légende : ✅ débloqué (notion vue) · 🟡 partiel · ⛔ à attendre le cours · ➕ hors cours (spécifique au sujet, autorisé par le plan : « contenu intéressant… ce qui n'aura pas été réalisé dans le cadre du squelette »).

| # | Brique du projet (source) | Notion de cours requise | Verdict | Pont « Laravel ↔ cours » |
|---|---------------------------|-------------------------|---------|--------------------------|
| 1 | Squelette Laravel, routes web, config (ARCHITECTURE §1) | Racine du site, configuration, chargement | ✅ | `.pid.config.php` ↔ `.env`/`config/` ; `PID_PATH_TO_ROOT` ↔ `base_path()` |
| 2 | Chargement des classes (Composer) | Autoloader (05/09, 12/09) | ✅ | `spl_autoload_register` + cache ↔ `vendor/autoload.php` (PSR-4) |
| 3 | Couche `Domain/` pure : `TarificationCalculator`, `DistanceCalculator`, `StatutDevisStateMachine`, `VerrouillageCompteRules` (§3.1) | POO : classes, encapsulation, accesseurs validants | ✅ | Même style que `CPersonne`/`CMonApp` — du PHP pur, sans framework |
| 4 | Vues et layouts (UI-DESIGN, tokens) | `CPage` : contenu, hooks, héritage (19/09) | ✅ | `WriteHead`/`WriteBody` ↔ `@yield`/`@section` Blade ; `IntoHtml` ↔ `{{ }}` |
| 5 | Vitrine / portfolio (US-VITRINE-01→03) | HTML5/CSS3 (5 pts, acquis) | ✅ | — |
| 6 | État applicatif / session | `CApplication`, `$_SESSION` (12/09), sérialisation d'objets (10/10), lecture/vidage de session en DEV (07/11) | 🟡 | Singleton en session ↔ service container + session Laravel |
| 7 | Échappement XSS | `IntoHtml`/`IntoAttr` (19/09) | 🟡 | XSS vu ; CSRF, injection SQL, hachage **pas** vus |
| 8 | Schéma de base, migrations, Eloquent (ARCHITECTURE §2, 8 tables) | MySQL/PDO, requêtes paramétrées | 🟡 schéma SQL vu (07/11) ; PDO et requêtes paramétrées pas vus | **20 pts d'examen** (BDD 10 + SQL 10) |
| 9 | Authentification Fortify : inscription, login, reset, vérification email, force brute, états de compte (US-AUTH-01→06) | Cœur du plan de cours | ⛔ (schéma des comptes vu le 07/11, logique non vue ; US-AUTH-01 codée hors rythme le 21/10, voir [[Hachage du mot de passe — SHA-512 du prof ↔ bcrypt du projet]]) | Fortify masque le mécanisme ; l'oral exige de l'expliquer |
| 10 | Rôles, Policies, menu filtré (US-ADMIN, §3.2) | Comptes de types différents, accès restreints | ⛔ (table `Role` seulement) | Policies ↔ contrôle d'accès maison à enseigner |
| 11 | AJAX + jQuery : tunnel de devis, endpoints `/ajax/`, autocomplétion (29 endpoints) | JS/jQuery (15 pts) + AJAX (15 pts) | 🟡 échange AJAX/JSON vu (17/10) ; DOM et événements pas vus | **30 pts d'examen** |
| 12 | Génération PDF (dompdf), géocodage (Nominatim) | Aucune (contenu spécifique) | ➕ | Autorisé, mais dépend des briques 8 et 11 pour être branché |

## 4. Conséquences

1. **Phase 2 (Backend + Frontend en parallèle) est trop large pour être lancée telle quelle** : elle mélange des briques ✅ (3, 4, 5) et des briques ⛔ (8, 9, 10, 11).
2. **Le point ouvert du PO est tranché par le rythme du cours** : « US-AUTH avant US-DEVIS ? » → non. Le cœur métier du devis (briques 3 et 4, calculs purs) peut avancer maintenant ; l'auth (P0 sur le papier) doit **attendre** son enseignement.
3. **Le risque d'examen est réel** : 50 points reposent sur des notions **pas encore enseignées du tout** (JS/jQuery 15, AJAX 15, base de données 10, SQL 10), et la sécurité PHP (20) n'est couverte que sur le XSS. Fortify/Eloquent livrés « clés en main » avant le cours donneraient un projet qu'on ne saurait pas défendre à l'oral.

## 5. Proposition de séquencement (à valider)

| Étape | Contenu | Condition de départ |
|-------|---------|---------------------|
| **2a — maintenant** | Squelette Laravel + tokens CSS + layout Blade (brique 1, 4) · Vitrine statique (5) · Couche `Domain/` avec tests unitaires (3) | Aucune : notions vues |
| **2b — après le cours MySQL/PDO** | Schéma de base, migrations, Eloquent (8) | Séance MySQL faite |
| **2c — après le cours comptes/sécurité** | Auth, rôles, Policies (9, 10) | Séances comptes + sécurité faites |
| **2d — après le cours JS/AJAX** | Tunnel de devis en jQuery + endpoints `/ajax/` (11) | Séances JS/jQuery + AJAX faites |
| **2e — en dernier** | PDF, géocodage (12) | 2b et 2d livrés |

**Règle de porte :** avant chaque tâche d'implémentation, vérifier dans ce tableau que la notion de cours correspondante est passée à ✅ ; sinon la tâche attend.

## 6. Calendrier

- **Séances faites :** 7 (29/08, 05/09, 12/09, 19/09, 10/10, 17/10, 07/11). Aucun matériel pour le 26/09, le 03/10, le 24/10 ni le 31/10.
- **Dernier cours :** samedi **30/01/2027** (confirmé par mentalyas le 2026-09-21).
- **Samedis restants au maximum (après le 07/11) :** 12 (3 en novembre : 14, 21, 28 ; 4 en décembre ; 5 en janvier). Le nombre réel sera plus bas si le prof saute des samedis (congés, interruptions) — à ajuster au fil de l'eau.
- **Date de l'examen oral :** non connue (postérieure au 30/01/2027).
- **Conséquence :** au rythme actuel (4 séances pour les fondations), le prof dispose d'environ 19 séances pour enseigner tout le reste du plan (MySQL, comptes, sécurité, JS/jQuery, AJAX). Les étapes 2b→2d du §5 se débloquent donc **au fil des mois, pas d'un coup** ; l'étape 2a est la seule qui peut avancer dès maintenant.

## 7. Décisions

- ✅ **« Vu / pas vu » du §2 validé** par mentalyas (2026-09-21).
- ✅ **Phase 1 (Fortify, dompdf, `/ajax/`) conservée comme cible de fin de projet**, non réécrite maintenant. Chaque porte 2b/2c/2d est l'occasion de **re-valider** la décision correspondante contre ce que le prof aura réellement enseigné (ex. si le prof enseigne une authentification maison et PDO, l'Architecte réévalue Fortify/Eloquent avant d'implémenter — le pont pédagogique du FOUNDATION §5 reste la règle). Décision prise par Claude, mentalyas ayant laissé le choix (« comme tu le sens »).
- ✅ **Notes de cours : introduction systématique.** Quand le prof aborde une matière ou une techno « en plein milieu » (sans l'avoir introduite), la note de cours commence par un récapitulatif **« c'est quoi et comment ça marche »** avant le détail de ce qui a été montré en classe.

## 8. Suivi hors séance

### 2026-09-25 — brainstorm « catalogue de services » (aucun nouveau cours)
- **Aucune séance nouvelle** : l'état du §1-§3 est inchangé (dernier cours intégré : 19/09 ; prochain : 26/09).
- La fiche [[L2-catalogue-services]] conçoit la brique 3 (couche `Domain/`, moteur de tarification) avec des notions de POO **pas encore enseignées** : classe abstraite, interfaces écrites soi-même, polymorphisme, composition, motifs Stratégie et Prototype (`clone`/`__clone()`), montants en décimal exact. Introductions ajoutées dans `docs/academique/` (section « Conception objet du projet » du MOC).
- **Verdict pour la règle de porte** : 🟡 — la brique 3 reste ✅ pour les classes simples (encapsulation, héritage, interface `Iterator` vus) ; les parties qui reposent sur `abstract`, le clonage profond et le stockage d'une composition polymorphe en base (MySQL ⛔) sont **à re-vérifier** contre le cours avant implémentation. La décision revient à mentalyas.

### 2026-10-11 — intégration du cours du 10/10
- **Séance 5 intégrée** : notes [[IExhibitable et TExhibitable — Exposer l'état sérialisable d'un objet]] et [[Premier JavaScript du framework — jQuery, data-path-to-root et application.js]] ; glossaires de sérialisation et de JavaScript/jQuery. Matériel : `Suivit_Cours/pid.20261010/_htdocs/`.
- **Règle de porte** : brique 11 (AJAX + jQuery) reste ⛔ — seuls jQuery chargé et `ready` sont vus, ni AJAX ni DOM. Brique 6 (état/session) reste 🟡 : la sérialisation d'objets est vue, pas l'authentification.
- **Dans le code du prof, à surveiller** : plusieurs méthodes de `CApplication` ajoutées le 10/10 (`ToUtf8_R`, `GetMemberNamesFrom`) semblent inachevées ; elles ne sont pas exercées par le matériel. Ne rien bâtir dessus avant le prochain cours.

### 2026-11-11 — intégration des cours du 17/10 et du 07/11
- **Séances 6 et 7 intégrées** (code seul, aucune note `.txt`) : notes [[Commandes AJAX du framework — ExecuteCommand et TreatCommand]], [[Classes JS du framework — singleton, DefineAppClass et initialiseurs]], [[Mode DEV et PROD — fichiers marqueurs et commandes de debug]], [[Schéma PID — tables Role et Utilisateur et fonctions stockées]], pont [[Hachage du mot de passe — SHA-512 du prof ↔ bcrypt du projet]] ; glossaires AJAX/JSON et MySQL. Matériel : `Suivit_Cours/pid.20261017/`, `pid.v1.20261107/`, `pid.v2.20261107/` (v2 = référence).
- **Règle de porte** : brique 11 ⛔ → 🟡 (échange AJAX vu, DOM/événements non) ; brique 8 ⛔ → 🟡 (schéma vu, PDO non). Les briques 9 et 10 restent ⛔ : seules les tables existent.
- **Écart projet ↔ cours à trancher** (mentalyas) : US-AUTH-01 (21/10, hors rythme) utilise bcrypt et l'email comme identifiant ; le prof utilise SHA-512 salé en SQL, un `Login` et une table `Role`.
- **Dans le code du prof, à surveiller** : `ResponseError` appelé sans `$this->` (07/11) ; `typeof(...) == undefined` dans les initialiseurs JS ; pas de vérification qu'une commande `Command_*` existe ; casse `Role`/`role` dans le SQL ; `.class.register.php` pointe encore vers `dir1/dir2/Personne.php`, supprimé en v2.
