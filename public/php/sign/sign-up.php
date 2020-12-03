<?php
session_start();
include_once '../conn.php';

if ( $conn->connect_error ) {
    die( "Connection Failed". $conn->connect_error );
}

$email = $_POST['email'];
$password = $_POST['password'];
$user_type = $_POST['user_type'];
$fullname = "user" . rand(100,999);
$date = date('Y-m-d');
$last_log = date('Y-m-d H:i:s');
$response = new \stdClass();


$search_query = "SELECT * FROM User_Information WHERE email = '$email'";
$result = $conn->query( $search_query );


if ( $result->num_rows > 0 ) {
    $response->code = 400;
    $response->text = "Email already exists";
    $echo = json_encode( $response );
    echo $echo;
} else {
    $stmt = $conn->prepare( "INSERT INTO User_Information (email, username, fullname, user_password, user_type, last_login_datetime, registration_date) VALUES (?, ?, ?, ?, ?, ?, ?)" );
    $stmt->bind_param( "sssssss", $email, $fullname, $fullname, $password, $user_type, $last_log, $date );
    
    if($stmt->execute()){
        $last_id = $conn->insert_id;
        $search_query = "SELECT * FROM User_Information WHERE user_information_id = $last_id";
        $search = $conn->query( $search_query );
        if ( $search->num_rows > 0 ) {
            while($row = $search->fetch_assoc()){
                $_SESSION["userId"] = $row['user_information_id'];
                $fullname = $row['fullname'];
                $username = $row['username'];
                $user_type = $row['user_type'];
            }
            $response->code = 200;
            $response->fullname =  $fullname;
            $response->username = $username;
            $response->user_type = $user_type;
            $echo = json_encode( $response );
        }
        $response->code = 200;
        $response->text = "Account Created";
        $echo = json_encode( $response );
        echo $echo;
        $stmt->close();
    }
    else{
        trigger_error('Invalid query: ' . $conn->error);
    }
}
$conn->close();
