<?php
session_start();
include("../database-connection.php");

$data = [];
$validLevels = ['Beginner', 'Intermediate', 'Advanced'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $videoTitle = mysqli_real_escape_string($con, $_POST['videoTitle']);
    $videoUrl = mysqli_real_escape_string($con, $_POST['videoUrl']);
    $videoBanner = isset($_FILES['videoBanner']) ? $_FILES['videoBanner'] : null;

    // Validate required fields
    if (empty($videoTitle) || empty($videoUrl)) {
        $data['status'] = "error";
        $data['message'] = "All fields are required.";
    } else if (!$videoBanner || $videoBanner['error'] != 0) {
        $data['status'] = "error";
        $data['message'] = "Video banner is required.";
    } else if ($videoBanner['size'] > 40 * 1024 * 1024) { // 40MB
        $data['status'] = "error";
        $data['message'] = "Video banner exceeds maximum allowed size (40MB).";
    } else if (strlen($videoTitle) < 3 || strlen($videoTitle) > 100) {
        $data['status'] = "error";
        $data['message'] = "Video title must be between 3 and 100 characters.";
    } else {
        $bannerUploadDir = "../../assets/images/";
        $allowedBannerTypes = ['image/jpeg', 'image/jpg'];

        $bannerFileName = uniqid() . '-' . basename($videoBanner['name']);
        $bannerUploadPath = $bannerUploadDir . $bannerFileName;

        if (!in_array($videoBanner['type'], $allowedBannerTypes)) {
            $data['status'] = "error";
            $data['message'] = "Invalid banner file. Only JPG and JPEG files are allowed.";
        } else if (!move_uploaded_file($videoBanner['tmp_name'], $bannerUploadPath)) {
            $data['status'] = "error";
            $data['message'] = "Failed to upload the video banner. Error code: " . $videoBanner['error'];
        } else {

            $videoBannerName = $bannerFileName;
            $videoFileName = "../assets/uploads/" . $fileName;

            $videoId = rand(100000, 999999);
            $sql = "INSERT INTO video_demonstration (video_id , video_title, video_img, video_url, datetime_added) 
                    VALUES ('$videoId', '$videoTitle', '$videoBannerName', '$videoUrl', NOW())";

            if (mysqli_query($con, $sql)) {
                $data['status'] = "success";
                $data['message'] = "Video demonstration added successfully.";
            } else {
                $data['status'] = "error";
                $data['message'] = "Error adding video: " . mysqli_error($con);
            }
        }

    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>