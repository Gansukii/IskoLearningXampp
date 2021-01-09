<?php
session_start();
include_once '../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$data = $_GET['data'];
$course_title = $data['course_title'];
$course_brief = $data['course_brief'];
$creation_datetime = date('Y-m-d H:i:s');
$units = $data['units'];
$prerequisite_courses = $data['prerequisite'];
$num_of_chapter = $data['chapter_number'];
$category = $data['category'];



$response = new \stdClass();
$id = $_SESSION["userId"];



$add_query = "INSERT INTO Course (educator_id, course_title, course_brief, creation_datetime, units, prerequisite_courses,num_of_chapter, category) VALUES ('$id', '$course_title', '$course_brief', '$creation_datetime', '$units' ,'$prerequisite_courses' ,'$num_of_chapter' ,'$category');";


if ($conn->query($add_query)) {
    $last_id = mysqli_insert_id($conn);
    $response->code = 200;
    $response->last_id = $last_id;
    $echo = json_encode($response);
} else {
    $response->code = 400;
    $response->text = "Server Error";
    $echo = json_encode($response);
    // trigger_error('Invalid query: ' . $conn->error);
}

echo $echo;
$conn->close();
