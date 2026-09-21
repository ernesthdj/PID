---
type: glossaire
subject: En-têtes HTTP et fonction header() — ce que PHP envoie avant le contenu de la page
tags: [#glossaire, #HTTP, #PHP, #header]
date: 2026-09-21
niveau: intermédiaire
---

# En-têtes HTTP et `header()`

> **En 30 secondes** — HTTP (*HyperText Transfer Protocol* — le protocole de communication du web) envoie chaque réponse en **deux parties** : d'abord des **en-têtes** (des informations *sur* la réponse), ensuite le **corps** (la page). `header()` en PHP ajoute un en-tête, et doit être appelée **avant** toute sortie de texte.

## 1. C'est quoi, et pourquoi ça existe ?
- **Problématique** : le navigateur doit savoir *comment lire* ce qu'il reçoit (du HTML ? un PDF ? en quel encodage ?) et *que faire* (afficher, rediriger, mémoriser un cookie) avant de toucher au contenu.
- **Analogie** : une **lettre postale**. L'**enveloppe** (en-têtes) dit qui, où, quelle langue ; la **lettre** (corps) vient ensuite. Le facteur lit toujours l'enveloppe en premier — et on ne peut pas écrire sur l'enveloppe après avoir posté la lettre.

## 2. Comment ça marche (sous le capot)
Une réponse HTTP ressemble à :
```
HTTP/1.1 200 OK                          ← ligne de statut
Content-Type: text/html;charset=windows-1252   ← en-têtes
                                          ← ligne vide
<!doctype html> …                         ← corps
```
- PHP **retient** les en-têtes en mémoire et les envoie **au tout premier octet de corps**. Après ce moment, plus aucun en-tête ne peut partir : PHP signale l'erreur *« headers already sent »* (sauf si la mise en tampon de sortie est activée).
- Un simple **espace ou saut de ligne avant `<?php`** compte comme un premier octet de corps.

## 3. En pratique (dans le cours)
```php
header("content-type:text/html;charset=" . CApplication::Instance()->Charset(), true);
```
- `CPage::DeclareContentType()` annonce le type du contenu **et** son encodage ([[Glossaire — Encodage des caractères (windows-1252 vs UTF-8)]]). Le `true` signifie « remplace un en-tête du même nom s'il existe ».
- `index.php` : `header("location:../"); die();` — l'en-tête **Location** ordonne au navigateur de refaire une requête vers le dossier parent (quand un dossier n'a pas de `index.content.php` et n'est pas la racine).
- `CApplication::Instance()` appelle `session_start()` : la session repose sur un cookie envoyé **par un en-tête** (`Set-Cookie`) — elle aussi doit donc précéder tout affichage *(⚠️ Probable : général à PHP, non vérifié dans le code du cours)*.

## Utilisé dans ce cours
- [[CPage — Générer une page HTML (WriteDocument et points d'extension)]] — `DeclareContentType()` est le premier appel de `WriteDocument`.
- [[Bootstrap PID — Detection de la Racine du Site]] — la redirection `location:../`.

## Retenir et vérifier
- **À retenir** : en-têtes d'abord, corps ensuite ; `header()` avant tout `print`.
> **Q :** Pourquoi `DeclareContentType()` est-il appelé avant tout `print` dans `WriteDocument` ?
> **R :** Parce que les en-têtes partent au premier octet du corps ; après un `print`, l'envoi d'un en-tête est impossible (*headers already sent*).

**Pièges** : ⚠️ un espace ou un BOM (marqueur d'ordre des octets) avant `<?php` ; ⚠️ `header()` ne « demande » rien à PHP tout de suite : elle prépare, l'envoi se fait plus tard.
