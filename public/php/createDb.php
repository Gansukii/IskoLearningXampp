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

    $Tables = "CREATE TABLE `User_Information` (
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
  `image_path` VARCHAR(100),
  `last_login_datetime` DATETIME NOT NULL,
  `last_login_ip` VARCHAR(50), 
  `registration_date` DATE NOT NULL);
  
   CREATE TABLE `Forum` (
  `forum_id` INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `user_id` INT(6) NOT NULL,
  `text_body` VARCHAR(1000),
  `upvote_count` MEDIUMINT NOT NULL DEFAULT 0,
  `downvote_count` MEDIUMINT NOT NULL DEFAULT 0,
  `comment_count` MEDIUMINT NOT NULL DEFAULT 0,
  `created_datetime` DATETIME NOT NULL
  );
  
  CREATE TABLE `Upvote` (
  `upvote_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `forum_id` INT NOT NULL,
  `answer_id` INT,
  `user_information_id` INT NOT NULL
   );
   
   CREATE TABLE `Answer` (
  `answer_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `forum_id` INT NOT NULL,
  `user_information_id` INT,
  `answered_datetime` DATETIME NOT NULL,
  `text_content` VARCHAR(1000) NOT NULL,
  `upvote_count` MEDIUMINT NOT NULL DEFAULT 0,
  `downvote_count` MEDIUMINT NOT NULL DEFAULT 0
);

CREATE TABLE `Course` (
  `course_id` INT AUTO_INCREMENT NOT NULL UNIQUE,
  `educator_id` INT NOT NULL,
  `creation_datetime` DATETIME NOT NULL,
  `course_title` VARCHAR(200) NOT NULL DEFAULT '',
  `course_brief` VARCHAR(4000) NOT NULL DEFAULT '',
  `category` VARCHAR(200) NOT NULL DEFAULT '',
  `units` TINYINT NOT NULL DEFAULT 3,
  `overall_rating` FLOAT(2,1) DEFAULT 0,
  `review_count` INT DEFAULT 0,
  `total_enrolled_learners` INT DEFAULT 0,
  `prerequisite_courses` VARCHAR(200) NULL,
  `courses_fee` DECIMAL(10,2) DEFAULT 0,
  `num_of_chapter` TINYINT NOT NULL,
  `image_path` VARCHAR(100),
  PRIMARY KEY (`course_id`)
);";
   


    $conn = mysqli_connect( $servername, $username, $password, "iskolearning" );
    if ( $conn->multi_query( $Tables ) === TRUE ) {
        echo "Tables created successfully";
    } else {
        echo "Error creating table: " . $conn->error;

    }

} else {
    echo "Error creating database: " . mysqli_error( $conn );
}

mysqli_close( $conn );
?>

