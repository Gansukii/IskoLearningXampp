<?php
// session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$response = new \stdClass();
// $id = $_SESSION["userId"];
$keyword = $_POST['keyword'];
$questions_array=array();
$response->result=array();



$get_query = "SELECT forum.forum_id, forum.title, forum.text_body, forum.upvote_count, forum.downvote_count, forum.created_datetime, forum.comment_count, user_information.fullname, user_information.username, user_information.user_type, user_information.image_path
FROM `forum` 
INNER JOIN user_information ON user_information.user_information_id=forum.user_id
WHERE forum.title REGEXP '$keyword'";
$result = $conn->query($get_query);


if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        array_push( $response->result,$row);
    }
    $response->code = 200;
    $response->date_now = date('Y-m-d H:i:s');
    $echo = json_encode( $response );
}else{
    $response->code = 400;
    $response->text = "No data found";
    $echo = json_encode( $response );
}

echo $echo;
$conn->close();