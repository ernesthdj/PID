<?php
include("index.php");
var_dump(PID_PATH_TO_ROOT);
var_dump("./dir1/dir2/page12.php", PID_PathTo("./dir1/dir2/page12.php"));
var_dump("/dir1/dir2", PID_PathTo("/dir1/dir2"));
var_dump("dir.0", PID_PathTo("dir.0"));
var_dump("dir1/truc.php", PID_PathTo("dir1/truc.php"));
var_dump("dir1/dir2/?nom=duchemin&prenom=robert", PID_PathTo("dir1/dir2/?nom=duchemin&prenom=robert"));
PID_Include("dir1/dir2/a_inclure.php");
?>