<?php
session_start();
include_once '../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

// $id = $_SESSION["userId"];
$response = new \stdClass();


$data = $_FILES['upload-image']['name'];
$size = $_FILES['upload-image']['size'];


foreach($_FILES['upload-image'] as $result) {
    echo $result, '<br>';
}


$course_id = $_POST['id'];

if (!file_exists("../../courseThumbnails/" . $course_id)) {
    mkdir("../../courseThumbnails/" . $course_id, 0777, true);
} else {
    $files = glob("../../courseThumbnails/" . $course_id . "/*");
    foreach ($files as $file) {
        unlink($file);
    }
}

$target_dir = "../../courseThumbnails/" . $course_id;


if (move_uploaded_file($_FILES['upload-image']['tmp_name'], $target_dir . "/" . $_FILES['upload-image']['name'])) {
    $image_path =  "./courseThumbnails/" . $course_id . "/" . $_FILES['upload-image']['name'];
    $edit_query = "UPDATE Course SET image_path = '$image_path' ";
    if($conn->query( $edit_query )){
        $response->code = 200;
        $response->text = "Thumbnail Successfully edited";
        $echo = json_encode( $response );
    }else{
        $response->code = 400;
    $response->text = "Error uploading";
    $echo = json_encode($response);
    }
} else {
    $response->code = 400;
    $response->text = "Error";
    $echo = json_encode($response);
}
    trigger_error('Invalid query: ' . $conn->error);


echo $echo;
$conn->close();
