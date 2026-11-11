# ADR-002 — OpenRouteService pour le géocodage et la distance routière

> Statut : acceptée · Date : 2026-11-11 · Document : 02-TRD §4 (API01)

## Contexte
F04 exige de localiser chaque adresse du devis (R04.1) et de calculer une distance routière ou à vol d'oiseau (R04.6). La solution doit être gratuite.

## Décision
API01 = OpenRouteService (géocodage `/geocode/search` + distance `/v2/directions/driving-car`), clé dans `ORS_API_KEY`. Chaque résultat est mis en cache en base. La distance à vol d'oiseau (haversine) est calculée localement, sans API.

## Raisons
- Géocodage et itinéraire dans un seul service, une seule clé.
- Données OpenStreetMap ; offre gratuite avec quota journalier.
- Le cache limite la consommation : une adresse n'est géocodée qu'une fois.

## Options écartées
| Option | Pourquoi écartée |
|--------|------------------|
| Nominatim + OSRM publics | Deux services ; serveurs publics limités (1 requête/s pour Nominatim) et sans garantie |
| Google Maps Platform | Payant au-delà d'un crédit mensuel ; carte bancaire obligatoire |

## Conséquences
- Une passerelle `app/Infrastructure/Distance` isole l'API ; le moteur ne reçoit que des km.
- En cas de panne : repli R04.6 (`volOiseau` ou `bloquer`).
- Le Backend définit la table de cache des adresses et distances.

## Vérification d'incertitude
- ✅ Vérifié : endpoint directions limité par défaut à 2 000 requêtes par jour (FAQ officielle openrouteservice).
- ❓ À vérifier à la création du compte : quota du géocodage, conditions d'utilisation (Q18). La page des offres n'a pas pu être lue automatiquement.
