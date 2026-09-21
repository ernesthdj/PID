---
type: glossaire
subject: Encodage des caractères — windows-1252 (ANSI) et UTF-8, mb_convert_encoding
tags: [#glossaire, #encodage, #PHP, #charset]
date: 2026-09-21
niveau: intermédiaire
---

# Encodage des caractères (`windows-1252` vs `UTF-8`)

> **En 30 secondes** — Un fichier n'est qu'une suite d'**octets** (nombres). Un **encodage** est le dictionnaire qui dit quel caractère correspond à quel nombre. Lire des octets avec le **mauvais dictionnaire** donne du texte illisible (`Ã©` au lieu de `é`).

## 1. C'est quoi, et pourquoi ça existe ?
- **Problématique** : l'ordinateur ne connaît que des nombres. Il faut une convention pour transformer `é`, `€` ou `ж` en nombres, et inversement. Plusieurs conventions coexistent, d'où les conflits.
- **Analogie** : le **code Morse**. La même suite de signaux peut se lire avec deux « tables » différentes ; si l'émetteur et le récepteur n'utilisent pas la même, le message devient du charabia.

## 2. Comment ça marche (sous le capot)
| Encodage | Taille par caractère | Caractères possibles | Le `é` devient… |
|----------|----------------------|----------------------|-----------------|
| `windows-1252` (souvent appelé « ANSI ») | **1 octet** | 256 (alphabets d'Europe de l'Ouest) | `0xE9` (1 octet) |
| `UTF-8` | **1 à 4 octets** | tous les alphabets du monde | `0xC3 0xA9` (2 octets) |

- Lire `0xC3 0xA9` (UTF-8) avec la table `windows-1252` : deux caractères → **`Ã©`** (on appelle ça un *mojibake*).
- Lire `0xE9` seul (windows-1252) comme de l'UTF-8 : séquence invalide → **`�`**.
- Pour qu'un texte soit correct, **trois choses doivent s'accorder** : l'encodage du **fichier enregistré**, celui **annoncé** au navigateur, et celui que le code suppose.

## 3. En pratique (dans le cours)
```php
define("PID_ANSI", "windows-1252");   define("PID_UTF8", "utf-8");
define("PID_CHARSET", PID_ANSI);      // .pid.config.php : encodage du site, validé au Bootstrap
```
- `CApplication::Charset()` renvoie cet encodage ; `CPage` l'annonce dans l'en-tête HTTP (`charset=…`) **et** dans `<meta charset>` ([[Glossaire — En-têtes HTTP et header()]]).
- `ToUtf8()` / `FromUtf8()` convertissent des textes (chaînes, tableaux) avec `mb_convert_encoding` quand le site est en `windows-1252` mais qu'un échange exige de l'UTF-8.
- **Constaté à la lecture du matériel** : les fichiers `.php` du prof sont enregistrés en `windows-1252` (ouverts comme UTF-8, les accents apparaissent en `�`), en cohérence avec `PID_CHARSET = PID_ANSI`. Le texte du cours du 29/08, lui, est en UTF-8.

## Utilisé dans ce cours
- [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] — `PID_CHARSET`, `ToUtf8`/`FromUtf8`.
- [[Bootstrap PID — Detection de la Racine du Site]] — valide que `PID_CHARSET` vaut `PID_ANSI` ou `PID_UTF8`.
- [[CPage — Générer une page HTML (WriteDocument et points d'extension)]] — annonce le charset au navigateur.

## Retenir et vérifier
- **À retenir** : mêmes octets + mauvais dictionnaire = texte corrompu ; fichier, en-tête et code doivent annoncer le **même** encodage.
> **Q :** Pourquoi un `é` apparaît-il `Ã©` dans une page ?
> **R :** Les deux octets UTF-8 du `é` sont lus avec la table `windows-1252`, qui les prend pour deux caractères distincts.

**Pièges** : ⚠️ changer `PID_CHARSET` **sans** réenregistrer les fichiers dans le nouvel encodage ; ⚠️ « ANSI » n'est pas un vrai nom d'encodage, c'est un raccourci courant pour `windows-1252` ; ⚠️ la base de données aura aussi son propre encodage *(pas encore vu en cours)*.
