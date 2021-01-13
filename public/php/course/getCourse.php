<?php
session_start();
include_once '../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$response = new \stdClass();
$id = $_SESSION["userId"];
$course_id = $_POST["courseId"];
$response->result = array();
$response->chapters = array();
$response->contents = new \stdClass();


$get_query = "SELECT *
FROM `Enrollment_Info` 
WHERE learner_id = '$id";
$result = $conn->query($get_query);


$get_query = "SELECT *, user_information.fullname FROM course INNER JOIN user_information ON user_information.user_information_id=course.educator_id WHERE course_id = $course_id;";
$result = $conn->query($get_query);


if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        array_push($response->result, $row);
        $get_chapter_query = "SELECT * FROM course_chapter WHERE course_id = $course_id ORDER BY chapter_number;";
        $chapters = $conn->query($get_chapter_query);
        while ($chapter_row = $chapters->fetch_assoc()) {
            array_push($response->chapters, $chapter_row);
            $course_chapter_id = $chapter_row["course_chapter_id"];
            $chapter_number =  $chapter_row["chapter_number"];
            $get_contents_array = " SELECT course_chapter_content.*, exam.total_points FROM course_chapter_content LEFT JOIN exam ON course_chapter_content.content_id = exam.content_id WHERE course_chapter_id =  $course_chapter_id ORDER BY item_id";
            $chapter_contents = $conn->query($get_contents_array);
            $response->contents->$chapter_number = array();
            while ($content_row = $chapter_contents->fetch_assoc()) {
                 array_push($response->contents->$chapter_number, $content_row);
            }
        }
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
