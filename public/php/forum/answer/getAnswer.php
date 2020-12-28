<?php
// session_start();
include_once '../../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$forum_id = $_POST['forumId'];
$response = new \stdClass();
// $id = $_SESSION["userId"];
// $questions_array=array();
$response->answers=array();


$ask_query = "SELECT answer.answer_id, answer.forum_id, answer.user_information_id, answer.text_content, answer.upvote_count, answer.answered_datetime, user_information.fullname, user_information.username, user_information.user_type
FROM `answer` 
INNER JOIN user_information ON user_information.user_information_id=answer.user_information_id
WHERE answer.forum_id = $forum_id
ORDER BY answer.upvote_count DESC, answer.answered_datetime DESC";
$result = $conn->query($ask_query);


if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        array_push( $response->answers,$row);
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