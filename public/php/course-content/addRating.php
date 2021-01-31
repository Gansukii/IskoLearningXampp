<?php
session_start();
include_once '../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$review_number = $_POST['review_number'];
$review_text = $_POST['review_text'];
$course_id = $_POST['course_id'];

$date = date('Y-m-d H:i:s');
$response = new \stdClass();
$id = $_SESSION["userId"];


$add_query = "INSERT INTO rating (course_id, learner_id, star_equivalent_id, feedback_text, submission_date) VALUES ('$course_id', '$id', '$review_number', '$review_text', '$date');

UPDATE course SET review_count = review_count + 1 WHERE course_id = '$course_id';

UPDATE course SET overall_rating = (SELECT SUM(star_equivalent_id) FROM rating WHERE course_id = '$course_id') / ( (SELECT course.review_count WHERE course.course_id = '$course_id') * 5) * 5 WHERE course_id = '$course_id'
";


if ($conn->multi_query($add_query)) {
    $response->code = 200;
    $echo = json_encode($response);
} else {
    $response->code = 400;
    $response->text = "Server Error";
    $echo = json_encode($response);
    trigger_error('Invalid query: ' . $conn->error);
}

echo $echo;

$conn->close();
