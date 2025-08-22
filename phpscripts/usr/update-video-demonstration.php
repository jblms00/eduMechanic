<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $videoId = mysqli_real_escape_string($con, $_POST['videoId']);
    $videoTitle = mysqli_real_escape_string($con, $_POST['videoTitle']);
    $videoUrl = mysqli_real_escape_string($con, $_POST['videoUrl']);
    $videoBanner = isset($_FILES['videoBanner']) ? $_FILES['videoBanner'] : null;

    if (empty($videoId) || empty($videoTitle) || empty($videoUrl)) {
        $data['status'] = "error";
        $data['message'] = "All fields are required.";
    } else if (strlen($videoTitle) < 3 || strlen($videoTitle) > 100) {
        $data['status'] = "error";
        $data['message'] = "Video title must be between 3 and 100 characters.";
    } else {
        $fetchSql = "SELECT video_img FROM video_demonstration WHERE video_id  = '$videoId'";
        $result = mysqli_query($con, $fetchSql);
        if ($result && mysqli_num_rows($result) > 0) {
            $videoData = mysqli_fetch_assoc($result);
            $oldBanner = $videoData['video_img'];

            if ($oldBanner && file_exists("../assets/images/" . $oldBanner)) {
                unlink("../assets/images/" . $oldBanner);
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Video not found.";
            echo json_encode($data);
            exit();
        }

        if ($videoBanner && $videoBanner['error'] == 0) {
            $allowedBannerTypes = ['image/jpeg', 'image/jpg'];
            if (!in_array($videoBanner['type'], $allowedBannerTypes)) {
                $data['status'] = "error";
                $data['message'] = "Invalid banner file. Only JPG and JPEG files are allowed.";
                echo json_encode($data);
                exit();
            }

            // Define the upload directory for video banner
            $bannerUploadDir = "../assets/images/";
            if (!is_dir($bannerUploadDir)) {
                mkdir($bannerUploadDir, 0777, true);
            }

            // Generate a unique name for the banner
            $bannerFileName = uniqid() . '-' . basename($videoBanner['name']);
            $bannerUploadPath = $bannerUploadDir . $bannerFileName;

            // Move the uploaded banner to the target directory
            if (!move_uploaded_file($videoBanner['tmp_name'], $bannerUploadPath)) {
                $data['status'] = "error";
                $data['message'] = "Failed to upload the video banner.";
                echo json_encode($data);
                exit();
            }

            $videoBannerName = $bannerFileName;
        } else {
            $videoBannerName = null;
        }

        $sql = "UPDATE video_demonstration SET video_title = '$videoTitle',";

        if ($videoBannerName) {
            $sql .= ", video_img = '$videoBannerName'";
        }

        $sql .= "video_url = '$videoUrl', datetime_added = NOW() WHERE video_id  = '$videoId'";

        if (mysqli_query($con, $sql)) {
            $data['status'] = "success";
            $data['message'] = "Video updated successfully.";
        } else {
            $data['status'] = "error";
            $data['message'] = "Error updating video: " . mysqli_error($con);
        }
    }

} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
