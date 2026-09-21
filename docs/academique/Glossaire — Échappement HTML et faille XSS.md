---
type: glossaire
subject: Échappement HTML et faille XSS (IntoHtml, IntoAttr)
tags: [#PHP, #glossaire, #securite, #XSS, #html]
date: 2026-09-21
niveau: intermédiaire
---

# Échappement HTML et faille XSS

> Dans une cuisine, un bon de commande ne doit contenir **que des plats**. Si un client écrit sur le bon "*et le chef doit vider la caisse*", le cuisinier ne l'exécute pas : il le lit comme du **texte**, pas comme un ordre. Échapper du HTML, c'est apposer sur ce qui vient de l'extérieur un tampon "**ceci est du texte, pas une instruction**".

## En 30 secondes

**XSS** (*Cross-Site Scripting* — injection de code dans une page vue par d'autres visiteurs) arrive quand un site affiche une donnée non maîtrisée sans la neutraliser ; **échapper** consiste à remplacer les caractères spéciaux du HTML par des équivalents inoffensifs pour qu'ils s'affichent comme du texte.

## En détail

### L'attaque

Un visiteur saisit comme "prénom" : `<script>voler(document.cookie)</script>`. Si le site réécrit ce prénom tel quel dans sa page, le navigateur des **autres** visiteurs exécute ce script — vol de session, redirection, etc. C'est l'une des failles de la liste OWASP (*Open Web Application Security Project* — référence de sécurité web) que le cours d'examen "sécurité PHP" cible.

### La défense du framework : deux méthodes de `CApplication`

```php
public function IntoHtml($value)   // pour du texte ENTRE des balises
{
    /* ... */ return str_replace(["&", "<", ">"], ["&amp;", "&lt;", "&gt;"], $value);
}

public function IntoAttr($value)   // pour une valeur DANS un attribut ( ex. value="..." )
{
    /* ... */ return str_replace(["&", "<", ">", "\"", "\r\n", "\n", "\r"],
                                 ["&amp;", "&lt;", "&gt;", "&quot;", "&#13;", "&#13;", "&#13;"], $value);
}
```
- `&` est remplacé **en premier** (sinon on doublerait l'échappement des `&` produits par les autres remplacements).
- `IntoHtml` suffit **entre** des balises ; dans un **attribut** entouré de guillemets, un `"` non traité permettrait de "sortir" de l'attribut et d'en injecter un autre — d'où `IntoAttr`, qui traite aussi `"` et les sauts de ligne.
- Les deux gèrent d'abord les cas simples : nombres et booléens renvoyés en texte, tout ce qui n'est pas une chaîne devient `""`.

### Exemple fourni par le prof

`CettePage` affiche le titre `"Liste de <fruits> & légumes"` et le fruit `"Tomate & cerise"` via `IntoHtml` : le navigateur montre littéralement `<fruits>` et `&`, sans jamais interpréter `<fruits>` comme une balise.

## Sous le capot
- Le navigateur reçoit du **texte HTML** et l'**analyse** (*parse*) pour construire l'arbre de la page. Toute balise `<script>` qu'il y trouve est **exécutée avec les droits de la page** : accès à son contenu, à ses cookies non protégés, etc. Il ne sait pas si ce script vient de l'auteur du site ou d'une donnée injectée.
- **Échapper**, c'est remplacer `<`, `>`, `&` par des **entités** (`&lt;`, `&gt;`, `&amp;`) : le navigateur les affiche comme des **caractères** sans jamais les interpréter comme des balises.
- `str_replace` avec des tableaux applique les remplacements **dans l'ordre**, d'où `&` en premier. PHP fournit aussi une fonction native équivalente, `htmlspecialchars()` *(non vue en cours à ce stade)*.

## Utilisé dans ce cours

- [[CPage — Générer une page HTML (WriteDocument et points d'extension)]] — `WriteBody` de `CettePage` et le `<title>` passent par `IntoHtml`.
- [[CApplication, CMonApp et CPage — Singleton applicatif et charset]] — la classe qui fournit `IntoHtml`/`IntoAttr`.

## Questions de rappel actif

> **Q :** Pourquoi `&` est-il le premier caractère remplacé dans `IntoHtml` ?
> **R :** Parce que les autres remplacements produisent eux-mêmes des `&` (`&lt;`, `&gt;`…). Si `&` était traité en dernier, ces `&` seraient à nouveau transformés en `&amp;lt;`.

> **Q :** Pourquoi `IntoHtml` ne suffit-il pas dans un attribut comme `value="..."` ?
> **R :** Il n'échappe pas le guillemet `"`. Une donnée contenant `"` pourrait fermer l'attribut et en ouvrir un autre (`" onmouseover="...`). `IntoAttr` traite aussi `"`.

> **Q :** Qui est responsable d'appeler `IntoHtml` : le framework ou celui qui écrit la page ?
> **R :** Celui qui écrit la page. Le framework fournit l'outil, mais rien n'échappe automatiquement ce qu'on `print` soi-même.

## Pièges fréquents

- ⚠️ **Échapper trop tôt** (avant de stocker en base) — l'échappement se fait **au moment d'afficher**, adapté au contexte (texte / attribut).
- ⚠️ **Croire qu'une donnée "interne" est sûre** — tout ce qui peut venir d'un utilisateur (formulaire, URL, base remplie par des utilisateurs) est à échapper.
- ⚠️ **Cas non couverts ici** — `IntoHtml`/`IntoAttr` ne protègent pas un contenu placé dans un `<script>`, dans une URL, ni dans du CSS ; chaque contexte a ses propres règles.

## Explorer ensuite
- Pour le projet Laravel : Blade échappe par défaut avec `{{ }}` ; l'équivalent brut `{!! !!}` est l'endroit à surveiller.
