<?php
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$email = $_POST['email'];
$password = $_POST['password'];
$response = new \stdClass();


$search_query = "SELECT * FROM Users WHERE email = '$email' AND password = '$password'";
$result = $conn->query( $search_query );

if ( $result->num_rows > 0 ) {
    
    $response->code = 200;
    $response->text = "Signed in";
    $echo = json_encode( $response );
    
} else {
    $response->code = 400;
    $response->text = "Invalid Credentials";
    $echo = json_encode( $response );
}
echo $echo;
$conn->close();
