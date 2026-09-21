<?php
include("index.php");
if (!isset($_SESSION)) @session_start();
?><!doctype html>

<html lang="be-fr">

	<head>
		<title>Test de la POO en PHP</title>
	</head>
	
	<body>
		<h1>Test de la POO en PHP</h1>
		<pre><code style="font-size:1.35em;"><?php

if (!isset($_SESSION["personne"]))
{
	print("CREATION DE LA PERSONNE\r\n");
	$_SESSION["personne"] = new CPersonne("Duchemin", "Robert");
}
else
{
	print("RECUPERATION DE LA PERSONNE\r\n");
}
$p1 = $_SESSION["personne"];

var_dump($p1);
var_dump($p1->Nom(), $p1->Prenom());
$p1->Nom(3.141592);
$p1->Prenom("   ");
var_dump($p1->Nom(), $p1->Prenom());
$p1->Nom("Duvivier");
$p1->Prenom(" Marcel  ");
var_dump($p1->Nom(), $p1->Prenom());



		?></code></pre>
	</body>

</html>