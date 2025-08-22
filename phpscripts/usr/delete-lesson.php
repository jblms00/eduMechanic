<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['lesson_id'])) {
        $readingId = mysqli_real_escape_string($con, $_POST['lesson_id']);

        // Fetch the file paths
        $fetchFilesQuery = "SELECT lesson_content, lesson_media FROM readings_lessons WHERE reading_id = '$readingId'";
        $fetchFilesResult = mysqli_query($con, $fetchFilesQuery);

        if ($fetchFilesResult && mysqli_num_rows($fetchFilesResult) > 0) {
            $files = mysqli_fetch_assoc($fetchFilesResult);

            // Handle multiple lesson files
            $lessonFilePaths = explode(",", $files['lesson_content']);
            $bannerFilePath = "../../assets/images/uploadedLessonBanner/" . $files['lesson_media'];

            $allFilesDeleted = true;

            foreach ($lessonFilePaths as $lessonFilePath) {
                $lessonFilePath = "../" . trim($lessonFilePath);
                if (!empty($lessonFilePath) && file_exists($lessonFilePath)) {
                    if (!unlink($lessonFilePath)) {
                        $allFilesDeleted = false;
                        $data['lessonFileStatus'][] = "Failed to delete: " . basename($lessonFilePath);
                    }
                }
            }

            // Attempt to delete the banner file
            if (!empty($files['lesson_media']) && file_exists($bannerFilePath)) {
                if (!unlink($bannerFilePath)) {
                    $allFilesDeleted = false;
                    $data['bannerFileStatus'] = "Failed to delete banner file.";
                }
            }

            // Delete the lesson from the database only if all files were deleted
            if ($allFilesDeleted) {
                $deleteQuery = "DELETE FROM readings_lessons WHERE reading_id = '$readingId'";
                $deleteResult = mysqli_query($con, $deleteQuery);

                if ($deleteResult) {
                    $data['status'] = "success";
                    $data['message'] = "Lesson and all files deleted successfully.";
                } else {
                    $data['status'] = "error";
                    $data['message'] = "Failed to delete lesson from the database.";
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "Some files could not be deleted.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Lesson not found or invalid ID.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Lesson ID is missing.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>