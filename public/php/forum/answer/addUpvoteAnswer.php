<?php
session_start();
include_once '../../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$forum_id = $_POST['forumId'];
$answer_id = $_POST['answerId'];
$total_upvotes = $_POST['totalUpvote'];
$add = $_POST['add'];
$response = new \stdClass();
$id = $_SESSION["userId"];


if($add == 1){
    $upvote_query = "INSERT INTO Upvote (forum_id, answer_id, user_information_id) VALUES ('$forum_id', '$answer_id',$id);
    UPDATE Answer SET upvote_count = upvote_count + 1 WHERE forum_id = '$forum_id' AND answer_id = '$answer_id'";
}
else{
    $upvote_query = "DELETE FROM Upvote WHERE answer_id = '$answer_id' AND user_information_id = '$id' AND forum_id = '$forum_id';
    UPDATE Answer SET upvote_count = upvote_count - 1 WHERE forum_id = '$forum_id' AND answer_id = '$answer_id'";
}

if($conn->multi_query( $upvote_query )){
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