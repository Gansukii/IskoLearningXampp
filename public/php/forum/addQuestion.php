<?php
session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$question_title = $_POST['questionTitle'];
$question_body = $conn -> real_escape_string($_POST['questionBody']);
$date = date('Y-m-d H:i:s');
$response = new \stdClass();
$id = $_SESSION["userId"];



$ask_query = "INSERT INTO Forum (title, user_id, text_body, created_datetime) VALUES ('$question_title', $id, '$question_body', '$date')";

if($conn->query( $ask_query )){
     $response->code = 200;
    $echo = json_encode( $response );
}else{
    $response->code = 400;
    $response->text = "Server Error";
    $echo = json_encode( $response );
    trigger_error('Invalid query: ' . $conn->error);
}

echo $echo;
$conn->close();