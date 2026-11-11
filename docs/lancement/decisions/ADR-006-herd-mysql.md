# ADR-006 — Environnement local : Laravel Herd (gratuit) + MySQL Community Server 8.4 LTS

> Statut : acceptée · Date : 2026-11-11 · Document : 02-TRD §2, §5

## Contexte
Le XAMPP installé fournit PHP 8.0.30 et MariaDB 10.4.32 (vérifié le 11/11), trop anciens pour Laravel 13 (PHP 8.3 minimum) et pour ADR-005 (PHP 8.4). PID tourne en local uniquement (ADR-004).

## Décision
- **Laravel Herd** pour Windows, offre gratuite : PHP 8.4, Composer, Node, npm, installateur Laravel, serveur web.
- **MySQL Community Server 8.4 LTS**, installé à part (la gestion de bases de Herd est réservée à Herd Pro).
- Bases : `pid` (développement) et `pid_test` (tests).

## Raisons
- Herd est conçu pour Laravel et a PHP 8.4 par défaut pour les nouvelles installations.
- MySQL 8.4 LTS est la version maintenue la plus longtemps et correspond au moteur du cours ; le script du prof (`IDENTIFIED WITH sha256_password`) est propre à MySQL, pas à MariaDB.
- Tout est gratuit.

## Options écartées
| Option | Pourquoi écartée |
|--------|------------------|
| Nouveau XAMPP | Disponibilité d'une version avec PHP 8.4 non vérifiée ; fournit MariaDB, pas MySQL |
| Docker (Laravel Sail) | Docker Desktop plus lourd à prendre en main |
| Herd Pro | Payant ; seule la gestion des bases manque dans l'offre gratuite |

## Conséquences
- XAMPP peut rester installé pour les exercices du cours, sur d'autres ports, ou être désactivé. Apache et MySQL de XAMPP ne doivent pas tourner en même temps que Herd et MySQL 8.4 (conflit sur les ports 80 et 3306).
- Le code du prof (`src/prof/`) tourne aussi sous Herd en PHP 8.4.

## Vérification d'incertitude
- ✅ Vérifié : XAMPP local = PHP 8.0.30, MariaDB 10.4.32.
- ✅ Vérifié (doc Herd et Laravel) : l'offre gratuite inclut PHP, Composer, Node et npm ; les bases MySQL/PostgreSQL relèvent de Herd Pro ; PHP 8.4 par défaut.
- 🟡 Probable : MySQL 8.4 LTS s'installe sans conflit à côté de Herd (installateur Windows officiel).
