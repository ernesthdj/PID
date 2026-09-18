<?php
class CMonApp extends CApplication
{
	private $m_Information;
	
	public function Information($valeur = null)
	{
		if ($valeur !== null)
		{
			if (!is_string($valeur)) return false;
			if (empty($valeur = trim($valeur))) return false;
			$this->m_Information = $valeur;
			return true;
		}
		else
		{
			return $this->m_Information;
		}
	}
	
	public function __construct($information = null)
	{
		parent::__construct();
		var_dump("Création d'un objet de type CMonApp");
		$this->Information($information);
	}
	
	protected function __wakeup()
	{
		parent::__wakeup();
		var_dump("Récupération d'un objet de type CMonApp");
	}
	
	public function DoSomething()
	{
		var_dump("Je fais quelque chose avec \"" . $this->m_Information . "\"");
	}
}
?>