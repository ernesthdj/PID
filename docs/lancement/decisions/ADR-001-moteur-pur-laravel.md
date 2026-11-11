# ADR-001 — Le moteur est en PHP pur dans `app/Domain`, entouré de Laravel 13 avec des vues Blade + jQuery

> Statut : acceptée · Date : 2026-11-11 · Document : 02-TRD §1, §2
> ADR (Architecture Decision Record, fiche de décision).

## Contexte
- Le moteur (F01-F07) est implémenté dans PID, puis traduit en TypeScript dans PortfolioPhotographe (P06).
- Le cours note JS/jQuery (15 pts) et AJAX (15 pts) ; le prof montre jQuery + commandes AJAX (`TreatCommand`).
- Le front et la direction artistique viennent de PortfolioPhotographe (React/Next.js), à importer dans PID.
- Une inscription en PHP pur existe déjà (`src/app/Domain/Auth`, 21/10).

## Décision
1. Le moteur vit dans `app/Domain/Devis`, en PHP pur : aucune dépendance à Laravel ni à la base (R03.9).
2. Laravel 13 fournit HTTP, validation, Policies, migrations, Eloquent, CSRF.
3. Les vues sont en Blade ; l'interactivité du devis passe par jQuery 4.0.0 et des appels AJAX JSON. La direction artistique de PortfolioPhotographe (tokens, Tailwind, structure des pages) est réécrite en Blade.

## Raisons
- La traduction TypeScript ne porte que sur `app/Domain` ; le jeu de cas JSON (R03.10) prouve qu'elle est juste.
- Laravel est le choix de mentalyas (11/11) et la cible du projet depuis septembre.
- Blade + jQuery couvre exactement ce que le cours évalue.

## Options écartées
| Option | Pourquoi écartée |
|--------|------------------|
| Framework du prof autour du moteur | Choix de mentalyas : Laravel (11/11). Le code du prof reste la référence de cours dans `src/prof/` |
| PHP sans framework | Plus de code d'infrastructure à écrire, sans bénéfice pour le moteur |
| Inertia + React | Réutilise les composants React, mais presque aucun jQuery/AJAX visible : risque à l'examen |
| API Laravel + Next.js séparé | Deux applications ; le front ne serait plus dans PID |

## Conséquences
- Un test d'architecture vérifie qu'aucun fichier de `app/Domain` ne référence `Illuminate\` (TRD §3).
- Composer et PHP 8.3 minimum sont nécessaires (ADR-005 : PHP 8.4).
- L'écart avec le framework du prof est à expliquer à l'oral : note pont dans `docs/academique/`.

## Vérification d'incertitude
- ✅ Vérifié : Laravel 13 est sorti le 17/03/2026 et exige PHP 8.3 minimum (notes de version et Laravel News).
- 🟡 Probable : Tailwind 4 s'intègre à Laravel 13 via Vite sans configuration particulière (non testé ici).
- ❓ Hypothèse : la réécriture des vues React en Blade reste raisonnable en volume. Elle sera mesurée au Plan quand l'App Flow aura listé les écrans.
