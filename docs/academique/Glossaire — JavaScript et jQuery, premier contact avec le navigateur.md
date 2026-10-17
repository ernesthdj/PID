---
type: glossaire
subject: JavaScript, jQuery, attributs data-* — le code qui s'exécute dans le navigateur
tags: [#JavaScript, #jQuery, #glossaire, #web, #client]
date: 2026-10-11
niveau: débutant
---

# JavaScript et jQuery — premier contact avec le navigateur

> Jusqu'ici, tout le code du cours tournait **sur le serveur** : PHP prépare une page, l'envoie, et c'est fini. JavaScript est l'autre moitié : un code qui **voyage avec la page** et s'exécute **chez le visiteur**, pendant qu'il la regarde.

## En 30 secondes

**JavaScript (JS)** est le langage que le navigateur sait exécuter. **jQuery** est une bibliothèque JS qui simplifie la sélection d'éléments de la page et les réactions aux événements. Le 10/10, le prof charge jQuery et un premier fichier JS dans **toutes** les pages du framework, et passe au JS les chemins du site via des attributs `data-*`.

## C'est quoi et comment ça marche

### Deux machines, deux langages
| | PHP | JavaScript |
|---|---|---|
| S'exécute… | sur le **serveur** | dans le **navigateur** |
| Quand | une fois par requête, avant l'envoi | après réception, tant que la page est ouverte |
| Voit | fichiers, session, base de données | la page affichée (le DOM), les clics, le clavier |
| Peut cacher son code ? | oui (le visiteur ne reçoit que du HTML) | **non** (le visiteur reçoit le code) |

Conséquence de la dernière ligne : **tout contrôle fait en JS est contournable** ; la sécurité se fait toujours côté serveur (critère « sécurité PHP » de l'examen).

### Comment le JS arrive dans la page
PHP écrit dans le HTML une balise `<script src="…">` ; le navigateur télécharge le fichier et l'exécute. Dans le framework, `CPage::WriteDocument` les produit à partir des collections JS ([[TCssJsFiles et CFileCollection — Collections de fichiers CSS et JS]]) ; `CApplication` ajoute désormais d'office `*/js/jquery-4.0.0.min.js` puis `*/js/application.js` (le préfixe `*` désigne le dossier `.pid`, voir [[Dossier .pid et préfixe étoile — Séparer le framework du site]]). **L'ordre compte** : jQuery doit être chargé avant le fichier qui l'utilise.

### Le DOM
Le navigateur transforme le HTML en un **arbre d'objets** (le DOM : Document Object Model). JS peut lire et modifier cet arbre ; la page affichée suit.

### jQuery en deux idées
- **`$("sélecteur")`** : trouve des éléments de la page avec la même syntaxe que le CSS (`$("body")`, `$("#id")`, `$(".classe")`).
- **`$(document).ready(fonction)`** : exécute la fonction **quand le DOM est construit** — avant, les éléments n'existent pas encore.

### Les attributs `data-*`
Tout attribut HTML commençant par `data-` est réservé aux données de l'application. jQuery les lit avec `.data("nom")` : `data-path-to-root` devient `.data("path-to-root")`. C'est le moyen simple **de passer une valeur calculée par PHP au JavaScript**, sans mélanger les langages.

### Fonction constructeur et prototype
```js
function CApplication() { this.m_Bidule = "Truc"; }          // "constructeur" : this = l'objet créé
CApplication.prototype.Afficher = function() { ... };         // méthode partagée par toutes les instances
```
JS n'a pas (de façon classique) de `class` comme PHP : un objet est créé par `new CApplication()` et ses méthodes sont rangées dans son **prototype**. Le prof reprend ici le même nom `CApplication` que côté PHP — **intention (⚠️ Probable)** : un jumeau JS de l'application serveur.

## Sous le capot
Le navigateur construit le DOM pendant qu'il lit le HTML, rencontre `<script>`, le télécharge, l'exécute (dans l'ordre d'apparition), puis déclenche l'événement « DOM prêt » que `ready` écoute. La console du navigateur (F12) reçoit les `console.log`.

## Liens
- Mise en œuvre le 10/10 : [[Premier JavaScript du framework — jQuery, data-path-to-root et application.js]].
- La communication JS ↔ serveur (**AJAX**) n'a **pas encore** été vue.
