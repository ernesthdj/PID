# Palette Sémantique — PID
> Rédigé par : UI/UX Designer (Agent #3) — Pipeline IT, révisé le 2026-09-12 après réconciliation manuelle avec le design Claude Design existant
> Date : 2026-09-12
> Statut : tokens de marque (§1-2) **récupérés du design réel** "Ernest H Photography.dc.html" (direction "5a", validée par mentalyas dans une session antérieure — projet PortfolioPhotographe) — remplacent les teintes inventées par l'agent, qui n'y avait pas accès au moment de la rédaction initiale. Couleurs sémantiques (§3) conservées de l'agent (fonctionnelles, non liées à la marque) mais **contrastes à revérifier par script** contre le nouveau fond `#EFE7D8` (l'agent avait validé contre `#FAFAF8`, un ton plus clair — non fait ici faute d'outil de calcul sous la main, ne pas prendre les ratios de §3 comme acquis tant que non rejoué).
> Portée : palette **light mode uniquement**. Voir §4 pour la justification (dark mode hors scope MVP, YAGNI).

---

## 0. Identité visuelle réelle (récupérée du design existant)

Source : `Design/Ernest H. Photography site planning/Ernest H Photography.dc.html` (direction finale "5a" + variantes mobile "6a"/galerie "7a"), à l'origine dessiné pour le projet `PortfolioPhotographe` (Next.js/Tailwind) — **la palette/typo/motifs sont réutilisables tels quels indépendamment de la stack** (portage vers Blade/CSS pour PID). Brief d'origine (`uploads/PROMPT_DESIGN.md`) : photojournalisme de mariage, lumière naturelle, "structure épurée et éditoriale + moments cinématiques ponctuels", palette dérivée de photos réelles (golden hour, tons chauds désaturés).

**Typographie** :
- Display serif (titres, accroches, citations) : **Cormorant Garamond** (400-600, italique pour les accroches/témoignages) — via Google Fonts
- Corps de texte / UI fonctionnelle : **Manrope** (400-700)
- Accent technique (labels "Nº0XX", métadonnées EXIF-style, cadran horaire) : monospace système (`ui-monospace, Menlo, monospace`), toujours en petites capitales avec `letter-spacing` large (0.08-0.15em)

**Motifs récurrents à reprendre pour PID** (cf. §6 de `UI-DESIGN.md` pour leur application) :
- Cadran circulaire (photo hero encadrée dans un cercle avec graduations horaires 00H/06H/12H/18H et léger dégradé conique doré) — motif "objectif d'appareil photo"
- Coins d'angle façon viseur de caméra (traits en L aux 4 coins des grandes sections)
- Bande dégradée bronze→or→bronze pour les sections de mise en valeur ("le fil d'une journée")
- Prix affichés en **cercles concentriques** plutôt qu'en cartes rectangulaires (le cercle central/le plus grand = l'offre mise en avant)
- Labels de section numérotés "Nº00X" en monospace, couleur accent

## 1. Tokens neutres (fond, texte, bordures)

| Token | Hex | Usage | Source |
|---|---|---|---|
| `--color-bg` | `#EFE7D8` | Fond de page (crème/sable — **valeur réelle de la marque**, remplace le `#FAFAF8` inventé par l'agent) | Design réel |
| `--color-surface` | `#FFFFFF` | Cartes, panneaux, modales, champs de formulaire (le mockup marketing ne montre pas de "cartes" au sens app — surface UI ajoutée pour les écrans applicatifs, non présente dans le mockup) | Agent (conservé) |
| `--color-border` | `#E2E0DB` | Séparateurs, bordures de champs au repos | Agent (conservé, cohérent avec le nouveau bg) |
| `--color-text-primary` | `#2B2521` | Texte principal, titres, labels de formulaire (**valeur réelle**, remplace `#201F1D`) | Design réel |
| `--color-text-secondary` | `#5C5850` | Texte secondaire, descriptions, hints | Agent (conservé) |
| `--color-text-muted` | `#86807A` | Métadonnées peu importantes | Agent (conservé) — ⚠️ réservé au texte large (≥18px/14px gras), règle inchangée |
| `--color-ink-dark` | `#1C1712` | Fond des sections "inversées" (bandeau CTA sombre, footer sombre, variante mosaïque) | Design réel — nouveau, absent chez l'agent |
| `--color-cream-text` | `#F4EEE4` | Texte clair sur `--color-ink-dark` | Design réel — nouveau |

## 2. Couleur de marque (accent)

**Deux accents réels** (le design existant en utilise deux, pas un seul comme l'agent l'avait supposé) :

| Token | Hex | Usage | Source |
|---|---|---|---|
| `--color-accent` | `#8A5A2F` | CTA principal (boutons), liens actifs, étape courante du stepper — bronze/brun | Design réel (quasi identique au `#8A5A3E` deviné par l'agent — convergence, bon signe) |
| `--color-accent-dark` | `#6E4522` | Hover/active des boutons accent, titres de section CMS Photographe | Design réel (hover du lien dans le mockup) |
| `--color-accent-gold` | `#C9A46B` | Accent secondaire "or/argentique" — cercle de prix mis en avant, graduations du cadran, labels Nº0XX | Design réel — nouveau, absent chez l'agent, **à ne pas confondre avec `--color-accent`** (deux rôles distincts : bronze = action, or = ornemental/mise en valeur) |
| `--color-accent-tint` | `#F4EDE7` | Fond de callout/bandeau informatif ("valeurs par défaut", "devis en cours conservé") | Agent (conservé, cohérent avec les nouveaux tokens) |

## 3. Couleurs sémantiques (statuts)

Réutilisées de façon cohérente pour **deux familles de statuts** : `devis.statut` et `users.statut_compte` (voir mapping §3.3) — Gestalt similarité : même couleur = même signification partout dans l'app.

| Rôle sémantique | Token texte/icône | Hex | Contraste sur blanc | Token fond (badge/bandeau) | Hex | Contraste texte dessus |
|---|---|---|---|---|---|---|
| **Succès / positif** | `--color-success` | `#1E7A4C` | **5.33:1** | `--color-success-tint` | `#EAF6EE` | **4.80:1** |
| **Attention / en attente** | `--color-warning` | `#9A6400` | **5.00:1** | `--color-warning-tint` | `#FFF6E5` | texte `--color-warning-dark` `#7A4D00` = **6.77:1** |
| **Erreur / danger / bloqué** | `--color-danger` | `#B4232B` | **6.53:1** | `--color-danger-tint` | `#FBEAEA` | **5.62:1** |
| **Information / neutre actif** | `--color-info` | `#1B5FA8` | **6.46:1** | `--color-info-tint` | `#EAF2FB` | **5.72:1** |

> Règle d'usage : le texte sur fond `*-tint` utilise systématiquement la variante **`-dark`/pleine** de la couleur (jamais la couleur "pastel" en avant-plan) pour rester ≥ 4.5:1. Les badges combinent toujours icône + texte + couleur (jamais la couleur seule — accessibilité daltonisme, cf. Nielsen heuristique 1 "visibilité de l'état").

### 3.1 Boutons — paires garanties AA

| Bouton | Fond | Texte | Contraste |
|---|---|---|---|
| Primaire | `--color-accent` | `#FFFFFF` | 5.81:1 |
| Primaire (hover/actif) | `--color-accent-dark` | `#FFFFFF` | 8.79:1 |
| Secondaire (outline) | `--color-surface` | `--color-accent-dark` + bordure `--color-accent` | 8.79:1 |
| Destructif (blocage compte, suppression média) | `--color-danger` | `#FFFFFF` | 6.53:1 |
| Désactivé (traitement en cours) | `--color-border` | `--color-text-muted` | non-actionnable, pas de contrainte AA (pas de contenu critique) |

### 3.2 États de formulaire

| État | Bordure champ | Texte d'aide | Icône |
|---|---|---|---|
| Focus | `--color-accent` (2px) | `--color-text-secondary` | — |
| Erreur | `--color-danger` (2px) | `--color-danger` (message inline sous le champ, jamais couleur seule — texte explicite) | ⚠ |
| Succès (validation live, ex. email disponible) | `--color-success` (2px) | `--color-success` | ✓ |

### 3.3 Mapping statuts métier → sémantique

| Valeur | Sémantique | Badge |
|---|---|---|
| `devis.statut = en_attente` | Attention | 🟡 badge `--color-warning` |
| `devis.statut = confirme` | Information | 🔵 badge `--color-info` |
| `devis.statut = realise` | Succès (terminal) | 🟢 badge `--color-success` |
| `devis.statut = annule` | Danger | 🔴 badge `--color-danger` |
| `users.statut_compte = en_attente_verification` | Attention | 🟡 badge `--color-warning` |
| `users.statut_compte = actif` | Succès | 🟢 badge `--color-success` |
| `users.statut_compte = bloque` | Danger | 🔴 badge `--color-danger` |
| `users.statut_compte = desactive` | Neutre | ⚪ badge `--color-text-muted` sur `--color-border` (pas de connotation succès/échec — état volontaire) |

## 4. Dark mode — décision : hors scope MVP

**Décision (Selfdoubt ⚠️ Probable)** : pas de variante `[data-theme="dark"]` livrée pour ce MVP. Ni le FOUNDATION, ni les 25 User Stories, ni aucun point de friction §11.4 ne mentionnent un besoin dark mode ; le référentiel Frontend global (`~/.claude/frontend-workflow.md`) le prévoit par défaut pour une stack React/Tailwind, ce qui **n'est pas la stack de ce projet** (Blade + jQuery, confirmé par l'Architecte). Ajouter un thème sombre non demandé serait une sur-ingénierie (YAGNI, Constitution Principe V) pour un projet solo à échéance d'examen. **Action si contredit** : si mentalyas le souhaite malgré tout, les tokens ci-dessus sont déjà structurés en variables nommées sémantiquement (pas de hex en dur attendu dans le CSS final) — l'ajout d'un bloc `[data-theme="dark"]` réutiliserait la même structure sans refonte.

## 5. Méthode de validation

Ratios calculés avec la formule WCAG 2.1 standard (luminance relative sRGB → ratio `(L1+0.05)/(L2+0.05)`), via un script Node.js exécuté localement (pas d'estimation à l'œil). Seuils appliqués : **4.5:1** texte normal, **3:1** texte large (≥ 18px ou ≥ 14px gras) et éléments d'interface non textuels significatifs (bordures de focus, icônes porteuses de sens). Tous les tokens texte listés ci-dessus respectent AA ; `--color-text-muted` est explicitement restreint aux usages "texte large" par la règle indiquée en §1.
