<?php
// session_start();
include_once '../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$response = new \stdClass();
// $id = $_SESSION["userId"];
$examId = $_POST['examId'];
$questions_array = array();
$response->questions = array();


$get_query = "SELECT *
FROM `question` 
WHERE exam_id = '$examId'
ORDER BY question_number ";
$result = $conn->query($get_query);


if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        array_push($response->questions, $row);
    }
    $response->code = 200;
    $echo = json_encode($response);
} else {
    $response->code = 400;
    $response->text = "No data found";
    $echo = json_encode($response);
}

echo $echo;
$conn->close();
