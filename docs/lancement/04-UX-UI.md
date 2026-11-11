# Brief UX/UI — PID · Moteur du générateur de devis

> Statut : validé · Version : 1.0 · Validé le : 2026-11-11 · Lit : 01-PRD (v1.1), 03-APP-FLOW (v1.0)

## En bref
- **Couvre :** d'où viennent l'apparence et les composants des écrans de PID, et comment ils sont repris.
- **Décision majeure :** **sans objet dans PID**. La direction artistique est conçue et validée dans le projet PortfolioPhotographe. PID la reprend sans créer de choix visuel propre (décision de mentalyas, 11/11).
- **Ne couvre pas :** les valeurs exactes (couleurs, typographies, espacements). Elles vivent dans PortfolioPhotographe et ne sont pas recopiées ici, pour qu'il n'en existe qu'une source.
- **IDs définis ici :** aucun.

## 1. Source de vérité visuelle

| Élément | Emplacement dans PortfolioPhotographe |
|---------|---------------------------------------|
| Tokens (couleurs, polices, espacements) | `src/app/globals.css` (bloc `@theme` de Tailwind 4) |
| Composants du carnet et du dossier | `src/components/carnet/carnet.css`, `src/components/DossierBuilder.tsx`, `src/components/DevisForm.tsx` |
| Directions artistiques validées | `docs/front/da-morphic-design.md`, `docs/front/exposition-design.md`, `docs/front/premier-impact-design.md`, canvas `docs/front/canvas-da-morphic/` |
| Écrans d'administration | `src/app/admin/(protected)/*` |

## 2. Règles de reprise dans PID

| # | Règle | Raison |
|---|-------|--------|
| 1 | Les tokens de `globals.css` sont copiés dans `src/resources/css/app.css` de PID, sans modification | Une seule direction artistique pour les deux projets |
| 2 | Les composants React sont réécrits en vues Blade + jQuery, avec les mêmes classes Tailwind | ADR-001 |
| 3 | Un changement visuel se décide **d'abord** dans PortfolioPhotographe, puis se reporte dans PID | Pas de divergence entre les deux projets |
| 4 | Un écran de PID sans équivalent dans PortfolioPhotographe (ex. E12.a, E19, E21) reprend les composants existants les plus proches (formulaires et listes de l'administration) | Pas de nouveau style inventé dans PID |
| 5 | Accessibilité : WCAG AA, portée par les tokens de PortfolioPhotographe | PRD §7 |

## 3. Canvas Design
Sans objet dans PID : les canvas de direction artistique sont dans PortfolioPhotographe (`docs/front/canvas-da-morphic/`).

## Historique
| Version | Date | Changement |
|---------|------|------------|
| 1.0 | 2026-11-11 | Création : sans objet, renvoi vers PortfolioPhotographe ; validé par mentalyas |

## Demandes de modification
| Date | Source | Demande | Statut |
|------|--------|---------|--------|
