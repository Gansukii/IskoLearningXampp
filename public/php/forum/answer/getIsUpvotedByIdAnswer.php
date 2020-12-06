<?php
session_start();
include_once '../../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$forum_id = $_POST['forumId'];
$response = new \stdClass();
$id = $_SESSION["userId"];
// $response->is_upvoted=array();


$is_upvoted_query = "SELECT * FROM Upvote WHERE user_information_id = $id AND forum_id = '$forum_id';";
$result = $conn->query($is_upvoted_query);

if($result->num_rows > 0){
    // while($row = $result->fetch_assoc()){
    //     array_push($response->is_upvoted, $row);
    // }
     $response->code = 200;
     $response->upvoted= 1;
    $echo = json_encode( $response );
}else{
    $response->code = 400;
    $response->text = "No user upvotes found";
    $response->upvoted= 0;
    $echo = json_encode( $response );
    // trigger_error('Invalid query: ' . $conn->error);
}

echo $echo;
$conn->close();