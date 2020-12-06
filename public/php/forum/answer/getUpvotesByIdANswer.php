<?php
session_start();
include_once '../../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$response = new \stdClass();
$id = $_SESSION["userId"];
$response->is_upvoted=array();


$is_upvoted_query = "SELECT answer_id FROM Upvote WHERE user_information_id = $id AND answer_id IS NOT NULL;";
$result = $conn->query($is_upvoted_query);

if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        array_push($response->is_upvoted, $row);
    }
    $response->code = 200;
    $echo = json_encode( $response );
}else{
    $response->code = 400;
    $response->text = "No user upvotes found";
    $echo = json_encode( $response );
    // trigger_error('Invalid query: ' . $conn->error);
}

echo $echo;
$conn->close();