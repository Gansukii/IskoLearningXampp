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
                $add_chapter_query .= " INSERT INTO Course_Chapter_Content (course_chapter_id, header_title, item_id, content_type) VALUES ( LAST_INSERT_ID(), '$contentItem[title]', '$contentItem[itemId]', 1); ";
            } else {
                $add_chapter_query .= " INSERT INTO Course_Chapter_Content (course_chapter_id, header_title, item_id, content_type) VALUES ( LAST_INSERT_ID(),'$contentItem[title]', '$contentItem[itemId]', 2); ";
            }
            // echo $contentItem['itemId'];
            //     echo $contentItem['video'];
            //     echo "---------------";
        }

        echo "looping thru";
    }
    if ($conn->multi_query($add_chapter_query)) {
        echo $add_chapter_query;
        // trigger_error('Invalid query: ' . $conn->error);

        $response->code = 200;
        $response->last_id = $last_course_id;
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
