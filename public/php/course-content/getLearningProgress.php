<?php
// session_start();
include_once '../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$response = new \stdClass();
// $id = $_SESSION["userId"];
$enrollment_id = $_POST['enrollment_id'];
// $questions_array = array();
$response->result = array();


$get_query = "SELECT progress_percent
FROM `learning_progress` 
WHERE enrollment_id = '$enrollment_id'";
$result = $conn->query($get_query);


if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        array_push($response->result, $row);
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
