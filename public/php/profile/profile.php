<?php
session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$fullname = $_POST['fullname'];
$username = $_POST['username'];
$response = new \stdClass();
$id = $_SESSION["userId"];

$edit_query = "UPDATE User_Information SET fullname = '$fullname', username = '$username' WHERE user_information_id = '$id'";

if($conn->query( $edit_query )){
     $response->code = 200;
    $response->text = "Profile Successfully edited";
    $echo = json_encode( $response );
}else{
    $response->code = 400;
    $response->text = "Error! Edit unsuccessful";
    $echo = json_encode( $response );
}

echo $echo;
$conn->close();
