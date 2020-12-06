<?php
// session_start();
include_once '../../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

// $forum_id = $_GET['id'];
$forum_id = $_GET['forumId'];
$response = new \stdClass();
// $id = $_SESSION["userId"];
// $questions_array=array();
$response->question=array();

$question_query = "SELECT forum.forum_id, forum.title, forum.text_body, forum.upvote_count, forum.downvote_count, forum.created_datetime, forum.comment_count, user_information.fullname, user_information.username, user_information.user_type
FROM `forum` 
INNER JOIN user_information ON user_information.user_information_id=forum.user_id
WHERE forum_id='$forum_id';";

$result = $conn->query($question_query);

if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        array_push( $response->question,$row);
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