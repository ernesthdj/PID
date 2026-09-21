<?php
trait TCssJsFiles
{
	private $m_CssFiles;
	
	private $m_JsFiles;
	
	public function Css()
	{
		if ($this->m_CssFiles === null) $this->m_CssFiles = new CFileCollection(true);
		return $this->m_CssFiles;
	}
	
	public function Js()
	{
		if ($this->m_JsFiles === null) $this->m_JsFiles = new CFileCollection(true);
		return $this->m_JsFiles;
	}
	
	private function TCssJsFiles_Initialize($cssFiles = null, $jsFiles = null)
	{
		$this->m_CssFiles = null;
		$this->m_JsFiles = null;
		if (is_array($cssFiles))
		{
			$this->m_CssFiles = new CFileCollection(true, ...$cssFiles);
		}
		if (is_array($jsFiles))
		{
			$this->m_JsFiles = new CFileCollection(true, ...$jsFiles);
		}
	}
}
?>