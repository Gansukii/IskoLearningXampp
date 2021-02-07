<?php
session_start();
include_once '../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$question_title = $_POST['questionTitle'];
$tags = $_POST['tags'];
$question_body = $conn->real_escape_string($_POST['questionBody']);
$date = date('Y-m-d H:i:s');
$response = new \stdClass();
$id = $_SESSION["userId"];
$tag_id = "";

$ask_query = "INSERT INTO Forum (title, user_id, text_body, created_datetime) VALUES ('$question_title', $id, '$question_body', '$date')";
$conn->query($ask_query);
$forum_id = $conn->insert_id;

foreach ($tags as $tag) {
    $tag = strtolower($tag);
    $exist = $conn->query(" SELECT * FROM tag WHERE tag_text = '$tag' LIMIT 1");
    if ($exist->num_rows > 0) {
        while ($row = $exist->fetch_assoc()) {
            $tag_id = $row['tag_id'];
        }
    } else {
        $add_query = "INSERT INTO tag (tag_text) VALUES ('$tag')";
        $conn->query($add_query);
        $tag_id = $conn->insert_id;
    }
    $add_forum_tag_query = "INSERT INTO forum_tag (tag_id, forum_id) VALUES ('$tag_id', '$forum_id')";
    $conn->query($add_forum_tag_query);
}

// $ask_query = "INSERT INTO Forum (title, user_id, text_body, created_datetime) VALUES ('$question_title', $id, '$question_body', '$date')";

// if($conn->query( $ask_query )){
//      $response->code = 200;
//     $echo = json_encode( $response );
// }else{
//     $response->code = 400;
//     $response->text = "Server Error";
//     $echo = json_encode( $response );
//     trigger_error('Invalid query: ' . $conn->error);
// }

$response->code = 200;
$echo = json_encode($response);
echo $echo;

$conn->close();
