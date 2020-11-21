<?php
$servername = "localhost";
$username = "root";
$password = "behindyou";

$conn = mysqli_connect( $servername, $username, $password );
if ( !$conn ) {
    die( "Connection failed: " . mysqli_connect_error() );
}

// Create database
$sql = "CREATE DATABASE iskolearning";
if ( $conn->query( $sql ) ) {
    echo "Database created successfully ";

    $usersTable = "CREATE TABLE Users (
    id INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(80) NOT NULL,
    password VARCHAR(30) NOT NULL
    );";
    $conn = mysqli_connect( $servername, $username, $password, "iskolearning" );
    if ( $conn->query( $usersTable ) === TRUE ) {
        echo "Table Users created successfully";
    } else {
        echo "Error creating table: " . $conn->error;
    }

} else {
    echo "Error creating database: " . mysqli_error( $conn );
}

mysqli_close( $conn );
?>
