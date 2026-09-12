---
type: MOC
subject: PID — Framework maison codé en direct par le prof (29/08, 05/09, 12/09)
tags: [#MOC, #PID, #PHP, #POO, #autoloading]
date: 2026-09-12
---

# PID — Map of Content

> **En résumé** : chaque samedi, le prof code en direct un mini-framework PHP maison qui sert de "squelette" pédagogique. Il tient en 2 idées : (1) **se retrouver** dans l'arborescence peu importe où on est (bootstrap + `PID_PathTo`/`PID_Include`), et (2) **charger les classes tout seul** sans liste de `require` (autoloader + cache, durci le 12/09). `CPersonne`/`CPersonne2`/`CAutre` sont les cobayes qui prouvent que ça marche. Ce contenu est distinct du projet Laravel personnel de mentalyas — c'est le mécanisme brut que Laravel automatise en coulisses.
>
> Réseau visuel → [[PID — Reseau.canvas]]

```mermaid
flowchart TD
    subgraph "29/08 — Squelette pre-autoloader"
        S0["index.php partout<br/>+ redirection vers index.content.php<br/>(pas encore de PID_PathTo/Include)"]
    end
    subgraph "05/09 — Ajout du framework"
        B["1. Bootstrap<br/>trouver la racine du site"]
        U["2. PID_PathTo / Include / IncludeOnce<br/>adresser un fichier depuis la racine"]
        A["3. Autoloading<br/>spl_autoload_register + cache"]
        P["4. Classes d'exercice<br/>CPersonne / CPersonne2 / CAutre"]
        B --> U --> A --> P
    end
    subgraph "12/09 — Fiabilisation"
        R["5. Boucle de retry<br/>class_exists + eval apres include"]
    end
    S0 -.evolue vers.-> B
    A --> R
```

---

## Concepts fondamentaux
*À maîtriser en premier — le "où suis-je et comment je m'y retrouve"*
- [[Bootstrap PID — Detection de la Racine du Site]] — trouve `.pid.config.php` en remontant les dossiers, fige `PID_PATH_TO_ROOT`
- [[PID_PathTo, PID_Include et PID_IncludeOnce]] — traduit un chemin "depuis la racine" en chemin réel, remplace `include` natif

## Concepts intermédiaires
*Nécessitent les fondamentaux — le "comment les classes se chargent toutes seules"*
- [[Autoloading PID — spl_autoload_register et le Cache]] — charge une classe inconnue à la demande, cache le résultat dans `.class.register.php`
- [[Structure POO — CPersonne, CPersonne2 et CAutre]] — les classes d'exercice concrètes que l'autoloader charge (encapsulation, accesseurs validants)

## Concepts avancés
*Raffinement observé dans l'évolution du cours*
- [[Evolution de l'Autoloader — Boucle de Retry (0509 vers 1209)]] — le 12/09, ajout d'une vérification `class_exists`/`eval` après include + un retry, pour ne plus faire confiance aveuglément au cache

## Ordre d'apprentissage recommandé
1. [[Bootstrap PID — Detection de la Racine du Site]] — comprendre comment le framework se repère
2. [[PID_PathTo, PID_Include et PID_IncludeOnce]] — comprendre comment il adresse et charge un fichier
3. [[Structure POO — CPersonne, CPersonne2 et CAutre]] — voir des classes PHP simples à charger
4. [[Autoloading PID — spl_autoload_register et le Cache]] — comprendre comment ces classes sont chargées automatiquement
5. [[Evolution de l'Autoloader — Boucle de Retry (0509 vers 1209)]] — voir comment le mécanisme a été durci une semaine plus tard

## Questions de révision globale
> **Q :** Si tu devais résumer en 2 phrases ce que fait ce framework maison au professeur d'examen, que dirais-tu ?
> **R :** Il fournit un système d'adressage de fichiers indépendant du répertoire courant (bootstrap + `PID_PathTo`/`Include`), et un autoloader de classes qui évite d'écrire des `require` manuels, avec un cache de correspondance nom→fichier qui se fiabilise lui-même (vérification `class_exists` + retry ajoutés au fil des séances).

> **Q :** Pourquoi la connexion Bootstrap → PID_PathTo → Autoloading → Retry forme-t-elle une chaîne de dépendance stricte, et pas un ensemble de briques indépendantes ?
> **R :** Chaque brique a besoin de la précédente pour fonctionner : `PID_PathTo` a besoin de `PID_PATH_TO_ROOT` (Bootstrap) pour calculer un chemin ; l'autoloader a besoin de `PID_Include`/`PID_PathTo` pour charger et localiser le cache ; la boucle de retry n'a de sens que parce qu'un autoloader (avec son cache faillible) existe déjà à corriger.

> **Q :** En quoi ce cours "brut" éclaire-t-il ce que fait Laravel automatiquement dans le projet personnel de mentalyas (site photographe) ?
> **R :** Laravel a son propre autoloader (via Composer/PSR-4) et son propre système de résolution de chemins (`base_path()`, helpers de routes) — ce que le prof code à la main ici (bootstrap de racine, cache classe→fichier, autoloader avec fallback) est exactement ce que ces outils font pour nous, en plus robuste et standardisé. Comprendre le mécanisme brut permet de répondre aux questions d'examen sur "traitement PHP" et "sécurité PHP" même quand le projet final s'appuie sur un framework.

## Ressources complémentaires
- `docs/FOUNDATION.md` (§5, pont pédagogique explicite entre le cours et le projet Laravel)
- `Suivit_Cours/Synthèse/plan_du_cours.20260824 (1).txt` — objectifs du squelette sécurisé visé par le cours
- `Suivit_Cours/Synthèse/modalites_examen.20260824 (2).txt` — grille de cotation (traitement PHP /20, sécurité PHP /20, framework/généricité /20)
- Code source de référence : `Suivit_Cours/05_09_2026/pid.20260905/_htdocs/` (version de base) et `Suivit_Cours/12_09_2026/pid_avant_cours.20260912/_htdocs/` (version durcie)
