# ADR-004 — PID tourne en local uniquement ; la mise en ligne se fera avec PortfolioPhotographe

> Statut : acceptée · Date : 2026-11-11 · Document : 02-TRD §2, §5

## Contexte
PID est l'implémentation de référence du moteur, défendue au cours. Le produit public est PortfolioPhotographe (Next.js, Supabase, Vercel), qui recevra le moteur traduit en TypeScript. Des montages gratuits de mise en ligne de PID ont été étudiés le 11/11.

## Décision
PID n'est pas mis en ligne. Il tourne sur le poste de mentalyas pour le développement et la défense. La mise en ligne est traitée plus tard, dans PortfolioPhotographe (décision de mentalyas, 11/11).

## Raisons
- Vercel n'exécute pas PHP nativement (conteneur FrankenPHP ou runtime communautaire), sans disque persistant pour les PDF.
- Les montages gratuits ont chacun une limite forte : base PostgreSQL au lieu de MySQL (Supabase), mise en pause après 7 jours d'inactivité, hébergeurs PHP gratuits sans SSH.
- Le produit final vit dans PortfolioPhotographe, où Vercel + Supabase sont natifs.

## Options écartées
| Option | Pourquoi écartée |
|--------|------------------|
| Vercel + Supabase | Laravel non natif sur Vercel ; PostgreSQL en ligne contre MySQL en local |
| Vercel + TiDB Cloud + Vercel Blob | Trois services à configurer pour une démo de cours |
| alwaysdata gratuit | Pas de SSH dans l'offre gratuite ; stockage limité |
| InfinityFree / cPanel gratuit | Ni Composer ni Artisan |

## Conséquences
- Pas de CI/CD ni d'environnement de production dans le TRD.
- La défense se fait sur le poste local.
- Le moteur reste indépendant de MySQL (TRD §6, P06) pour que la future base Supabase (PostgreSQL) de PortfolioPhotographe reprenne le même schéma.

## Vérification d'incertitude
- ✅ Vérifié : Aiven arrête son MySQL gratuit (21/12/2026), PlanetScale n'a plus d'offre gratuite.
- 🟡 Probable : offre gratuite Supabase = 500 Mo, 1 Go de fichiers, pause après 7 jours (sources secondaires concordantes).
- Sans incidence sur PID local : ces points serviront pour PortfolioPhotographe.
