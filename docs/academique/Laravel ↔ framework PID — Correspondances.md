---
type: pont
subject: Laravel ↔ framework PID — ce que Laravel automatise de ce que le prof code à la main
source: pont
seances: [2026-08-29, 2026-09-05, 2026-09-12, 2026-09-19]
tags: [#pont, #Laravel, #PID, #framework]
date: 2026-09-21
niveau: intermédiaire
critere_examen: framework / généricité (20), traitement PHP (20), sécurité PHP (20)
statut: brouillon
---

# Laravel ↔ framework PID — correspondances

> **En 30 secondes** — Le projet personnel utilisera Laravel ; le cours construit à la main un mini-framework. Chaque brique du prof a un équivalent Laravel qui fait le même travail, en plus robuste. Pouvoir dire **quel mécanisme du cours se cache derrière quel outil Laravel** est ce qui permet de défendre le projet à l'oral.

> ⚠️ **Fiabilité** — `src/` est vide et Laravel n'est pas encore installé : cette note s'appuie sur `docs/ARCHITECTURE.md` et sur la connaissance générale de Laravel, **pas** sur du code du projet. Chaque ligne est marquée **⚠️ Probable** jusqu'à vérification pendant l'implémentation.

## 1. Vue Macro & Utilité
- **Problématique** : un site a besoin de retrouver ses fichiers, charger ses classes, garder un état, produire du HTML sûr. Le prof le fait à la main pour qu'on comprenne ; Laravel le fournit prêt à l'emploi.
- **Emplacement dans la carte globale** : transversal — de la configuration (racine, constantes) à la présentation (pages), en passant par le chargement de classes et la session.
- **Analogie (restauration)** : cuisiner **soi-même** chaque sauce (le cours) contre acheter un **fond de sauce professionnel** (Laravel). Pour défendre son plat devant un jury, il faut savoir refaire la sauce.

## 2. Le Pont Systémique (sous le capot)
Les deux approches exécutent **les mêmes opérations machine** : concaténer des chemins, lire des fichiers sur le disque, charger du code PHP à la demande, garder un état côté serveur, écrire des octets HTTP. Ce qui change, c'est **qui écrit ce code** et **quand il s'exécute** : le prof écrit chaque étape ; Laravel les prépare à l'avance (chargeur de classes optimisé, configuration en cache) et les exécute à **chaque requête** depuis un point d'entrée unique.

## 3. Correspondance

| Mécanisme du cours | Équivalent Laravel *(⚠️ Probable)* | Note du cours |
|--------------------|-------------------------------------|---------------|
| `.pid.config.php` (marqueur de racine + constantes) | Fichier `.env` + dossier `config/` ; racine du projet connue du framework | [[Bootstrap PID — Detection de la Racine du Site]] |
| `PID_PATH_TO_ROOT`, `PID_PathTo`, `PID_Include` | Helpers de chemins (`base_path()`, `public_path()`, `storage_path()`) et d'URL (`url()`, `route()`, `asset()`) | [[PID_PathTo, PID_Include et PID_IncludeOnce]] |
| `index.php` recopié dans chaque dossier + `updateIndexes` | **Un seul point d'entrée** (`public/index.php`) : le serveur y redirige toutes les requêtes ; aucune copie par dossier | [[Bootstrap PID — Detection de la Racine du Site]] |
| Autoloader + `.class.register.php` (cache) | Chargeur de classes de Composer (norme PSR-4 : le nom de classe **détermine** le chemin, pas d'exploration du disque) | [[Autoloading PID — spl_autoload_register et le Cache]] |
| `CApplication::Instance()` (singleton persisté en session) | Conteneur de services (`app()`) : objets partagés **reconstruits à chaque requête** — l'application n'est pas stockée en session | [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] |
| `CPage` + `WriteHead`/`WriteBody` (Template Method) | Vues Blade : gabarits (`@extends`, `@section`, `@yield`) | [[CPage — Générer une page HTML (WriteDocument et points d'extension)]] |
| `IntoHtml` / `IntoAttr` | `{{ }}` échappe automatiquement ; `{!! !!}` affiche **sans** échapper (à surveiller) | [[Glossaire — Échappement HTML et faille XSS]] |
| `TCssJsFiles` + `CFileCollection` | Empilement de styles/scripts dans les vues et outil de build des assets | [[TCssJsFiles et CFileCollection — Collections de fichiers CSS et JS]] |
| Dossier `.pid/` (framework séparé du site) | Dossier `vendor/` (framework) séparé de `app/` (code du projet) | [[Dossier .pid et préfixe étoile — Séparer le framework du site]] |

**Ce que l'outil cache** : l'exploration du disque, la reconstruction de l'état à chaque requête, l'échappement HTML — trois choses que le jury peut demander d'expliquer.
**Ce que l'outil fait mieux** : un seul point d'entrée (sécurité : pas de `index.php` à recopier), un chargement de classes déterministe et rapide, un échappement par défaut.

## 4. Synthèse & Prochaine Étape
**À retenir (3 puces max)**
- Chaque outil Laravel automatise un mécanisme déjà vu en cours.
- La grande différence de conception : **un point d'entrée unique** et **un état reconstruit à chaque requête**.
- À l'oral : partir du mécanisme du cours, puis dire ce que Laravel fait à la place.

**Question d'oral probable** — *« Pourquoi utiliser Laravel plutôt que votre propre autoloader ? »* → parce que le chargeur de Composer (PSR-4) déduit le fichier du nom de classe sans explorer le disque ni gérer de cache à la main ; mais on sait exactement ce qu'il remplace : la boucle de recherche + le registre `.class.register.php` vus en cours.

**Lien avec la suite** : cette table sera **complétée** au fil des séances (base de données, comptes, sécurité, AJAX) et **vérifiée** dès que Laravel sera installé dans `src/`.
