$(document).ready(function()
{
	console.log("PID framework is starting...");
	console.log("* path to root      : " + $("body").data("path-to-root"));
	console.log("* path to framework : " + $("body").data("path-to-pid"));
	//CApplication.Instance().FaireQuelqueChose();
});

function CApplication()
{
	this.m_Bidule = "Truc";
}

CApplication.prototype.Afficher = function()
{
	console.log("J'ai un bidule : " + this.m_Bidule);
};
