<?php
session_start();
include_once '../../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$forum_id = $_POST['forumId'];
$text_content = $_POST['textContent'];
$date = date('Y-m-d H:i:s');
$response = new \stdClass();
$id = $_SESSION["userId"];



$ask_query = "INSERT INTO Answer (forum_id, user_information_id, answered_datetime, text_content) VALUES ('$forum_id', $id, '$date', '$text_content');
UPDATE forum SET comment_count = comment_count + 1 WHERE forum_id = '$forum_id';";

if($conn->multi_query( $ask_query )){
     $response->code = 200;
    $echo = json_encode( $response );
}else{
    $response->code = 400;
    $response->text = "Server Error";
    $echo = json_encode( $response );
    // trigger_error('Invalid query: ' . $conn->error);
}

echo $echo;
$conn->close();