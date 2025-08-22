<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['video_id'])) {
        $videoId = mysqli_real_escape_string($con, $_POST['video_id']);

        $fetchQuery = "SELECT video_img FROM video_demonstration WHERE video_id = '$videoId'";
        $fetchResult = mysqli_query($con, $fetchQuery);

        if ($fetchResult && mysqli_num_rows($fetchResult) > 0) {
            $fetchData = mysqli_fetch_assoc($fetchResult);
            $bannerFilePath = "../../assets/images/" . $fetchData['video_img'];

            $query = "DELETE FROM video_demonstration WHERE video_id = '$videoId'";
            $result = mysqli_query($con, $query);

            if ($result) {
                $data['status'] = "success";
                $data['message'] = "Video demonstration deleted successfully.";

                if ($bannerFilePath && file_exists($bannerFilePath)) {
                    if (unlink($bannerFilePath)) {
                        $data['bannerFileStatus'] = "Banner file deleted successfully.";
                    } else {
                        $data['bannerFileStatus'] = "Failed to delete the banner file.";
                    }
                } else {
                    $data['bannerFileStatus'] = "Banner file does not exist.";
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "Failed to delete video.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Video demonstration not found or invalid ID.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Video ID is missing.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>