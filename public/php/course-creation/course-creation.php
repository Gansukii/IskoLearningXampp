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

$contents = $_GET['contents'];




// foreach($contents as $x => $y){
//     // echo "$x =-==== $y";
//     echo $y['chapter_number'];
//     echo $y['chapter_description'];
//     echo $y['video_count'];
//     echo $y['quiz_count'];
//     echo "---------------";
//     // foreach($contents[$x] as $contentItems){
//     //     echo $contentItems['video_count'];
//         // echo $contentItems['quiz_count'];
//     // }
//     foreach($y['chapter_contents'] as $contentItem){
//         echo $contentItem['itemId'];
//         echo $contentItem['video'];
//         echo "---------------";
//     }
// }   


$response = new \stdClass();
$id = $_SESSION["userId"];



$add_query = "INSERT INTO Course (educator_id, course_title, course_brief, creation_datetime, units, prerequisite_courses,num_of_chapter, category) VALUES ('$id', '$course_title', '$course_brief', '$creation_datetime', '$units' ,'$prerequisite_courses' ,'$num_of_chapter' ,'$category');";


if ($conn->query($add_query)) {
    $last_course_id = mysqli_insert_id($conn);
    $add_chapter_query = '';
    foreach ($contents as $x => $y) {
        // echo $y['chapter_number'];
        // echo $y['chapter_description'];
        // echo $y['video_count'];
        // echo $y['quiz_count'];

        $add_chapter_query .= "INSERT INTO Course_Chapter (course_id, chapter_number, chapter_title, chapter_description, num_of_video, num_of_quiz) VALUES ('$last_course_id', '$y[chapter_number]', '$y[chapter_title]', '$y[chapter_description]', '$y[video_count]' ,'$y[quiz_count]'); ";



        foreach ($y['chapter_contents'] as $contentItem) {
            if ($contentItem['video'] == "true") {
                $add_chapter_query .= " INSERT INTO Course_Chapter_Content (course_chapter_id, header_title, item_id, content_type) VALUES ( (SELECT MAX(course_chapter_id) FROM course_chapter), '$contentItem[title]', '$contentItem[itemId]', 1); 
                INSERT INTO Video (content_id, title, description, video_link_id) VALUES (LAST_INSERT_ID(), '$contentItem[title]', '$contentItem[description]', '$contentItem[videoId]');";
            } else {
                $question_len = (int)count($contentItem['questions']);

                $add_chapter_query .= " INSERT INTO Course_Chapter_Content (course_chapter_id, header_title, item_id, content_type) VALUES ( (SELECT MAX(course_chapter_id) FROM course_chapter),'$contentItem[title]', '$contentItem[itemId]', 2); 
                INSERT INTO Exam ( content_id, title, instructions, total_points) VALUES (LAST_INSERT_ID(), '$contentItem[title]', '$contentItem[instructions]', $question_len);";

                
                foreach ($contentItem['questions'] as $question_key => $q_val) {
                    $add_chapter_query .= " INSERT INTO Question (exam_id, question_text, question_number, question_answer) VALUES ( (SELECT MAX(exam_id) FROM Exam), '$q_val[question]', $question_key, '$q_val[answer]'); "; 
                }
            }
            // echo $contentItem['itemId'];
            //     echo $contentItem['video'];
            //     echo "---------------";
        }
    }

    if ($conn->multi_query($add_chapter_query)) {
        $response->code = 200;
        $response->last_id = $last_course_id;
        $echo = json_encode($response);
    } else {
        $response->code = 400;
        $response->text = "Server Error";
        $echo = json_encode($response);
    }
} else {
    $response->code = 400;
    $response->text = "Server Error";
    $echo = json_encode($response);
    // trigger_error('Invalid query: ' . $conn->error);
}

echo $echo;
$conn->close();
