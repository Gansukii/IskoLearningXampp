<?php
session_start();
include_once '../conn.php';

if ($conn->connect_error) {
    die("Connection Failed" . $conn->connect_error);
}

$id = $_SESSION["userId"];
$response = new \stdClass();

if (!file_exists("../../profileImages/" . $id)) {
    mkdir("../../profileImages/" . $id, 0777, true);
} else {
    $files = glob("../../profileImages/" . $id . "/*");
    foreach ($files as $file) {
        unlink($file);
    }
}


$target_dir = "../../profileImages/" . $id;

$data = $_FILES['upload-image']['name'];
$size = $_FILES['upload-image']['size'];

if (move_uploaded_file($_FILES['upload-image']['tmp_name'], $target_dir . "/" . $_FILES['upload-image']['name'])) {
    $image_path =  "./profileImages/" . $id . "/" . $_FILES['upload-image']['name'];
    $edit_query = "UPDATE User_Information SET image_path = '$image_path'";
    if($conn->query( $edit_query )){
        $response->code = 200;
          $response->image_path = $image_path;
        $response->text = "Profile Successfully edited";
        $echo = json_encode( $response );
    }
} else {
    $response->code = 400;
    $response->text = "Error! Edit unsuccessful";
    $echo = json_encode($response);
}

echo $echo;
$conn->close();
