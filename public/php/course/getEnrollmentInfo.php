<?php
session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$response = new \stdClass();
$id = $_SESSION["userId"];
$course_id = $_POST["courseId"];
$response->result=array();


$get_query = "SELECT * ,user_information.fullname
FROM `Enrollment_Info` 
INNER JOIN learning_progress ON Enrollment_Info.enrollment_id = learning_progress.enrollment_id
INNER JOIN user_information ON user_information.user_information_id = Enrollment_Info.learner_id
WHERE Enrollment_Info.learner_id = '$id' AND Enrollment_Info.course_id = '$course_id'";
$result = $conn->query($get_query);


if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
        array_push( $response->result, $row);
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