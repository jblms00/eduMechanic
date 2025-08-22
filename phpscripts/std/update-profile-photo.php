<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $userId = $_POST['user_id'];
    $fileToUpload = $_FILES['fileToUpload'];

    if (empty($fileToUpload['name'])) {
        $data['status'] = "error";
        $data['message'] = "Please select a photo to upload.";
    } else {
        $get_user_query = "SELECT user_photo FROM user_data WHERE user_id = '$userId'";
        $get_user_result = mysqli_query($con, $get_user_query);
        $user_data = mysqli_fetch_assoc($get_user_result);

        $defaultPhotoPath = "default-profile.png";

        if ($user_data['user_photo'] != $defaultPhotoPath) {
            $oldPhoto = "../../assets/images/userProfileImgs/" . $user_data['user_photo'];
            if (unlink($oldPhoto)) {
                $data['oldPhotoStatus'] = "Old photo deleted successfully.";
            } else {
                $data['oldPhotoStatus'] = "Failed to delete old photo.";
            }
        }

        $fileName = basename($fileToUpload["name"]);
        $fileType = pathinfo($fileName, PATHINFO_EXTENSION);

        $dateTimeNow = date("Y-m-d-H-i-s");

        $newFileName = "USR-" . $userId . "-PHOTO-" . $dateTimeNow . "." . $fileType;
        $targetDir = "../../assets/images/userProfileImgs/";
        $targetFilePath = $targetDir . $newFileName;

        $allowedTypes = array("jpg", "jpeg", "png", "gif");
        if (in_array($fileType, $allowedTypes)) {
            if (move_uploaded_file($fileToUpload["tmp_name"], $targetFilePath)) {
                $newPhotoUrl = $targetFilePath;

                $update_query = "UPDATE user_data SET user_photo = '$newFileName' WHERE user_id = '$userId'";
                $update_result = mysqli_query($con, $update_query);

                if ($update_result) {
                    $data['status'] = "success";
                    $data['message'] = "Profile photo updated successfully!";
                    $data['newFileName'] = $newFileName;
                } else {
                    $data['status'] = "error";
                    $data['message'] = "Failed to update the database. Please try again.";
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "Sorry, there was an error uploading your file.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Sorry, only JPG, JPEG, PNG, and GIF files are allowed.";
        }
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method. Please try again.";
}

echo json_encode($data);
