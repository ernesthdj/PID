<?php
interface IExhibitable
{
	public function Exhibit();
}

trait TExhibitable
{
	public function Exhibit()
	{
		$result = [ ];
		$knownObjects = [ ];
		$this->Exhibit_R($result, $knownObjects);
		return $result;
	}
	
	private function Exhibit_R(&$result, &$knownObjects)
	{
		foreach (get_mangled_object_vars($this) as $memberName=>$value)
		{
			$memberValue = $value;
			if (is_object($memberValue) && !is_callable($memberValue))
			{
				$memberValue = CApplication::Instance()->ObjectToArray($memberValue, $knownObjects);
			}
			if (is_array($memberValue))
			{
				$result[$memberName] = CApplication::Instance()->ArrayToArray($memberValue, $knownObjects);
			}
			else if (is_string($memberValue) || is_bool($memberValue) || ($memberValue === null) || is_numeric($memberValue))
			{
				$result[$memberName] = $memberValue;
			}
		}
	}
}
?>