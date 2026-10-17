<?php
// Classe de base de toute application WEB utilisant le framework PID
class CApplication
{
	//////////////////////////
	// Gestion du singleton //
	//////////////////////////
	
	private static $s_Instance;
	
	public static function Instance()
	{
		if (self::$s_Instance === null)
		{
			if (!isset($_SESSION) && !@session_start())
			{
				die("PID error : can't start session to manage CApplication singleton !");
			}
			$className = defined("PID_APPLICATION_CLASSNAME") && is_string(PID_APPLICATION_CLASSNAME) && class_exists(PID_APPLICATION_CLASSNAME, true)
					   ? PID_APPLICATION_CLASSNAME : "CApplication";
			if (isset($_SESSION[PID_APPLICATION_SESSION_ITEM_NAME]))
			{
				$instance = $_SESSION[PID_APPLICATION_SESSION_ITEM_NAME];
				if (is_a($instance, "CApplication") && (get_class($instance) == $className))
				{
					self::$s_Instance = $instance;
				}
				else
				{
					unset($_SESSION[PID_APPLICATION_SESSION_ITEM_NAME]);
				}
			}
			if (!isset($_SESSION[PID_APPLICATION_SESSION_ITEM_NAME]))
			{
				try
				{
					$arguments = [];
					if (defined("PID_APPLICATION_INSTANCIATOR_ARGUMENTS"))
					{
						if (!is_string(PID_APPLICATION_INSTANCIATOR_ARGUMENTS) && is_callable(PID_APPLICATION_INSTANCIATOR_ARGUMENTS))
						{
							$fctn = PID_APPLICATION_INSTANCIATOR_ARGUMENTS;
							$arguments = $fctn();
							if (!is_array($arguments)) $arguments = [];
						}
						else if (is_array(PID_APPLICATION_INSTANCIATOR_ARGUMENTS))
						{
							$arguments = PID_APPLICATION_INSTANCIATOR_ARGUMENTS;
						}
					}
					$instance = @new $className(...$arguments);
				}
				catch (Exception $error)
				{
					die("PID error : can't create CApplication singleton with type $className !");
				}
				if (!is_a($instance, "CApplication"))
				{
					die("PID error : creation of CApplication singleton with type $className generates a \"non-CApplication\" object !");
				}
			}
		}
		return self::$s_Instance;
	}
	
	////////////////////////////////////////////////////////////////////////////////////////////////
	// Gestion des fichiers css et js à inclure systématiquement dans toute page affichée du site //
	////////////////////////////////////////////////////////////////////////////////////////////////
	
	use TCssJsFiles;
	
	//////////////////////////////////////////////////
	// Méthodes relatives au contexte d'utilisation //
	//////////////////////////////////////////////////
	
	public function Charset()
	{
		return PID_CHARSET;
	}
	
	public function CharsetIsAnsi()
	{
		return PID_CHARSET == PID_ANSI;
	}
	
	public function CharsetIsUtf8()
	{
		return PID_CHARSET == PID_UTF8;
	}
	
	private static $c_Encoding = [ PID_ANSI => "Windows-1252", PID_UTF8 => "UTF-8" ];
	
	public function ToUtf8($value)
	{
		if ($this->CharsetIsUtf8()) return $value;
		$knownObjects = [];
		return $this->ToUtf8_R($value, $knownObjects);
	}
	
	private function ToUtf8_R($value, &$knownObjects)
	{
		if (is_string($value)) return mb_convert_encoding($value, self::$c_Encoding[PID_UTF8], self::$c_Encoding[PID_ANSI]);
		if (is_object($value) && !is_callable($value))
		{
			$value = $this->ObjectToArray($value, $knownObjects);
		}
		if (is_array($value))
		{
			$result = [];
			foreach ($value as $k=>$v)
			{
				$result[is_string($k) ? $this->ToUtf8_R($k) : $k] = $this->ToUtf8_R($v);
			}
			return $result;
		}
		else if (is_string($value) || is_bool($value) || ($value === null) || is_numeric($value))
		{
			return $value;
		}
		else
		{
			return null;
		}
	}
		
	public function FromUtf8($value)
	{
		if ($this->CharsetIsUtf8()) return $value;
		$knownObjects = [];
		return $this->FromUtf8_R($value, $knownObjects);
	}
	
	private function FromUtf8_R($value)
	{
		if (is_string($value)) return mb_convert_encoding($value, self::$c_Encoding[PID_ANSI], self::$c_Encoding[PID_UTF8]);
		if (is_object($value) && !is_callable($value))
		{
			$value = $this->ObjectToArray($value, $knownObjects);
		}
		if (is_array($value))
		{
			$result = [];
			foreach ($value as $k=>$v)
			{
				$result[is_string($k) ? $this->FromUtf8_R($k) : $k] = $this->FromUtf8_R($v);
			}
			return $result;
		}
		else if (is_string($value) || is_bool($value) || ($value === null) || is_numeric($value))
		{
			return $value;
		}
		else
		{
			return null;
		}
	}
	
	public function ObjectToArray($object, &$knownObjects)
	{
		if (!is_object($object)) return [];
		if (!is_array($knownObjects)) return [];
		foreach ($knownObjects as $knownObject)
		{
			if ($object === $knownObject)
			{
				return null;
			}
		}
		$knownObjects[] = $object;
		if (is_a($object, "IExhibitable"))
		{
			return $object->Exhibit();
		}
		else
		{
			return get_mangled_object_vars($object);
		}
	}
	
	public function ArrayToArray($array, &$knownObjects)
	{
		if (!is_array($array)) return [];
		if (!is_array($knownObjects)) return [];
		$result = [];
		foreach ($array as $key=>$value)
		{
			if (is_object($value) && !is_callable($value))
			{
				$result[$key] = $this->ArrayToArray($this->ObjectToArray($value, $knownObjects), $knownObjects);
			}
			else if (is_array($value))
			{
				$result[$key] = $this->ArrayToArray($value, $knownObjects);
			}
			else if (is_string($value) || is_bool($value) || ($value === null) || is_numeric($value))
			{
				$result[$key] = $value;
			}
		}
		return $result;
	}
	
	////////////////////////////////////////////////////////
	// Méthodes de gestion des informations sérialisables //
	////////////////////////////////////////////////////////
	
	public function GetMemberNamesFrom($value, ...$exceptions)
	{
		if (!is_object($value)) return [];
		$memberNames = [ ];
		foreach (get_mangled_object_vars($value) as $memberName=>$memberValue)
		{
			$isSerializable = false;
			if (is_array($memberValue))
			{
				$isSerializable = VerifySerializableArray_R($memberValue);
			}
			else if (is_string($memberValue) || is_bool($memberValue) || ($memberValue === null) || is_numeric($memberValue))
			{
				$isSerializable = true;
			}
			if ($isSerializable)
			{
				$nameParts = explode("\0", $memberName);
				if (!in_array($nameParts[count($nameParts) - 1], $exceptions))
				{
					$memberNames[] = $memberName;
				}
			}
		}
		return $memberNames;
		
	}
	
	private function VerifySerializableArray_R($array)
	{
		foreach ($array as $key=>$value)
		{
			if (is_array($value))
			{
				if (!VerifySerializableArray_R($value)) return false;
			}
			else if (!is_string($value) && !is_bool($value) && ($value !== null) && !is_numeric($value))
			{
				return false;
			}
		}
		return true;
	}
	
	///////////////////////////////////////////////////
	// Méthodes utilitaires de traitements de chaîne //
	///////////////////////////////////////////////////
	
	public function IntoHtml($value)
	{
		if (is_numeric($value)) return "$value";
		if (is_bool($value)) return $value ? "true" : "false";
		if (!is_string($value)) return "";
		return str_replace(["&", "<", ">"], ["&amp;", "&lt;", "&gt;"], $value);
	}
	
	public function IntoAttr($value)
	{
		if (is_numeric($value)) return "$value";
		if (is_bool($value)) return $value ? "true" : "false";
		if (!is_string($value)) return "";
		return str_replace(["&", "<", ">", "\"", "\r\n", "\n", "\r"], ["&amp;", "&lt;", "&gt;", "&quot;", "&#13;", "&#13;", "&#13;"], $value);
	}
	
	//////////////////////////////////////////
	// Méthodes du cycle de vide de l'objet //
	//////////////////////////////////////////
	
	protected function __construct($cssFiles = null, $jsFiles = null)
	{
		self::$s_Instance = $this;
		$_SESSION[PID_APPLICATION_SESSION_ITEM_NAME] = $this;
		$this->TCssJsFiles_Initialize($cssFiles, $jsFiles);
		$this->Js()->Add("*/js/jquery-4.0.0.min.js");
		$this->Js()->Add("*/js/application.js");
	}
	
	protected function __wakeup()
	{
	}
}
?>