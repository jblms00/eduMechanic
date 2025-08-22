<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['student_id']) || empty($_POST['student_id'])) {
        $data['status'] = "error";
        $data['message'] = "User ID is missing.";
        echo json_encode($data);
        exit;
    }

    $userId = mysqli_real_escape_string($con, $_POST['student_id']);

    // Fetch user photo path
    $fetchQuery = "SELECT user_photo FROM user_data WHERE user_id = '$userId'";
    $fetchResult = mysqli_query($con, $fetchQuery);

    if ($fetchResult && mysqli_num_rows($fetchResult) > 0) {
        $fetchData = mysqli_fetch_assoc($fetchResult);
        $photoPath = "../../assets/images/userProfileImgs/" . $fetchData['user_photo'];
    } else {
        $data['status'] = "error";
        $data['message'] = "User not found or invalid ID.";
        echo json_encode($data);
        exit;
    }

    // Delete user-related data
    $deleteQueries = [
        "DELETE FROM user_data WHERE user_id = '$userId'",
        "DELETE FROM account_verification WHERE user_id = '$userId'",
        "DELETE FROM activity_attempts WHERE user_id = '$userId'",
        "DELETE FROM quiz_attempts WHERE user_id = '$userId'",
        "DELETE FROM user_scores WHERE user_id = '$userId'"
    ];

    $deleteSuccess = true;
    foreach ($deleteQueries as $query) {
        if (!mysqli_query($con, $query)) {
            $deleteSuccess = false;
            break;
        }
    }

    if ($deleteSuccess) {
        $data['status'] = "success";
        $data['message'] = "User deleted successfully.";

        // Delete profile image if it exists
        if (!empty($fetchData['user_photo']) && file_exists($photoPath)) {
            if (unlink($photoPath)) {
                $data['imageStatus'] = "Image deleted successfully.";
            } else {
                $data['imageStatus'] = "Failed to delete the image.";
            }
        } else {
            $data['imageStatus'] = "Image file does not exist.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Failed to delete user.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>