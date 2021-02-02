<?php
session_start();
include_once '../../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$response = new \stdClass();
$id = $_SESSION["userId"];
$exam_ids = json_decode(stripslashes($_POST["jsonArr"]));
$response->result = array();

$query_ids = preg_replace('#\s+#', ',', implode(" ", $exam_ids));

$get_query = "SELECT user_exam_done.*, user_information.fullname, user_information.image_path, learning_progress.progress_percent ,SUM(total) AS 'over', SUM(score) AS 'score'
FROM user_exam_done 
INNER JOIN user_information ON user_exam_done.learner_id = user_information.user_information_id
INNER JOIN enrollment_info ON enrollment_info.learner_id = user_exam_done.learner_id AND enrollment_info.course_id = 109
INNER JOIN learning_progress ON learning_progress.enrollment_id = enrollment_info.enrollment_id
WHERE exam_id IN($query_ids) 
GROUP BY learner_id";

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
