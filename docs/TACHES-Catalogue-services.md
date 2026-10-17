# Tâches — Catalogue de services paramétrable

> Source : `docs/brainstorm/L2-catalogue-services.md` (§10 critères, §11 points ouverts, §12 impact, §13 Niveau 3).
> Branche B — Projet perso. Règle de porte : les tâches d'implémentation suivent `RYTHME-COURS.md` (stockage en base ⛔ jusqu'au cours MySQL).
> Le moteur de tarification en PHP pur et ses tests unitaires sont la tâche T024 de `TASKS.md` (étape 2a) : pas recopiés ici.
> Légende : `[x]` fait · `[~]` en cours · `[ ]` à faire.

## Lot 1 — Points ouverts du brainstorm (§11)

- [ ] T001 Choisir les modèles fournis au démarrage (proposition : Mariage complet, Portrait studio, Photo d'identité, Événement standard 250 € / 2 h)
- [ ] T002 Confirmer que les informations client qui influencent le prix (ex. 20 €/personne au-delà de 4) restent en v2
- [ ] T003 Choisir l'instance OSRM (publique ou auto-hébergée) et la mise en cache des distances

## Lot 2 — Niveau 3 du catalogue (§13)

- [ ] T004 Rédiger `docs/brainstorm/L3-catalogue-services.md` : schéma relationnel des modules (composition polymorphe en MySQL), format de l'instantané tarifaire, contrat OSRM et cache, algorithme de calcul pas à pas, endpoints de gestion du catalogue

## Lot 3 — Réaligner les documents existants (§12)

- [ ] T005 `L2-generateur-devis.md` : choix d'un service du catalogue, événements réels au lieu des segments, formule de prix remplacée, étapes conditionnelles selon les modules
- [ ] T006 `L3-generateur-devis.md` : remplacer les tables `types_prestation` et `parametres_tarifaires` par le schéma du catalogue
- [ ] T007 `L2-devis-contrat.md` et `L3-devis-contrat.md` : appuyer le document contrat sur l'instantané tarifaire
- [ ] T008 `L4-parcours.md` : ajouter les écrans Photographe (liste des services, éditeur à modules, modèles, paramètres généraux, simulation)
- [ ] T009 `USER-STORIES.md`, `ARCHITECTURE.md`, `API-ENDPOINTS.md`, `UI-DESIGN.md` : réaligner sur le catalogue

## Lot 4 — Critères d'acceptation à livrer (§10)

- [ ] T010 Le Photographe crée un service simple (nom, description, prix) en moins d'une minute, et le publie
- [ ] T011 Le Photographe crée un service avancé en activant des modules, sans aucune modification de code
- [ ] T012 Un service créé depuis un modèle ou par duplication est indépendant : modifier la source ne le change pas
- [ ] T013 Le générateur n'affiche au client que les étapes des modules actifs du service choisi
- [ ] T014 R1 : 12h00 → 15h30 sur un événement « 250 € / 2 h / 60 €/h » donne 340 € ; 2 h 10 → 30 min facturées ; 1 h → 250 €
- [ ] T015 R2 : le détail liste chaque trajet, le total, les km inclus et les km facturés ; l'adresse de départ n'apparaît jamais
- [ ] T016 R2 : OSRM indisponible → le devis reste composable avec une distance marquée « estimation »
- [ ] T017 Modifier le prix d'un service après la validation d'un devis ne change pas ce devis
- [ ] T018 Un service utilisé dans un devis ne peut pas être supprimé, seulement archivé
- [ ] T019 Un Administrateur ou un Client ne peut ni lire ni modifier l'écran de gestion du catalogue (403)
