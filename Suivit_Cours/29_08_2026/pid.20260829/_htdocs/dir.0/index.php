<?php
(function()
{
	// Définition du nom du fichier de configuration du framework PID, et qui sert aussi de marqueur de racine du site
	define("PID_CONFIG_FILENAME", ".pid.config.php");
	// Recherche du chemin ascendant de l'emplacement du fichier faisant l'objet de la requête HTTP vers le répertoire racine du site
	$relativePathToRoot = "./";
	for ($remainingUpSteps = substr_count(str_replace("\\", "/", __FILE__), "/"); $remainingUpSteps > 0; $remainingUpSteps--)
	{
		//print("<li>Try to find " . PID_CONFIG_FILENAME . " into $relativePathToRoot</li>");
		if (file_exists($relativePathToRoot . PID_CONFIG_FILENAME))
		{
			define("PID_PATH_TO_ROOT", $relativePathToRoot);
			break;
		}
		if ($relativePathToRoot == "./")
		{
			$relativePathToRoot = "../";
		}
		else
		{
			$relativePathToRoot .= "../";
		}
	}
	if (!defined("PID_PATH_TO_ROOT"))
	{
		die("PID error : missing " . PID_CONFIG_FILENAME . " in root directory ; add it manually !");
	}
	// Inclusion de la configuration du framework PID
	include_once(PID_PATH_TO_ROOT . PID_CONFIG_FILENAME);
	$missingConstantNames = [];
	foreach (array("PID_SETUP_ACTION_NAME", "PID_SETUP_INDEX_FILES", "PID_INDEX_CONTENT_FILENAME", "PID_DEFAULT_INDEX_CONTENT") as $constantName)
	{
		if (!defined($constantName)) $missingConstantNames[] = $constantName;
	}
	if (!empty($missingConstantNames))
	{
		die("PID error : missing some constant(s) in " . PID_CONFIG_FILENAME . " : " . implode(", ", $missingConstantNames) . " !");
	}
	// Vérification et exécution si nécessaire des actions de configuration du framework PID
	if (isset($_GET[PID_SETUP_ACTION_NAME]))
	{
		switch ($_GET[PID_SETUP_ACTION_NAME])
		{
			case PID_SETUP_INDEX_FILES:
				// Action de mise à jour des fichiers index.php dans toute l'arborescense du site, en partant du code "originel" se trouvant dans la racine du site
				if (($indexContent = @file_get_contents(PID_PATH_TO_ROOT . "index.php")) === false) die("PID error : can't execute " . PID_SETUP_INDEX_FILES . " action ; can't read index.php in root directory !");
				$exploreAndCreate = function(&$exploreAndCreate, $path, &$indexContent, $mustCreate)
				{
					if ($mustCreate)
					{
						if (@file_put_contents($path . "index.php", $indexContent) === false)
						{
							print("<li>Can't create $path" . "index.php !</li>");
						}
						else
						{
							print("<li>File $path" . "index.php has been created or updated</li>");
						}
					}
					$subDirectories = glob($path . "*", GLOB_ONLYDIR);
					foreach ($subDirectories as $subDir)
					{
						$subPath = $subDir;
						if (!str_ends_with($subPath, "/")) $subPath .= "/";
						if (str_ends_with($subPath, "/./") || str_ends_with($subPath, "/../")) continue;
						$exploreAndCreate($exploreAndCreate, $subPath, $indexContent, true);
					}
				};
				$exploreAndCreate($exploreAndCreate, PID_PATH_TO_ROOT, $indexContent, false);
				die("<li>" . PID_SETUP_INDEX_FILES . " action is done");
		}
	}
	// Inclusion si possible du contenu d'accueil du répertoire interrogé, ou à défaut, redirection vers le répertoire supérieure
	if (file_exists(PID_INDEX_CONTENT_FILENAME))
	{
		@include_once(PID_INDEX_CONTENT_FILENAME);
	}
	else if (!file_exists(PID_CONFIG_FILENAME))
	{
		header("location:../");
		die();
	}
	else
	{
		if (@file_put_contents(PID_INDEX_CONTENT_FILENAME, PID_DEFAULT_INDEX_CONTENT) !== false)
		{
			die("PID error : missing " . PID_INDEX_CONTENT_FILENAME . " in root directory ; " . PID_INDEX_CONTENT_FILENAME . " is created in root directory, and now fill it !");
		}
		else
		{
			die("PID error : missing " . PID_INDEX_CONTENT_FILENAME . " in root directory ; add it manually !");
		}
	}
})();
?>