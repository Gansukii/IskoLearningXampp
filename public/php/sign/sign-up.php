<?php
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$email = $_POST['email'];
$password = $_POST['password'];
$response = new \stdClass();


$search_query = "SELECT * FROM Users WHERE email = '$email'";
$result = $conn->query( $search_query );

if ( $result->num_rows > 0 ) {
    
    $response->code = 400;
    $response->text = "Email already exists";
    $echo = json_encode( $response );
    echo $echo;
} else {

    $stmt = $conn->prepare( "INSERT INTO Users (email, password) VALUES (?, ?)" );
    $stmt->bind_param( "ss", $email, $password );

    $stmt->execute();

    $response->code = 200;
    $response->text = "Account Created";
    $echo = json_encode( $response );
    echo $echo;
    $stmt->close();

}
$conn->close();
