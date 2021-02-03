<?php
session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$response = new \stdClass();
$id = $_SESSION["userId"];
// $learner_id = $_POST["learner_id"];
$response->result=array();


$get_query = "SELECT user_exam_done.*, exam.title, exam.total_points FROM user_exam_done 
INNER JOIN exam ON exam.exam_id = user_exam_done.exam_id

WHERE learner_id = '$id'";
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