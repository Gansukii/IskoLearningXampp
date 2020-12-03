<?php
session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$email = $_POST['email'];
$password = $_POST['password'];
$response = new \stdClass();

$search_query = "SELECT * FROM User_Information WHERE email = '$email' AND user_password = '$password'";
$result = $conn->query( $search_query );

if ( $result->num_rows > 0 ) {
    while($row = $result->fetch_assoc()){
        $_SESSION["userId"] = $row['user_information_id'];
        $fullname = $row['fullname'];
        $username = $row['username'];
        $user_type = $row['user_type'];
    }
    $response->code = 200;
    $response->text = "Signed in";
    $response->fullname =  $fullname;
    $response->username = $username;
    $response->user_type = $user_type;
    $echo = json_encode( $response );
    
} else {
    $response->code = 400;
    $response->text = "Invalid Credentials";
    $echo = json_encode( $response );
}
echo $echo;
$conn->close();
