# ADR-007 — Cloudinary (compte de PortfolioPhotographe, dossier `pid/`) pour les images de la vitrine

> Statut : acceptée · Date : 2026-11-11 · Document : 02-TRD §2, §4 (API02)

## Contexte
F12 gère les photos et galeries de la vitrine (R12.2). PID tourne en local (ADR-004). PortfolioPhotographe héberge déjà ses images chez Cloudinary.

## Décision
API02 = Cloudinary, SDK PHP officiel, envoi depuis le serveur. Même compte que PortfolioPhotographe, images de PID dans le dossier `pid/`. PID stocke en base l'identifiant Cloudinary, le texte alternatif et le recadrage, jamais le fichier.

## Raisons
- Redimensionnement et formats web automatiques, sans traitement d'image en PHP.
- Les deux projets peuvent réutiliser les mêmes photos.
- Offre gratuite suffisante pour une vitrine de photographe.

## Options écartées
| Option | Pourquoi écartée |
|--------|------------------|
| Disque local de PID | Redimensionnement à coder ; images non partagées avec PortfolioPhotographe |
| Compte Cloudinary dédié à PID | Deux comptes à surveiller, aucune image partagée |

## Conséquences
- Le quota gratuit (25 crédits par mois) est partagé avec PortfolioPhotographe.
- Supprimer une photo dans PID ne supprime pas une image utilisée par PortfolioPhotographe : PID ne supprime que les images de son dossier `pid/`.

## Vérification d'incertitude
- 🟡 Probable : offre gratuite de 25 crédits par mois et images de 10 Mo maximum (instantané de tarifs Cloudinary et guides concordants, 2026). À relire dans la console du compte.
- ❓ À fixer à l'installation : version du SDK `cloudinary/cloudinary_php`.
