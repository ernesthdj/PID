<?php
// Classe de base de toute page HTML utilisant le framework PID
class CPage
{
	public static function DeclareContentType()
	{
		header("content-type:text/html;charset=" . CApplication::Instance()->Charset(), true);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Gestion des fichiers css et js à inclure systématiquement dans toute page de cette nature ou dérivée //
	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	use TCssJsFiles;

	///////////////////////////////////////////////////
	// Méthodes relatives à la génération de contenu //
	///////////////////////////////////////////////////
	
	public function WriteDocument($headContent = null, $bodyContent = null)
	{
		self::DeclareContentType();
		//print("<!doctype html>\r\n\r\n<html xmlns=\"http://www.w3.org/1999/xhtml\" lang=\"be-fr\">\r\n\r\n\t<head>\r\n\t\t<meta charset=\"");
		print("<!doctype html>\r\n\r\n<html lang=\"be-fr\">\r\n\r\n\t<head>\r\n\t\t<meta charset=\"");
		print(CApplication::Instance()->Charset());
		print("\"/>\r\n\t\t<meta http-equiv=\"content-type\" content=\"text/html;charset=");
		print(CApplication::Instance()->Charset());
		print("\"/>\r\n");
		foreach ([CApplication::Instance()->Css(), $this->Css()] as $css)
		{
			foreach ($css->All() as $url)
			{
				if (($targetedUrl = PID_PathTo($url)) === false) continue;
				print("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"$targetedUrl\"/>\r\n");
			}
		}
		foreach ([CApplication::Instance()->Js(), $this->Js()] as $js)
		{
			foreach ($js->All() as $url)
			{
				if (($targetedUrl = PID_PathTo($url)) === false) continue;
				print("\t\t<script src=\"$targetedUrl\"></script>\r\n");
			}
		}
		if (($title = $this->Title()) !== false)
		{
			print("\t\t<title>");
			print(CApplication::Instance()->IntoHtml($title));
			print("</title>\r\n");
		}
		if (!$this->WriteContent("\t\t", $headContent, $this->HeadContent()))
		{
			$this->WriteHead("\t\t");
		}
		print("\t</head>\r\n\r\n");
		print("\t<body>\r\n");
		if (!$this->WriteContent("\t\t", $bodyContent, $this->BodyContent()))
		{
			$this->WriteBody("\t\t");
		}
		print("\t</body>\r\n\r\n</html>\r\n");
	}
	
	protected function WriteHead($tabs)
	{
		// Lors d'un héritage, on peut réécrire cette méthode afin de générer avec des appels à print, le contenu additionnel de la balise HEAD
	}
	
	protected function WriteBody($tabs)
	{
		// Lors d'un héritage, on peut réécrire cette méthode afin de générer avec des appels à print, le contenu de la balise BODY
	}
	
	private function WriteContent($tabs, ...$contents)
	{
		if (!is_array($contents) || empty($contents)) return false;
		foreach ($contents as $content)
		{
			if (is_string($content))
			{
				foreach (explode("\n", str_replace(["\r\n", "\r"], "\n", $content)) as $line)
				{
					print("$tabs$line\r\n");
				}
				return true;
			}
			else if (is_callable($content))
			{
				$content($tabs, $this);
				return true;
			}
		}
		return false;
	}
	
	//////////////////////////////////
	// Gestion du titre du document //
	//////////////////////////////////
	
	private $m_Title;
	
	public function Title($value = null)
	{
		if ($value !== null)
		{
			if (($value === false)
				|| (is_string($value) && !empty($value = trim($value)))
				|| is_callable($value))
			{
				$this->m_Title = $value;
				return true;
			}
			return false;
		}
		else
		{
			if (is_callable($this->m_Title))
			{
				$result = ($this->m_Title)($this);
				return is_string($result) ? $result : false;
			}
			return $this->m_Title;
		}
	}
	
	//////////////////////////////////////////////////////////
	// Gestion du contenu HTML additionnel à la balise HEAD //
	//////////////////////////////////////////////////////////
	
	private $m_HeadContent;
	
	public function HeadContent($value = null)
	{
		if ($value !== null)
		{
			if (($value === false)
				|| (is_string($value) && !empty($value = trim($value)))
				|| is_callable($value))
			{
				$this->m_HeadContent = $value;
				return true;
			}
			return false;
		}
		else
		{
			return $this->m_HeadContent;
		}
	}
	
	//////////////////////////////////////////////////////////
	// Gestion du contenu HTML additionnel à la balise HEAD //
	//////////////////////////////////////////////////////////
	
	private $m_BodyContent;
	
	public function BodyContent($value = null)
	{
		if ($value !== null)
		{
			if (($value === false)
				|| (is_string($value) && !empty($value = trim($value)))
				|| is_callable($value))
			{
				$this->m_BodyContent = $value;
				return true;
			}
			return false;
		}
		else
		{
			return $this->m_BodyContent;
		}
	}
	
	//////////////////////////////////////////
	// Méthodes du cycle de vide de l'objet //
	//////////////////////////////////////////
	
	public function __construct($title = null, $cssFiles = null, $jsFiles = null, $headContent = null, $bodyContent = null)
	{
		$this->m_Title = false;
		$this->Title($title);
		$this->TCssJsFiles_Initialize($cssFiles, $jsFiles);
		$this->m_HeadContent = false;
		$this->m_BodyContent = false;
		$this->HeadContent($headContent);
		$this->BodyContent($bodyContent);
	}
}
?>