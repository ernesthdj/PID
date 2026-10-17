<?php

/*
new CPage
(
	"Page d'accueil du site de test", // Titre de la page
	null, // Fichiers CSS à inclure
	null, // Fichiers JS à inclure
	null, // Contenu additionnel de la balise HEAD
	"<p>Voici un premier paragraphe</p>\n<p>En voici un second</p>" // Contenu de la balise BODY
)->WriteDocument();
*/

/*
new CPage
(
	"Page d'accueil du site de test", // Titre de la page
	null, // Fichiers CSS à inclure
	null, // Fichiers JS à inclure
	null, // Contenu additionnel de la balise HEAD
	null // Contenu de la balise BODY
)->WriteDocument(null, "<p>Voici un premier paragraphe</p>\n<p>En voici un second</p>");
*/

/*
$p = new CPage
(
	"Page d'accueil du site de test", // Titre de la page
	null, // Fichiers CSS à inclure
	null, // Fichiers JS à inclure
	null, // Contenu additionnel de la balise HEAD
	"OUPS LE CONTENU" // Contenu de la balise BODY
);
$p->WriteDocument(null, "<p>Voici un premier paragraphe</p>\n<p>En voici un second</p>");
$p->WriteDocument();
*/

/*
$p = new CPage
(
	function ($doc) { return "Page d'accueil du site de test par " . get_class($doc); }, // Titre de la page
	null, // Fichiers CSS à inclure
	null, // Fichiers JS à inclure
	null, // Contenu additionnel de la balise HEAD
	function($tabs, $doc) { print("$tabs<pre>\r\n$tabs OUPS\r\n$tabs LE CONTENU</pre>\r\n"); } // Contenu de la balise BODY
);
$p->WriteDocument(null, function($tabs, $doc) { print("$tabs<p>Voici un premier paragraphe</p>\r\n$tabs<p>En voici un second </p>\r\n"); });
$p->WriteDocument();
*/

/**/
class CettePage extends CPage
{
	protected function WriteBody($tabs)
	{
		print("$tabs<h1>" . CApplication::Instance()->IntoHtml($this->Title()) . "</h1>\r\n");
		print("$tabs<article>\r\n");
		print("$tabs\t<ol>\r\n");
		foreach(["Pomme", "Poire", "Raisin", "Tomate & cerise"] as $fruit)
		{
			print("$tabs\t\t<li>" . CApplication::Instance()->IntoHtml($fruit) . "</li>\r\n");
		}
		print("$tabs\t</ol>\r\n");
		print("$tabs</article>\r\n");
	}
	
	public function __construct()
	{
		parent::__construct("Liste de <fruits> & légumes");
	}
}

/*
//unset($_SESSION["unePersonne"]);
if (!isset($_SESSION["unePersonne"]))
{
	$_SESSION["unePersonne"] = new CPersonne("Depré", "Michel", function($personne, $a, $b) { $c = $a + $b; print("<p>D'après " . $personne->Nom() . " "  . $personne->Prenom() . ", $a + $b = $c</p>"); return $c; });
}
if ($_SESSION["unePersonne"]->FaireAction(12, 7) === false)
{
	print("<p>" . $_SESSION["unePersonne"]->Nom() . " "  . $_SESSION["unePersonne"]->Prenom() . " n'a rien à faire !</p>");
}
*/
unset($_SESSION[PID_APPLICATION_SESSION_ITEM_NAME]);
new CettePage()->WriteDocument();
?>