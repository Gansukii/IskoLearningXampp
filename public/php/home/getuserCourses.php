<?php
session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$response = new \stdClass();
$id = $_SESSION["userId"];
$questions_array=array();
$response->result=array();


$get_query = "SELECT course.course_id, course.educator_id, course.creation_datetime, course.course_title, course.course_brief, course.image_path, user_information.fullname
FROM `enrollment_info` 
INNER JOIN course ON enrollment_info.course_id=course.course_id
INNER JOIN user_information ON user_information.user_information_id=course.educator_id
WHERE enrollment_info.learner_id = '$id'";
$result = $conn->query($get_query);


if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        array_push( $response->result,$row);
    //    print_r($row);
    }
    $response->code = 200;
    // $response->date_now = date('Y-m-d H:i:s');
    $echo = json_encode( $response );
}else{
    $response->code = 400;
    $response->text = "No data found";
    $echo = json_encode( $response );
}

echo $echo;
$conn->close();