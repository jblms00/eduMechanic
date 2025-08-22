<?php
session_start();
include("../database-connection.php");

$data = [];
$validLevels = ['Beginner', 'Intermediate', 'Advanced'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $lessonId = mysqli_real_escape_string($con, $_POST['lessonId']);
    $lessonTitle = mysqli_real_escape_string($con, $_POST['lessonTitle']);
    $lessonLevel = mysqli_real_escape_string($con, $_POST['lessonLevel']);

    // Check if lessonFile and lessonBanner are set
    $lessonFile = isset($_FILES['lessonFile']) ? $_FILES['lessonFile'] : null;
    $lessonBanner = isset($_FILES['lessonBanner']) ? $_FILES['lessonBanner'] : null;

    // Validate required fields
    if (empty($lessonId) || empty($lessonTitle) || empty($lessonLevel)) {
        $data['status'] = "error";
        $data['message'] = "All fields are required.";
    } else if (strlen($lessonTitle) < 3 || strlen($lessonTitle) > 100) {
        $data['status'] = "error";
        $data['message'] = "Lesson title must be between 3 and 100 characters.";
    } else if (!in_array($lessonLevel, $validLevels)) {
        $data['status'] = "error";
        $data['message'] = "Invalid lesson level.";
    } else {
        $fetchSql = "SELECT lesson_content, lesson_media FROM readings_lessons WHERE reading_id = '$lessonId'";
        $result = mysqli_query($con, $fetchSql);
        if ($result && mysqli_num_rows($result) > 0) {
            $lessonData = mysqli_fetch_assoc($result);
            $oldLessonFile = $lessonData['lesson_content'];
            $oldLessonBanner = $lessonData['lesson_media'];

            // Delete old lesson file if it exists (using the full path)
            if ($oldLessonFile && file_exists("../assets/uploads/" . basename($oldLessonFile))) {
                unlink("../assets/uploads/" . basename($oldLessonFile));
            }

            // Delete old lesson banner file if it exists (using the file name only)
            if ($oldLessonBanner && file_exists("../assets/images/uploadedLessonBanner/" . $oldLessonBanner)) {
                unlink("../assets/images/uploadedLessonBanner/" . $oldLessonBanner);
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Lesson not found.";
            echo json_encode($data);
            exit();
        }

        // Validate lesson file (PDF only)
        if ($lessonFile && $lessonFile['error'] == 0) {
            $allowedFileTypes = ['application/pdf'];
            if (!in_array($lessonFile['type'], $allowedFileTypes)) {
                $data['status'] = "error";
                $data['message'] = "Invalid lesson file. Only PDF files are allowed.";
                echo json_encode($data);
                exit();
            }

            // Define the upload directory for lesson file
            $uploadDir = "../assets/uploads/";
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            // Generate a unique name for the lesson file
            $fileName = uniqid() . '-' . basename($lessonFile['name']);
            $uploadPath = $uploadDir . $fileName;

            // Move the uploaded file to the target directory
            if (!move_uploaded_file($lessonFile['tmp_name'], $uploadPath)) {
                $data['status'] = "error";
                $data['message'] = "Failed to upload the lesson file.";
                echo json_encode($data);
                exit();
            }

            // Update lesson content with the file name and path
            $lessonFileName = "../assets/uploads/" . $fileName;
        } else {
            $lessonFileName = null;
        }

        // Validate lesson banner (JPG and JPEG only)
        if ($lessonBanner && $lessonBanner['error'] == 0) {
            $allowedBannerTypes = ['image/jpeg', 'image/jpg'];
            if (!in_array($lessonBanner['type'], $allowedBannerTypes)) {
                $data['status'] = "error";
                $data['message'] = "Invalid banner file. Only JPG and JPEG files are allowed.";
                echo json_encode($data);
                exit();
            }

            // Define the upload directory for lesson banner
            $bannerUploadDir = "../assets/images/uploadedLessonBanner/";
            if (!is_dir($bannerUploadDir)) {
                mkdir($bannerUploadDir, 0777, true);
            }

            // Generate a unique name for the banner
            $bannerFileName = uniqid() . '-' . basename($lessonBanner['name']);
            $bannerUploadPath = $bannerUploadDir . $bannerFileName;

            // Move the uploaded banner to the target directory
            if (!move_uploaded_file($lessonBanner['tmp_name'], $bannerUploadPath)) {
                $data['status'] = "error";
                $data['message'] = "Failed to upload the lesson banner.";
                echo json_encode($data);
                exit();
            }

            // Update lesson banner with the file name
            $lessonBannerName = $bannerFileName;
        } else {
            $lessonBannerName = null; // No banner uploaded
        }

        // Prepare the SQL query to update the lesson
        $sql = "UPDATE readings_lessons SET lesson_title = '$lessonTitle', lesson_level = '$lessonLevel'";

        // Add the lesson content (file) and banner (image) if they were uploaded
        if ($lessonFileName) {
            $sql .= ", lesson_content = '$lessonFileName'";
        }
        if ($lessonBannerName) {
            $sql .= ", lesson_media = '$lessonBannerName'";
        }

        $sql .= " WHERE reading_id = '$lessonId'";

        if (mysqli_query($con, $sql)) {
            $data['status'] = "success";
            $data['message'] = "Lesson updated successfully.";
        } else {
            $data['status'] = "error";
            $data['message'] = "Error updating lesson: " . mysqli_error($con);
        }
    }

} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
