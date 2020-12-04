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

    $UsersTable = "CREATE TABLE `User_Information` (
  `user_information_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `user_id` INT,
  `user_type` CHAR(1) NOT NULL,
  `email` VARCHAR(50) NOT NULL UNIQUE,
  `username` VARCHAR(20) NOT NULL UNIQUE,
  `fullname` VARCHAR(256) DEFAULT ' ',
  `date_of_birth` DATE,
  `age` TINYINT,
  `phone_no` VARCHAR(15),
  `status` CHAR(1) NOT NULL DEFAULT 0,
  `gender` CHAR(1),
  `location` VARCHAR(1000),
  `introduction_brief` VARCHAR(1000),
  `department` VARCHAR(100) DEFAULT '',
  `user_password` VARCHAR(50) NOT NULL,
  `image_id` INT,
  `last_login_datetime` DATETIME NOT NULL,
  `last_login_ip` VARCHAR(50), 
  `registration_date` DATE NOT NULL);";

    $ForumTable = " CREATE TABLE `Forum` (
  `forum_id` INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `user_id` INT(6) NOT NULL,
  `text_body` VARCHAR(1000),
  `upvote_count` MEDIUMINT NOT NULL DEFAULT 0,
  `downvote_count` MEDIUMINT NOT NULL DEFAULT 0,
  `created_datetime` DATETIME NOT NULL
  );";

   $upvoteTable = "CREATE TABLE `Upvote` (
  `upvote_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `forum_id` INT NOT NULL,
  `answer_id` INT,
  `user_information_id` INT NOT NULL
   );";


    $conn = mysqli_connect( $servername, $username, $password, "iskolearning" );
    if ( $conn->query( $UsersTable ) === TRUE && $conn->query(($ForumTable))) {
        echo "Tables created successfully";
    } else {
        echo "Error creating table: " . $conn->error;

    }

} else {
    echo "Error creating database: " . mysqli_error( $conn );
}

mysqli_close( $conn );
?>

