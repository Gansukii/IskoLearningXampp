<?php
session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$response = new \stdClass();
$id = $_SESSION["userId"];
// $questions_array=array();
// $response->result=array();


$get_query = "SELECT *
FROM `Enrollment_Info` 
WHERE learner_id = '$id";
$result = $conn->query($get_query);


if($result){
    // while($row = $result->fetch_assoc()){
    //     array_push( $response->result,$row);
    // }
    $response->code = 200;
    $echo = json_encode( $response );
}else{
    $response->code = 400;
    $response->text = "No data found";
    $echo = json_encode( $response );
}

echo $echo;
$conn->close();