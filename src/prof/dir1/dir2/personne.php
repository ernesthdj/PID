<?php
/*
// Ma classe personne
class CPersonne
{
	private $m_Nom;
	
	private $m_Prenom;
	
	public function Nom($valeur = null)
	{
		if ($valeur !== null)
		{
			if (!is_string($valeur)) return false;
			$valeur = trim($valeur);
			if (empty($valeur)) return false;
			$this->m_Nom = $valeur;
			return true;
		}
		else
		{
			return $this->m_Nom;
		}
	}
	
	public function Prenom($valeur = null)
	{
		if ($valeur !== null)
		{
			if (!is_string($valeur)) return false;
			$valeur = trim($valeur);
			if (empty($valeur)) return false;
			$this->m_Prenom = $valeur;
			return true;
		}
		else
		{
			return $this->m_Prenom;
		}
	}
	
	private $m_ActionAFaire;
	
	public function ActionAFaire($value = null)
	{
		if ($value !== null)
		{
			if (is_string($value) || !is_callable($value)) return false;
			$this->m_ActionAFaire = $value;
			return true;
		}
		else
		{
			return $this->m_ActionAFaire;
		}
	}
	
	public function FaireAction(...$arguments)
	{
		if (!is_callable($this->m_ActionAFaire)) return false;
		return ($this->m_ActionAFaire)($this, ...$arguments);
	}
	
	public function __construct($nom = null, $prenom = null, $actionAFaire = null)
	{
		$this->Nom($nom);
		$this->Prenom($prenom);
		$this->ActionAFaire($actionAFaire);
	}
	
	public function __sleep()
	{
		//var_dump(array_keys(get_mangled_object_vars($this)));
		//$membres = get_mangled_object_vars($this);
		//unset($membres["\0CPersonne\0m_ActionAFaire"]);
		//return array_keys($membres);
		return CApplication::Instance()->GetMemberNamesFrom($this);
	}
}
*/

// Ma classe personne
class CPersonne implements IExhibitable
{
	use TExhibitable;
	
	private $m_Nom;
	
	private $m_Prenom;
	
	public function Nom($valeur = null)
	{
		if ($valeur !== null)
		{
			if (!is_string($valeur)) return false;
			$valeur = trim($valeur);
			if (empty($valeur)) return false;
			$this->m_Nom = $valeur;
			return true;
		}
		else
		{
			return $this->m_Nom;
		}
	}
	
	public function Prenom($valeur = null)
	{
		if ($valeur !== null)
		{
			if (!is_string($valeur)) return false;
			$valeur = trim($valeur);
			if (empty($valeur)) return false;
			$this->m_Prenom = $valeur;
			return true;
		}
		else
		{
			return $this->m_Prenom;
		}
	}
	
	private $m_ActionAFaire;
	
	public function ActionAFaire($value = null)
	{
		if ($value !== null)
		{
			if (is_string($value) || !is_callable($value)) return false;
			$this->m_ActionAFaire = $value;
			return true;
		}
		else
		{
			return $this->m_ActionAFaire;
		}
	}
	
	public function FaireAction(...$arguments)
	{
		if (!is_callable($this->m_ActionAFaire)) return false;
		return ($this->m_ActionAFaire)($this, ...$arguments);
	}
	
	public function __construct($nom = null, $prenom = null, $actionAFaire = null)
	{
		$this->Nom($nom);
		$this->Prenom($prenom);
		$this->ActionAFaire($actionAFaire);
	}
	
	public function __sleep()
	{
		return array_keys($this->Exhibit());
	}
}
?>