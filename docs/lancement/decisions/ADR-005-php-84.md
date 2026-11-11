# ADR-005 — PHP 8.4 pour tout le projet

> Statut : acceptée · Date : 2026-11-11 · Document : 02-TRD §2

## Contexte
Le poste local a PHP 8.0.30 (XAMPP). Laravel 13 exige PHP 8.3 minimum. Le code du prof (`src/prof/`) utilise `new CettePage()->WriteDocument()`, une syntaxe acceptée seulement à partir de PHP 8.4.

## Décision
Le projet cible PHP 8.4.x (`"php": "^8.4"` dans `composer.json`).

## Raisons
- Fait tourner à la fois Laravel 13 et le code du prof sans retouche.
- Supporté par Laravel 13 (PHP 8.3 à 8.5).
- `enum` et propriétés `readonly` rendent le moteur plus sûr (étapes du dossier, modes de prix, lignes immuables).

## Options écartées
| Option | Pourquoi écartée |
|--------|------------------|
| PHP 8.3 | Le code du prof ne tourne pas sans ajouter des parenthèses |
| PHP 8.5 | Plus récent que nécessaire ; compatibilité des paquets moins éprouvée |
| Rester en 8.0 | Incompatible avec Laravel 13 |

## Conséquences
- L'environnement local doit être remplacé ou mis à jour (Q19).
- `tests/run.php` (lanceur maison, PHP 8.0) est remplacé par PHPUnit.

## Vérification d'incertitude
- ✅ Vérifié : PHP 8.0.30 installé (`php -v`) ; MariaDB 10.4.32 installé ; Laravel 13 exige PHP ≥ 8.3.
- ✅ Vérifié : la syntaxe `new X()->m()` sans parenthèses arrive avec PHP 8.4 (déjà notée dans la note de cours CPage).
