# Rythme du cours — ce qui est vu, ce que le projet suppose

> **Règle (mentalyas, 2026-09-21) :** le projet avance au même rythme que le cours, jamais devant.
> **Date de l'état des lieux :** 2026-09-21 — après le cours du 19/09.
> **Fiabilité :** « vu » = présent dans le matériel publié (`Suivit_Cours/pid.aaaammjj/`) et les notes de `docs/academique/`. Ce que le prof a pu dire à l'oral sans laisser de trace **n'est pas compté** — à corriger par mentalyas si besoin.

---

## 1. Ce que le cours a couvert (4 séances)

| Séance | Notion enseignée | Note de cours |
|--------|------------------|---------------|
| 29/08 | Racine du site, `index.php` par dossier, marqueur de racine, chemin « montant », configuration du framework, aide au développeur | (texte du cours) |
| 05/09 | Bootstrap, `PID_PathTo`/`PID_Include`, autoloader + cache, premières classes (`CPersonne`) | [[Bootstrap PID — Detection de la Racine du Site]] · [[Autoloading PID — spl_autoload_register et le Cache]] |
| 12/09 | Autoloader durci (retry), `CApplication` singleton en session, charset, `CPage` squelette | [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] |
| 19/09 | Dossier `.pid/`, `CPage` complète (hooks, `IntoHtml`), trait + collection CSS/JS | [[CPage — Générer une page HTML (WriteDocument et points d'extension)]] |

## 2. Ce que le cours **vise** (plan du 24/08) et où on en est

| Objectif du plan de cours | État |
|---------------------------|------|
| Programmation orientée objet | 🟡 en cours (classes, héritage, singleton, trait, interface `Iterator`) |
| Outils : PHP | 🟡 en cours (base du framework) |
| Outils : HTML5 / CSS3 | ⚪ pas de séance dédiée (acquis préalable) |
| Outils : MySQL | 🔴 pas encore abordé |
| Outils : JavaScript + jQuery | 🔴 pas encore abordé |
| Communication AJAX | 🔴 pas encore abordée |
| Synchronisation d'objets client/serveur | 🔴 pas encore abordée |
| Comptes de types différents (admin, gérant, client…) | 🔴 pas encore abordé |
| Création / modification de compte, gestion des comptes par l'admin | 🔴 pas encore abordé |
| Sécurité des données des comptes (y compris en base) | 🔴 pas encore abordée |
| Accès restreints (menu filtré, rejet des pages sans droit) | 🔴 pas encore abordé |
| Sécurité par email, oubli de login/mot de passe | 🔴 pas encore abordé |
| Protection contre la force brute, états de compte | 🔴 pas encore abordé |

**Lecture :** 4 séances sur les fondations du framework ; **tout le cœur « comptes/sécurité/base de données/AJAX » reste devant nous.** Or la Phase 1 du pipeline est déjà écrite pour l'ensemble.

## 3. Ce que la Phase 1 suppose, brique par brique

Légende : ✅ débloqué (notion vue) · 🟡 partiel · ⛔ à attendre le cours · ➕ hors cours (spécifique au sujet, autorisé par le plan : « contenu intéressant… ce qui n'aura pas été réalisé dans le cadre du squelette »).

| # | Brique du projet (source) | Notion de cours requise | Verdict | Pont « Laravel ↔ cours » |
|---|---------------------------|-------------------------|---------|--------------------------|
| 1 | Squelette Laravel, routes web, config (ARCHITECTURE §1) | Racine du site, configuration, chargement | ✅ | `.pid.config.php` ↔ `.env`/`config/` ; `PID_PATH_TO_ROOT` ↔ `base_path()` |
| 2 | Chargement des classes (Composer) | Autoloader (05/09, 12/09) | ✅ | `spl_autoload_register` + cache ↔ `vendor/autoload.php` (PSR-4) |
| 3 | Couche `Domain/` pure : `TarificationCalculator`, `DistanceCalculator`, `StatutDevisStateMachine`, `VerrouillageCompteRules` (§3.1) | POO : classes, encapsulation, accesseurs validants | ✅ | Même style que `CPersonne`/`CMonApp` — du PHP pur, sans framework |
| 4 | Vues et layouts (UI-DESIGN, tokens) | `CPage` : contenu, hooks, héritage (19/09) | ✅ | `WriteHead`/`WriteBody` ↔ `@yield`/`@section` Blade ; `IntoHtml` ↔ `{{ }}` |
| 5 | Vitrine / portfolio (US-VITRINE-01→03) | HTML5/CSS3 (5 pts, acquis) | ✅ | — |
| 6 | État applicatif / session | `CApplication`, `$_SESSION` (12/09) | 🟡 | Singleton en session ↔ service container + session Laravel |
| 7 | Échappement XSS | `IntoHtml`/`IntoAttr` (19/09) | 🟡 | XSS vu ; CSRF, injection SQL, hachage **pas** vus |
| 8 | Schéma de base, migrations, Eloquent (ARCHITECTURE §2, 8 tables) | MySQL/PDO, requêtes paramétrées | ⛔ | **20 pts d'examen** (BDD 10 + SQL 10) |
| 9 | Authentification Fortify : inscription, login, reset, vérification email, force brute, états de compte (US-AUTH-01→06) | Cœur du plan de cours | ⛔ | Fortify masque le mécanisme ; l'oral exige de l'expliquer |
| 10 | Rôles, Policies, menu filtré (US-ADMIN, §3.2) | Comptes de types différents, accès restreints | ⛔ | Policies ↔ contrôle d'accès maison à enseigner |
| 11 | AJAX + jQuery : tunnel de devis, endpoints `/ajax/`, autocomplétion (29 endpoints) | JS/jQuery (15 pts) + AJAX (15 pts) | ⛔ | **30 pts d'examen** |
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

## 6. Questions ouvertes (à confirmer par mentalyas)

- [ ] L'état « vu / pas vu » du §2 correspond-il à ce que le prof a réellement dit en classe (notamment sur MySQL, sessions et comptes) ?
- [ ] Combien de séances restent, et à quelle date est l'examen ? Sans calendrier, impossible de dire si le séquencement 2a→2e tient dans les délais.
- [ ] Faut-il rejouer la Phase 1 (Fortify, dompdf, `/ajax/`) pour l'aligner sur ce que le prof enseignera (auth maison, PDO), ou la conserver comme cible de fin de projet avec les ponts pédagogiques du FOUNDATION §5 ?
