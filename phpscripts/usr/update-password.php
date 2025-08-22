<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $adminId = $_POST['admin_id'];
    $currentPassword = mysqli_real_escape_string($con, $_POST['current_password']);
    $newPassword = mysqli_real_escape_string($con, $_POST['new_password']);
    $confirmNewPassword = mysqli_real_escape_string($con, $_POST['confirm_new_password']);

    if (empty($currentPassword) || empty($newPassword) || empty($confirmNewPassword)) {
        $data['status'] = "error";
        $data['message'] = "Please fill out all the fields.";
    } elseif ($newPassword !== $confirmNewPassword) {
        $data['status'] = "error";
        $data['message'] = "New password and confirmation do not match.";
    } else {
        $check_query = "SELECT admin_password FROM admin_data WHERE admin_id = '$adminId'";
        $check_result = mysqli_query($con, $check_query);

        if (mysqli_num_rows($check_result) > 0) {
            $admin = mysqli_fetch_assoc($check_result);
            $storedPassword = $admin['admin_password'];

            $encodedCurrentPassword = base64_encode($currentPassword);

            if ($encodedCurrentPassword === $storedPassword) {
                $encodedNewPassword = base64_encode($newPassword);

                $update_query = "UPDATE admin_data SET admin_password = '$encodedNewPassword' WHERE admin_id = '$adminId'";
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
            $data['message'] = "admin not found.";
        }
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>