<?php
// Hostinger
// $dbhost = "localhost";
// $dbuser = "u327374461_edumechanic_un";
// $dbpass = "B8nNWK5]O:g";
// $dbname = "u327374461_edumechanic_db";

// Localhost
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "edumechanic_db";

if (!$con = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname)) {
    die("failed to connect!");
}