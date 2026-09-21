<?php
// ---------------------------
// Paramètres PID obligatoires
// ---------------------------
define("PID_SETUP_ACTION_NAME", "pidAction");
define("PID_SETUP_INDEX_FILES", "updateIndexes");

define("PID_INDEX_CONTENT_FILENAME", "./index.content.php");
define("PID_DEFAULT_INDEX_CONTENT", "<!doctype html>

<html lang=\"be-fr\">

	<head>
		<title>TODO : define content of index</title>
	</head>
	
	<body>
		<h1>TODO : define content of index</h1>
	</body>

</html>");
define("PID_CLASS_REGISTER_FILENAME", ".class.register.php");
define("PID_APPLICATION_SESSION_ITEM_NAME", "PID_APPLICATION");
define("PID_CHARSET", PID_ANSI);
//define("PID_CHARSET", PID_UTF8);

// -------------------------
// Paramètres PID optionnels
// -------------------------
define("PID_APPLICATION_CLASSNAME", "CMonApp");
//define("PID_APPLICATION_INSTANCIATOR_ARGUMENTS", function() { return [ "Voici de l'information pour mon application" ]; });
define("PID_APPLICATION_INSTANCIATOR_ARGUMENTS", [ "Voici de l'information pour mon application" ]);
?>