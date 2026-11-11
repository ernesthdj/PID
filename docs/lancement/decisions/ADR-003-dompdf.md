# ADR-003 — Dompdf (via `barryvdh/laravel-dompdf`) pour générer les PDF du dossier

> Statut : acceptée · Date : 2026-11-11 · Document : 02-TRD §2

## Contexte
F07 génère une version PDF du dossier à chaque changement (R07.6), avec le devis détaillé, les fiches, les coordonnées et l'historique (R07.4).

## Décision
`barryvdh/laravel-dompdf` 3.1.x (enveloppe Laravel de Dompdf), installé par Composer. Le gabarit du dossier est une vue Blade (HTML + CSS) convertie en PDF. Chaque version est enregistrée sous un nom unique, jamais écrasé.

## Raisons
- Le gabarit s'écrit comme une page web, avec les mêmes tokens que les vues.
- Bibliothèque PHP pure : aucun binaire externe à installer.
- Version 3.1.2 (21/02/2026) compatible PHP 8.1 à 8.5.

## Options écartées
| Option | Pourquoi écartée |
|--------|------------------|
| FPDF | Mise en page dessinée cellule par cellule en code |
| TCPDF | Volumineux ; HTML seulement partiel |
| Navigateur sans interface (Chrome headless) | Binaire externe à installer et à maintenir |

## Conséquences
- CSS limité à ce que Dompdf rend (pas de flexbox ni de grid complets) : le gabarit PDF utilise des tableaux et des blocs simples.
- Les PDF sont stockés dans `storage/app/dossiers/<dossier>/v<n>.pdf` (proposé, à fixer au Backend).

## Vérification d'incertitude
- ✅ Vérifié : laravel-dompdf v3.1.2 publié le 21/02/2026, compatible PHP 8.1-8.5 (laraplugins).
- ❓ À vérifier : la version 3.1.2 (21/02/2026) est antérieure à Laravel 13 (17/03/2026). Sa compatibilité se contrôle dans le `composer.json` du paquet à l'installation. Si elle est refusée, il faut une version plus récente de l'enveloppe, ou Dompdf seul.
