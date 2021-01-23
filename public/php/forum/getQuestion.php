<?php
// session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$response = new \stdClass();
// $id = $_SESSION["userId"];
$questions_array=array();
$response->questions=array();


$ask_query = "SELECT forum.forum_id, forum.title, forum.text_body, forum.upvote_count, forum.downvote_count, forum.created_datetime, forum.comment_count, user_information.fullname, user_information.username, user_information.user_type, user_information.image_path
FROM `forum` 
INNER JOIN user_information ON user_information.user_information_id=forum.user_id
ORDER BY forum.upvote_count DESC, forum.created_datetime DESC";
$result = $conn->query($ask_query);


if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        array_push( $response->questions,$row);
    }
    $response->code = 200;
    $echo = json_encode( $response );
}else{
    $response->code = 400;
    $response->text = "No data found";
    $echo = json_encode( $response );
}

echo $echo;
$conn->close();