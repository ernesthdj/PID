<?php
(function()
{
	// Vérification si ce fichier index.php fait l'objet d'une interrogation HTTP, sinon c'est qu'il est inclus par un autre fichier php
	$httpRequestOfIndexFile = (count(get_included_files()) == 1);
	// Définition du nom du fichier de configuration du framework PID, et qui sert aussi de marqueur de racine du site
	define("PID_CONFIG_FILENAME", ".pid.config.php");
	// Définition des constantes "techniques"
	define("PID_ANSI", "windows-1252");
	define("PID_UTF8", "utf-8");
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
	foreach (array("PID_SETUP_ACTION_NAME", "PID_SETUP_INDEX_FILES", "PID_INDEX_CONTENT_FILENAME", "PID_DEFAULT_INDEX_CONTENT", "PID_CLASS_REGISTER_FILENAME", "PID_CHARSET", "PID_APPLICATION_SESSION_ITEM_NAME") as $constantName)
	{
		if (!defined($constantName)) $missingConstantNames[] = $constantName;
	}
	if (!empty($missingConstantNames))
	{
		die("PID error : missing some constant(s) in " . PID_CONFIG_FILENAME . " : " . implode(", ", $missingConstantNames) . " !");
	}
	if ((PID_CHARSET != PID_ANSI) && (PID_CHARSET != PID_UTF8))
	{
		die("PID error : invalid value for PID_CHARSET constant defined into " . PID_CONFIG_FILENAME . " ; must be defined as PID_ANSI or PID_UTF8 !");
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
	// Inclusion du registre des classes/interfaces/traits
	PID_Include(PID_CLASS_REGISTER_FILENAME);
	// Gestion de l'autoloader des classes/interfaces/traits
	spl_autoload_register(function($className)
	{
		if (($kindIndex = strpos("CIT", $className[0])) === false) die("PID error : invalid class name '$className' !");
		$kindName = ["class", "interface", "trait"][$kindIndex];
		$typeName = substr($className, 1);
		global $PID_CLASS_REGISTER;
		if (!isset($PID_CLASS_REGISTER))
		{
			$PID_CLASS_REGISTER = defined("PID_CLASS_REGISTER") && is_array(PID_CLASS_REGISTER) ? PID_CLASS_REGISTER : [];
		}
		for ($step = 0; $step < 2; $step++)
		{
			if (!isset($PID_CLASS_REGISTER[$className]))
			{
				$exploreToFind = function(&$exploreToFind, $path, &$kindName, &$typeName, &$className)
				{
					$tokenType = ["class" => T_CLASS, "interface" => T_INTERFACE, "trait" => T_TRAIT][$kindName];
					$filePath = false;
					foreach ([ "$kindName.$typeName.php", "$typeName.php" ] as $filename)
					{
						if (file_exists($path . $filename))
						{
							if (($code = @file_get_contents($path . $filename)) !== false)
							{
								//var_dump("Check '$path$filename'");
								$step = 0;
								foreach (token_get_all($code) as $token)
								{
									if (is_array($token))
									{
										if ($step == 0)
										{
											if ($token[0] == $tokenType)
											{
												$step++;
											}
										}
										else // ($step == 1)
										{
											if ($token[0] == T_STRING)
											{
												if ($token[1] == $className)
												{
													$filePath = $path . $filename;
													break;
												}
												$step = 0;
											}
											else if (($token[0] != T_WHITESPACE) && ($token[0] != T_COMMENT))
											{
												$step = 0;
											}
										}
									}
								}
								if ($filePath !== false) break;
							}
						}
					}
					if ($filePath !== false) return $filePath;
					$subDirectories = glob($path . "*", GLOB_ONLYDIR);
					foreach ($subDirectories as $subDir)
					{
						$subPath = $subDir;
						if (!str_ends_with($subPath, "/")) $subPath .= "/";
						if (str_ends_with($subPath, "/./") || str_ends_with($subPath, "/../")) continue;
						$filePath = $exploreToFind($exploreToFind, $subPath, $kindName, $typeName, $className);
						if ($filePath !== false) break;
					}
					return $filePath;
				};
				$filePath = $exploreToFind($exploreToFind, PID_PATH_TO_ROOT, $kindName, $typeName, $className);
				if ($filePath !== false)
				{
					$filePath = substr($filePath, strlen(PID_PATH_TO_ROOT));
					$PID_CLASS_REGISTER[$className] = $filePath;
					$code = "<" . "?php\r\ndefine(\"PID_CLASS_REGISTER\",\r\n[\r\n";
					$firstStep = true;
					foreach ($PID_CLASS_REGISTER as $key=>$value)
					{
						if ($firstStep)
						{
							$firstStep = false;
						}
						else
						{
							$code .= ",\r\n";
						}
						$code .= "\t\"$key\" => \"$value\"";
					}
					$code .= "\r\n]);\r\n?" . ">";
					$codeFilePath = PID_PathTo(PID_CLASS_REGISTER_FILENAME, false);
					if (($codeFilePath === false) || @file_put_contents($codeFilePath, $code) === false) die("PID error : can't create/update file '" . PID_PATH_TO_ROOT . PID_CLASS_REGISTER_FILENAME . "' !");
				}
				else
				{
					die("PID error : can't find $kindName '$className' !");
				}
			}
			else
			{
				$filePath = $PID_CLASS_REGISTER[$className];
			}
			PID_Include($filePath);
			eval("\$exists = $kindName" . "_exists(\"$className\", false);");
			if ($exists) return;
			unset($PID_CLASS_REGISTER[$className]);
		}
	});
	if ($httpRequestOfIndexFile)
	{
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
	}
	else
	{
		// "Simple" inclusion de ce fichier index.php par un autre fichier php, qui lui a fait l'objet de l'interrogation HTTP
	}
})();

// Fonction (globale) permettant de déterminer un chemin d'accès relatif à partir de la page interrogée vers une ressource (fichier, répertoire), en ayant spécifié ce chemin à partir de la racine du site
function PID_PathTo($url, $checkIfFileExists = true)
{
	if (!is_string($url)) return false;
	$slashIndex = strpos($url, "/");
	$colonIndex = strpos($url, ":");
	if (($colonIndex !== false) && (($slashIndex === false) || ($colonIndex < $slashIndex)))
	{
		// Lien externe
	}
	else
	{
		// Lien interne
		if (str_starts_with($url, "./")) $url = substr($url, 2);
		else if (str_starts_with($url, "/")) $url = substr($url, 1);
		$url = PID_PATH_TO_ROOT . $url;
		// Vérification de l'existence de la ressource
		if ($checkIfFileExists === true)
		{
			$questionMarkIndex = strpos($url, "?");
			$urlToCheck = ($questionMarkIndex === false) ? $url : substr($url, 0, $questionMarkIndex);
			if (!file_exists($urlToCheck)) return false;
		}
	}
	return $url;
}

// Fonction (globale) permettant d'inclure un fichier spécifié par son chemin d'accès relatif à partir de la page interrogée vers une ressource (fichier, répertoire), en ayant spécifié ce chemin à partir de la racine du site
function PID_Include($url)
{
	$url = PID_PathTo($url);
	if ($url === false) return false;
	if (!@is_file($url)) return false;
	@include($url);
	return true;
}

// Fonction (globale) permettant d'inclure un fichier spécifié par son chemin d'accès relatif à partir de la page interrogée vers une ressource (fichier, répertoire), en ayant spécifié ce chemin à partir de la racine du site
function PID_IncludeOnce($url)
{
	$url = PID_PathTo($url);
	if ($url === false) return false;
	if (!@is_file($url)) return false;
	@include_once($url);
	return true;
}
?>