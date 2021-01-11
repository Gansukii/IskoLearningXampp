<?php
session_start();
include_once '../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$response = new \stdClass();
$id = $_SESSION["userId"];
$course_id = $_POST["courseId"];
$date = date('Y-m-d H:i:s');

// $questions_array=array();
// $response->result=array();


$enroll_query = "INSERT INTO enrollment_info (learner_id, course_id, enrollment_date) VALUES ('$id', '$course_id', '$date'); 
INSERT INTO learning_progress ( enrollment_id, text_status, begin_stamp ) VALUES ( LAST_INSERT_ID(), 'Resume', '$date');";

if ($conn->multi_query($enroll_query)) {

    $response->code = 200;
    $echo = json_encode($response);
} else {
    $response->code = 400;
    $response->text = "No data found";
    $echo = json_encode($response);
}

echo $echo;
$conn->close();
