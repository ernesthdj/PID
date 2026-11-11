# ADR-008 — Les emails de PID sont capturés par Mailpit en local

> Statut : acceptée · Date : 2026-11-11 · Document : 02-TRD §2, §5

## Contexte
L'ERP envoie des emails : devis du prospect (UC08.1), activation de compte (UC08.4), notifications de messages (R08.8), rappels de paiement (UC10.5), livraison (UC09.3). PID tourne en local uniquement (ADR-004).

## Décision
Laravel Mail envoie en SMTP vers **Mailpit**, qui capture chaque email et l'affiche dans une page web locale. Aucun email ne quitte le poste.

## Raisons
- On voit chaque email exactement comme le client le recevrait, idéal pour la démo et les tests.
- Gratuit, aucun domaine ni clé d'API.
- L'envoi réel sera mis en place avec PortfolioPhotographe (Resend y est déjà).

## Options écartées
| Option | Pourquoi écartée |
|--------|------------------|
| Resend (envoi réel) | Domaine vérifié et clé d'API nécessaires, pour une application qui ne sera pas en ligne |
| Pilote `log` de Laravel | Aucun rendu visuel des emails |
| Visionneuse de mails de Herd Pro | Payante |

## Conséquences
- Les tests vérifient les emails avec le faux expéditeur de Laravel (`Mail::fake()`), sans Mailpit.
- Passer à un envoi réel = changer les variables `MAIL_*`, sans toucher au code.

## Vérification d'incertitude
- ✅ Vérifié : Resend est une dépendance de PortfolioPhotographe (`package.json`).
- 🟡 Probable : Mailpit tourne sous Windows à côté de Herd (exécutable unique).
