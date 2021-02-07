<?php
// session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$response = new \stdClass();
$tag_id = $_POST["tag_id"];
$questions_array=array();
$response->questions=array();


$ask_query = "SELECT forum.forum_id, forum.title, forum.text_body, forum.upvote_count, forum.downvote_count, forum.created_datetime, forum.comment_count, user_information.fullname, user_information.username, user_information.user_type, user_information.image_path
FROM `forum_tag` 
INNER JOIN forum ON forum_tag.forum_id = forum.forum_id
INNER JOIN user_information ON user_information.user_information_id=forum.user_id
WHERE forum_tag.tag_id = '$tag_id'
ORDER BY forum.upvote_count DESC, forum.created_datetime DESC";
$result = $conn->query($ask_query);


if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        $tags = $conn->query("SELECT tag.tag_text FROM `forum_tag` INNER JOIN tag ON tag.tag_id = forum_tag.tag_id WHERE forum_id = '$row[forum_id]'");
        $row['tags'] = array();
        while($tag_row = $tags->fetch_assoc()){
            array_push($row['tags'], $tag_row['tag_text']);
        }

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