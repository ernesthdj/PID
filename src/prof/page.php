<?php
// Classe de base de toute page HTML utilisant le framework PID
class CPage
{
	public static function DeclareContentType()
	{
		header("content-type:text/html;charset=" . CApplication::Instance()->Charset(), true);
	}
	
	///////////////////////////////////////////////////
	// Méthodes relatives à la génération de contenu //
	///////////////////////////////////////////////////
	
	public function WriteDocument()
	{
		self::DeclareContentType();
		?><!doctype html>

<html lang="be-fr">

	<head>
		<meta charset="<?php print(CApplication::Instance()->Charset()); ?>"/>
		<meta http-equiv="content-type" content="text/html;charset=<?php print(CApplication::Instance()->Charset()); ?>"/>
		<title>Page d'accueil du site par défaut</title>
	</head>
	
	<body>
		<h1>Page d'accueil du site par défaut</h1>
	</body>

</html><?php
	}
	
	//////////////////////////////////////////
	// Méthodes du cycle de vide de l'objet //
	//////////////////////////////////////////
	
	public function __construct()
	{
	}
}
?>