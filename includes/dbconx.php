<?php
$con=mysqli_connect("localhost", "root","root","music_online");
//check connection
if (mysqli_connect_errno()){
    die("Failed to connect to MySQL: " . mysqli_connect_error());
}
?>