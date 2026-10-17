<?php
class CAutre
{
}
// Ma classe personne
class /* OUPS un commentaire */ CPersonne
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
	
	public function __construct($nom, $prenom)
	{
		$this->Nom($nom);
		$this->Prenom($prenom);
	}
}
?>