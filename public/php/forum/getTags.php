<?php
session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$response = new \stdClass();
$id = $_SESSION["userId"];
$response->tags=array();


$get_query = "SELECT * FROM Tag;";
$result = $conn->query($get_query);

if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        array_push($response->tags, $row);
    }
     $response->code = 200;
    $echo = json_encode( $response );
}else{
    $response->code = 400;
    $response->text = "No tags found in database";
    $echo = json_encode( $response );
    // trigger_error('Invalid query: ' . $conn->error);
}

echo $echo;
$conn->close();