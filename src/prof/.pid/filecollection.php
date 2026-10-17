<?php
// Classe de gestion d'une collection d'url vers des fichiers ressources
class CFileCollection
{
	private $m_HandleUniqueItems;
	
	private $m_Items;
	
	////////////////////////////////////////////////////////////////////
	// Méthodes permettant de récupérer les éléments de la collection //
	////////////////////////////////////////////////////////////////////
	
	public function All()
	{
		return new CFileCollectionIterator($this);
	}
	
	public function Count()
	{
		return is_array($this->m_Items) ? count($this->m_Items) : 0;
	}
	
	public function Item($index)
	{
		if (!is_array($this->m_Items)) return false;
		if (!PID_IsInteger($index) || (($index = (int)$index) < 0) || ($index >= count($this->m_Items))) return false;
		return $this->m_Items[$index];
	}
	
	///////////////////////////////////////////////////////////
	// Méthodes relatives à la modification de la collection //
	///////////////////////////////////////////////////////////
	
	public function Add($relativeUrl)
	{
		if (!is_string($relativeUrl) || empty($relativeUrl)) return false;
		if (str_starts_with($relativeUrl, "./")) $relativeUrl = substr($relativeUrl, 2);
		else if (str_starts_with($relativeUrl, "/")) $relativeUrl = substr($relativeUrl, 1);
		if (!is_array($this->m_Items)) $this->m_Items = [];
		if ($this->m_HandleUniqueItems)
		{
			if (in_array($relativeUrl, $this->m_HandleUniqueItems)) return false;
		}
		$this->m_Items[] = $relativeUrl;
		return true;
	}
	
	public function Insert($index, $relativeUrl)
	{
		if (!PID_IsInteger($index) || (($index = (int)$index) < 0)) return false;
		if (!is_string($relativeUrl) || empty($relativeUrl)) return false;
		if (str_starts_with($relativeUrl, "./")) $relativeUrl = substr($relativeUrl, 2);
		else if (str_starts_with($relativeUrl, "/")) $relativeUrl = substr($relativeUrl, 1);
		if (!is_array($this->m_Items)) $this->m_Items = [];
		if ($index >= count($this->m_Items)) return $this->Add($relativeUrl);
		if ($this->m_HandleUniqueItems)
		{
			if (in_array($relativeUrl, $this->m_HandleUniqueItems)) return false;
		}
		array_splice($this->m_Items, $index, 0, $relativeUrl);
		return true;
	}
	
	//////////////////////////////////////////
	// Méthodes du cycle de vide de l'objet //
	//////////////////////////////////////////
	
	public function __construct($handleUniqueItems = null, ...$items)
	{
		$this->m_HandleUniqueItems = is_bool($handleUniqueItems) ? $handleUniqueItems : true;
		$this->m_Items = null;
		if (is_array($items))
		{
			foreach ($items as $item)
			{
				$this->Add($item);
			}
		}
	}
}

class CFileCollectionIterator implements Iterator
{
	private $m_Collection;

	private $m_Index;
	
	//////////////////////////////////////////
	// Méthodes du cycle de vide de l'objet //
	//////////////////////////////////////////

	public function __construct($collection)
	{
		$this->m_Collection = is_a($collection, "CFileCollection") ? $collection : null;
		$this->m_Index = 0;
	}
	
	//////////////////////////////////////
	// Méthodes de l'interface Iterator //
	//////////////////////////////////////

	public function rewind(): void
	{
		$this->m_Index = 0;
	}
	
	public function valid(): bool
	{
		if ($this->m_Collection === null) return false;
		if ($this->m_Index >= $this->m_Collection->Count()) return false;
		return true;
	}
	
	public function key(): mixed
	{
		return $this->m_Index;
	}
	
	public function current(): mixed
	{
		if ($this->m_Collection === null) return false;
		return $this->m_Collection->Item($this->m_Index);
	}
	
	public function next(): void
	{
		if ($this->m_Collection === null) return;
		$this->m_Index++;
	}
}
?>