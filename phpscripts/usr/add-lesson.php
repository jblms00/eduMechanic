<?php
session_start();
include("../database-connection.php");

$data = [];
$validLevels = ['Beginner', 'Intermediate', 'Advanced'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $lessonTitle = mysqli_real_escape_string($con, $_POST['lessonTitle']);
    $lessonLevel = mysqli_real_escape_string($con, $_POST['lessonLevel']);
    $lessonLearnings = mysqli_real_escape_string($con, $_POST['lessonLearnings']);
    $lessonLearnings = str_replace(',', ' ||', $lessonLearnings);

    // Validate required fields
    if (empty($lessonLearnings) || empty($lessonTitle) || empty($lessonLevel)) {
        $data['status'] = "error";
        $data['message'] = "All fields are required.";
    } else if (!isset($_FILES['lessonFiles']) || count($_FILES['lessonFiles']['name']) == 0) {
        $data['status'] = "error";
        $data['message'] = "At least one lesson file is required.";
    } else if (!isset($_FILES['lessonBanner']) || $_FILES['lessonBanner']['error'] != 0) {
        $data['status'] = "error";
        $data['message'] = "Lesson banner is required.";
    } else {
        $uploadDir = "../../assets/uploads/";
        $allowedFileTypes = ['application/pdf'];

        $bannerUploadDir = "../../assets/images/uploadedLessonBanner/";
        $allowedBannerTypes = ['image/jpeg', 'image/jpg'];

        $bannerFileName = uniqid() . '-' . basename($_FILES['lessonBanner']['name']);
        $bannerUploadPath = $bannerUploadDir . $bannerFileName;

        $lessonFiles = [];
        foreach ($_FILES['lessonFiles']['name'] as $key => $name) {
            if ($_FILES['lessonFiles']['error'][$key] == 0) {
                $fileType = $_FILES['lessonFiles']['type'][$key];
                if (in_array($fileType, $allowedFileTypes)) {
                    $fileName = uniqid() . '-' . basename($name);
                    $filePath = $uploadDir . $fileName;
                    if (move_uploaded_file($_FILES['lessonFiles']['tmp_name'][$key], $filePath)) {
                        $lessonFiles[] = "../assets/uploads/" . $fileName;
                    }
                }
            }
        }

        if (!in_array($_FILES['lessonBanner']['type'], $allowedBannerTypes)) {
            $data['status'] = "error";
            $data['message'] = "Invalid banner file. Only JPG and JPEG files are allowed.";
        } else if (!is_writable($bannerUploadDir) || !is_writable($uploadDir)) {
            $data['status'] = "error";
            $data['message'] = "The upload directories are not writable.";
        } else if (!move_uploaded_file($_FILES['lessonBanner']['tmp_name'], $bannerUploadPath)) {
            $data['status'] = "error";
            $data['message'] = "Failed to upload the lesson banner.";
        } else {
            $lessonBannerName = $bannerFileName;
            $lessonFilePaths = implode(',', $lessonFiles); // Store multiple file paths as comma-separated values

            // Insert lesson into database
            $readingId = rand(100000, 999999);
            $sql = "INSERT INTO readings_lessons (reading_id, lesson_title, lesson_learnings, lesson_content, lesson_media, lesson_level, datetime_added) 
                    VALUES ('$readingId', '$lessonTitle', '$lessonLearnings', '$lessonFilePaths', '$lessonBannerName', '$lessonLevel', NOW())";

            if (mysqli_query($con, $sql)) {
                $data['status'] = "success";
                $data['message'] = "Lesson added successfully.";
            } else {
                $data['status'] = "error";
                $data['message'] = "Error adding lesson: " . mysqli_error($con);
            }
        }
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>