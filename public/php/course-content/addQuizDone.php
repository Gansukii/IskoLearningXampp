<?php
session_start();
include_once '../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$examId = $_POST['examId'];
$current_chapter = $_POST['currentChap'];
$current_chapter_title = $_POST['currentChapName'];
$enrollment_id = $_POST['enrollmentId'];
$score = $_POST['score'];
$over = $_POST['over'];
$progress_percent = $_POST['progress_percent'];
$date = date('Y-m-d H:i:s');
$response = new \stdClass();
$id = $_SESSION["userId"];

// if ($progress_percent != 100) {
    $add_query = "INSERT INTO user_exam_done (learner_id, exam_id, score, total, submit_datetime) VALUES ('$id', '$examId', '$score', '$over', '$date');";

    if ($progress_percent == 100) {
        $add_query .= " UPDATE learning_progress SET text_status = 'CourseDone', progress_percent = '$progress_percent', current_chapter = '$current_chapter', current_chapter_title = '$current_chapter_title', user_status = 'i' WHERE enrollment_id = '$enrollment_id'; ";
    } else {
        $add_query .= " UPDATE learning_progress SET text_status = 'CourseDone', progress_percent = '$progress_percent', current_chapter = '$current_chapter', current_chapter_title = '$current_chapter_title' WHERE enrollment_id = '$enrollment_id'; ";
    }

// echo $add_query;
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
// }
$conn->close();
