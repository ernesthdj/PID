<!--
Sync Impact Report
==================
Version change: [TEMPLATE] → 1.0.0 (initial ratification)
Modified principles: n/a (first concrete adoption — all [PRINCIPLE_N_*] placeholders replaced)
Added sections:
  - Core Principles: I. Sécurité par Conception (NON-NEGOTIABLE), II. Traçabilité Pédagogique,
    III. Intégrité du Devis=Contrat, IV. Isolation des Rôles & Moindre Privilège,
    V. Simplicité & Code Durable (YAGNI/DRY/KISS)
  - Contraintes Techniques & Pédagogiques (stack imposée par le cours + pont pédagogique)
  - Workflow de Développement (git, tests, revue, journal)
  - Governance (amendements, versioning, conformité)
Removed sections: none (placeholder scaffold only)
Deferred / TODO placeholders: none — RATIFICATION_DATE set to project constitution creation date
Templates requiring follow-up: none checked in this run (scope limited to constitution.md per
  command Scope Guard); downstream commands (/speckit-plan, /speckit-tasks, /speckit-analyze)
  read this file at runtime and need no edits here.
-->

# PID Constitution

## Core Principles

### I. Sécurité par Conception (NON-NEGOTIABLE)
Toute fonctionnalité touchant l'authentification, les données personnelles (emails,
adresses de prestation) ou l'argent (devis, prix) applique l'OWASP Top 10 sans exception :
requêtes paramétrées ou Eloquent (jamais de concaténation SQL), protection CSRF native
Laravel sur tout formulaire, échappement Blade systématique contre le XSS, hachage bcrypt
des mots de passe (jamais MD5/SHA1), rate limiting sur connexion/inscription/mot de passe
oublié, messages d'erreur génériques anti-énumération de comptes. Aucun secret
(`.env`, clés API de géocodage) n'est commité ; `APP_DEBUG=false` en production ; aucune
stack trace ni donnée sensible (mot de passe, token) dans les logs.
**Rationale** : le squelette sécurisé est à la fois une exigence de notation du cours
(critère Sécurité PHP /20) et une nécessité réelle — le site traite des données
personnelles de clients et sert de preuve en cas de litige commercial.

### II. Traçabilité Pédagogique
Chaque mécanisme automatisé par Laravel (hash de mot de passe, autoloading Composer,
ORM, CSRF) est documenté dans `docs/academique/` en le reliant explicitement au
mécanisme équivalent enseigné en cours (PDO, autoloader maison, POO). Cette
documentation est mise à jour au fil des séances, jamais reconstituée a posteriori avant
l'examen.
**Rationale** : l'examen oral (prévu le 30/01/2027) évalue la compréhension du
mécanisme brut sous-jacent, pas seulement l'usage du framework ; sans ce pont explicite
la défense orale échoue même si le code fonctionne.

### III. Intégrité du Devis=Contrat
Le prix d'un devis est **toujours** recalculé côté serveur à la validation — jamais fait
confiance à une valeur envoyée par le client. Une fois validé, le devis fige ses données
(`donnees_figees`) dans un snapshot JSON immuable ; le document généré n'est **jamais**
régénéré depuis les paramètres tarifaires courants, même si ceux-ci changent
ultérieurement. L'enregistrement d'un devis et de ses segments est une transaction
atomique unique (tout ou rien).
**Rationale** : le document sert de preuve en cas de litige sur ce qui a été convenu —
toute incohérence entre le prix affiché au client et le prix stocké, ou toute dérive du
document après coup, annule sa valeur probante.

### IV. Isolation des Rôles & Moindre Privilège
Les trois rôles (Client / Photographe / Administrateur) sont vérifiés **côté serveur**
sur chaque route sensible via Policies/Gates Laravel — jamais via un simple masquage
côté vue. Un Client n'accède qu'à ses propres devis (`client_id == user.id`), y compris
face à une manipulation directe d'URL. Chaque action d'administration (blocage,
déblocage, reset) est journalisée avec auteur et horodatage. Un Administrateur ne peut
pas se bloquer lui-même accidentellement.
**Rationale** : l'isolation des données clients est un critère d'acceptation explicite du
cahier des charges (section 9.4) et une exigence de confidentialité vis-à-vis de
personnes réelles (clients du photographe).

### V. Simplicité & Code Durable (YAGNI/DRY/KISS)
Le code respecte PSR-12, utilise l'eager loading Eloquent pour éviter les requêtes N+1,
valide les entrées via des Form Requests dédiées, et n'introduit aucune abstraction pour
un besoin hypothétique (paiement en ligne, multi-langue, etc. — explicitement hors
scope MVP). Chaque migration de schéma définit un `down()` fonctionnel. Pas de
`console.log`/`dd()` de debug ni de `// TODO` sans issue associée dans `docs/JOURNAL.md`.
**Rationale** : projet solo à livrer en ~4,5 mois en parallèle des cours — la dette
technique ou la sur-ingénierie compromettent directement le respect du délai d'examen.

## Contraintes Techniques & Pédagogiques

Stack imposée ou validée par le cours : Frontend HTML5/CSS3/JS+jQuery/AJAX (imposé),
Backend PHP + Laravel (autorisé explicitement par le professeur), MySQL (imposé), auth
Laravel natif (Breeze ou Fortify — choix à trancher en implémentation) enrichi d'une
logique de rôles maison. Toute vulnérabilité de la checklist sécurité du cahier des
charges (`docs/FOUNDATION.md` §7) doit être neutralisée avant qu'une fonctionnalité soit
considérée terminée. Le paiement reste hors plateforme (cash/Smart) — aucune logique de
facturation ou de paiement en ligne n'est implémentée au stade MVP.

## Workflow de Développement

Suivre le pipeline agents IT du workspace (`/pipeline`) phase par phase avec validation
mentalyas entre chaque étape ; ne jamais faire sauter une validation pour gagner du
temps. Tests écrits pour toute nouvelle logique métier (calcul de prix, calcul de
distance, transitions de statut de devis), couvrant les cas limites (échec de
géocodage, double inscription simultanée, seuil de brute-force) et pas seulement le
chemin nominal. `docs/JOURNAL.md` est alimenté après chaque modification de code
significative. Commits atomiques au format Conventional Commits ; aucun commit, push ou
PR sans confirmation explicite de mentalyas ; jamais de `--force` sur `master` ni de
bypass de hooks (`--no-verify`) sans demande explicite.

## Governance

Cette constitution prévaut sur toute pratique de développement contradictoire au sein du
projet PID. Toute modification (ajout, retrait ou reformulation d'un principe) requiert :
(1) une justification écrite dans le Sync Impact Report en tête de ce fichier, (2)
l'approbation explicite de mentalyas, (3) la mise à jour du numéro de version selon le
versioning sémantique — MAJOR pour un retrait ou une redéfinition incompatible d'un
principe existant, MINOR pour l'ajout d'un principe ou d'une section, PATCH pour une
clarification sans impact sémantique. Toute Pull Request ou revue de code vérifie la
conformité aux cinq principes ci-dessus ; une dérogation doit être justifiée
explicitement dans la description de la PR et validée par mentalyas avant fusion. Les
standards détaillés (TypeScript, C#, PHP/Laravel, SQL, sécurité OWASP) restent définis
dans `~/.claude/CLAUDE.md` (global) et s'appliquent par défaut à tout ce que cette
constitution ne couvre pas explicitement.

**Version** : 1.0.0 | **Ratifiée** : 2026-09-12 | **Dernier amendement** : 2026-09-12
