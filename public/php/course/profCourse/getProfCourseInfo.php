<?php
session_start();
include_once '../../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$response = new \stdClass();
$id = $_SESSION["userId"];
$course_id = $_POST["courseId"];
$response->result = array();
$response->chapters = array();
$response->contents = new \stdClass();
$response->exam_done = new \stdClass();

$get_query = "SELECT * 
FROM `course` 
WHERE course_id = '$course_id'";
$result = $conn->query($get_query);


if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        array_push($response->result, $row);
        $get_chapter_query = "SELECT * FROM course_chapter WHERE course_id = $course_id ORDER BY chapter_number;";
        $chapters = $conn->query($get_chapter_query);
        while ($chapter_row = $chapters->fetch_assoc()) {
            // array_push($response->chapters, $chapter_row);
            $course_chapter_id = $chapter_row["course_chapter_id"];
            $chapter_number =  $chapter_row["chapter_number"];
            $get_contents_array = "SELECT course_chapter_content.*, exam.exam_id, exam.total_points, exam.title AS exam_title FROM course_chapter_content LEFT JOIN exam ON course_chapter_content.content_id = exam.content_id 
            WHERE course_chapter_id =  $course_chapter_id AND content_type = 2 ORDER BY item_id";
            $chapter_contents = $conn->query($get_contents_array);
            $response->contents->$chapter_number = array();
            while ($content_row = $chapter_contents->fetch_assoc()) {
                array_push($response->contents->$chapter_number, $content_row);
                $exam_id = $content_row['exam_id'];
                $get_exam_query = "SELECT COUNT(*) AS '$exam_id' FROM user_exam_done WHERE exam_id = $exam_id;";
                $students_exam = $conn->query($get_exam_query);
                while ($students_exam_done = $students_exam->fetch_assoc()) {
                    // array_push($response->exam_done, $students_exam_done);
                    $response->exam_done->$exam_id = $students_exam_done;
                }
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
