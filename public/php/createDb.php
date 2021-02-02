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
);

CREATE TABLE `Course_Chapter` (
  `course_chapter_id` INT AUTO_INCREMENT NOT NULL UNIQUE,
  `course_id` INT NOT NULL,
  `chapter_number` TINYINT NOT NULL,
  `chapter_title` VARCHAR(150) NOT NULL,
  `chapter_description` VARCHAR(500) NOT NULL DEFAULT '',
  `num_of_reading` TINYINT NOT NULL DEFAULT 0,
  `num_of_video` TINYINT NOT NULL DEFAULT 0,
  `num_of_quiz` TINYINT NOT NULL DEFAULT 0,
  `num_of_assignment` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`course_chapter_id`),
  INDEX(course_id),
  FOREIGN KEY (course_id) REFERENCES Course(course_id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE TABLE `Course_Chapter_Content` (
  `content_id` INT AUTO_INCREMENT NOT NULL UNIQUE,
  `course_chapter_id` INT NOT NULL,
  `header_title` VARCHAR(200) NOT NULL,
  `item_id` VARCHAR(100) NOT NULL,
  `content_type` INT NOT NULL,
  PRIMARY KEY (`content_id`),
  INDEX (course_chapter_id),
  FOREIGN KEY (course_chapter_id) REFERENCES Course_Chapter(course_chapter_id)
    ON DELETE CASCADE 
    -- ON UPDATE CASCADE
)

CREATE TABLE `Video` (
  `video_id` INT AUTO_INCREMENT NOT NULL UNIQUE,
  `content_id` INT,
  `title` VARCHAR(200) NOT NULL,
  `description` VARCHAR(1000),
  `video_link_id` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`video_id`),
  INDEX (content_id),
  FOREIGN KEY (content_id) REFERENCES Course_Chapter_Content(content_id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE TABLE `Exam` (
  `exam_id` INT AUTO_INCREMENT NOT NULL UNIQUE,
  `content_id` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `instructions` VARCHAR(400) NOT NULL,
  `weighted_grade` FLOAT(2,2) NOT NULL DEFAULT 0,
  `time_limit` TIME,
  `total_points` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`exam_id`),
  INDEX (content_id),
  FOREIGN KEY (content_id) REFERENCES Course_Chapter_Content(content_id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
)

CREATE TABLE `Question` (
  `question_id` INT AUTO_INCREMENT NOT NULL UNIQUE,
  `exam_id` INT NOT NULL,
  `question_text` VARCHAR(2000) NOT NULL,
  `question_number` TINYINT NOT NULL,
  `point_equivalent` TINYINT NOT NULL DEFAULT 1,
  `question_answer` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`question_id`),
  INDEX (exam_id),
  FOREIGN KEY (exam_id) REFERENCES Exam(exam_id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE TABLE `Enrollment_Info` (
  `enrollment_id` INT AUTO_INCREMENT NOT NULL UNIQUE,
  `learner_id` INT NOT NULL,
  `course_id` INT NOT NULL, 
  `enrollment_date` DATE NOT NULL,
  `is_paid` CHAR(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`enrollment_id`),
  INDEX(learner_id),
  FOREIGN KEY (learner_id) REFERENCES user_information(user_information_id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  INDEX(course_id),
  FOREIGN KEY (course_id) REFERENCES Course(course_id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE TABLE `Learning_Progress` (
  `learning_progress_id` INT AUTO_INCREMENT NOT NULL UNIQUE,
  `enrollment_id` INT NOT NULL,
  `text_status` VARCHAR(20) DEFAULT 'Enroll for Free',
  `progress_percent` INT DEFAULT 0,
  `current_chapter` INT DEFAULT 1,
  `current_chapter_title` VARCHAR(200),
  `begin_stamp` DATE NOT NULL,
  `completion_stamp` DATE,
  `user_status` CHAR(1) NOT NULL DEFAULT 'O',
  PRIMARY KEY (`learning_progress_id`),
  INDEX(enrollment_id),
  FOREIGN KEY (enrollment_id) REFERENCES Enrollment_Info(enrollment_id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);   

CREATE TABLE `User_Exam_Done`(
  `user_exam_done_id` INT AUTO_INCREMENT NOT NULL UNIQUE,
  `learner_id` INT NOT NULL,
  `exam_id` INT NOT NULL,
  `score` INT NOT NULL,
  `total` INT NOT NULL,
  `submit_datetime` DATE NOT NULL,
  PRIMARY KEY (`User_exam_done_id`),
  INDEX (exam_id),
  FOREIGN KEY (exam_id) REFERENCES Exam(exam_id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE TABLE `Rating` (
  `rating_id` INT AUTO_INCREMENT NOT NULL UNIQUE,
  `course_id` INT NOT NULL,
  `learner_id` INT NOT NULL,
  `star_equivalent_id` INT NOT NULL,
  `feedback_text` VARCHAR(1000) DEFAULT ' ',
  `submission_date` DATE NOT NULL,
  PRIMARY KEY (`rating_id`),
  INDEX(course_id),
  FOREIGN KEY (course_id) REFERENCES Course(course_id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  INDEX(learner_id),
  FOREIGN KEY (learner_id) REFERENCES user_information(user_information_id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

";
   


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

