<?php
session_start();
include_once '../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$response = new \stdClass();
$category = $_POST["category"];
$response->result = array();


$get_query = "SELECT course.*, user_information.fullname
FROM `course` 
INNER JOIN user_information ON user_information.user_information_id=course.educator_id
WHERE category = '$category'";
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
