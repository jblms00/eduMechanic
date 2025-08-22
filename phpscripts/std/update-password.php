<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $userId = $_POST['user_id'];
    $currentPassword = mysqli_real_escape_string($con, $_POST['current_password']);
    $newPassword = mysqli_real_escape_string($con, $_POST['new_password']);
    $confirmNewPassword = mysqli_real_escape_string($con, $_POST['confirm_new_password']);
    $passwordPattern = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";

    if (empty($currentPassword) || empty($newPassword) || empty($confirmNewPassword)) {
        $data['status'] = "error";
        $data['message'] = "Please fill out all the fields.";
    } else if (!preg_match($passwordPattern, $newPassword)) {
        $data['status'] = "error";
        $data['message'] = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).";
    } else if ($newPassword !== $confirmNewPassword) {
        $data['status'] = "error";
        $data['message'] = "New password and confirmation do not match.";
    } else {
        $check_query = "SELECT user_password FROM user_data WHERE user_id = '$userId'";
        $check_result = mysqli_query($con, $check_query);

        if (mysqli_num_rows($check_result) > 0) {
            $user = mysqli_fetch_assoc($check_result);
            $storedPassword = $user['user_password'];

            $encodedCurrentPassword = base64_encode($currentPassword);

            if ($encodedCurrentPassword === $storedPassword) {
                $encodedNewPassword = base64_encode($newPassword);

                $update_query = "UPDATE user_data SET user_password = '$encodedNewPassword' WHERE user_id = '$userId'";
                $update_result = mysqli_query($con, $update_query);

                if ($update_result) {
                    $data['status'] = "success";
                    $data['message'] = "Password updated successfully!";
                } else {
                    $data['status'] = "error";
                    $data['message'] = "Failed to update the password. Please try again.";
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "Current password is incorrect.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "User not found.";
        }
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>