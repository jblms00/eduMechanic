<?php
session_start();
include("database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $verification_code = mysqli_real_escape_string($con, $_POST['code']);
    $userId = mysqli_real_escape_string($con, $_POST['userId']);
    $userType = mysqli_real_escape_string($con, $_POST['userType']);

    if (empty($verification_code)) {
        $data['status'] = "error";
        $data['message'] = "Please enter the verification code sent to your email.";
    } else {
        $confirm_code_query = "SELECT * FROM account_verification WHERE verification_code = '$verification_code'";
        $confirm_code_result = mysqli_query($con, $confirm_code_query);

        if ($confirm_code_result && mysqli_num_rows($confirm_code_result) > 0) {
            $fetch_code = mysqli_fetch_assoc($confirm_code_result);

            if ($fetch_code['verification_code'] === $verification_code) {
                // Determine table and fields based on user type
                if ($userType === "user") {
                    $table = "user_data";
                    $idField = "user_id";
                    $emailField = "user_email";
                } elseif ($userType === "admin") {
                    $table = "admin_data";
                    $idField = "admin_id";
                    $emailField = "admin_email";
                } else {
                    $data['status'] = "error";
                    $data['message'] = "Invalid user type.";
                    echo json_encode($data);
                    exit;
                }

                // Fetch user data
                $query = "SELECT $emailField, $idField FROM $table WHERE $idField = '$userId'";
                $user_result = mysqli_query($con, $query);

                if ($user_result && mysqli_num_rows($user_result) > 0) {
                    $fetch_user = mysqli_fetch_assoc($user_result);
                    $userEmail = $fetch_user[$emailField];

                    // Update verification status
                    $update_query1 = "UPDATE account_verification SET is_verified = true WHERE verification_code = '$verification_code'";
                    $update_result1 = mysqli_query($con, $update_query1);

                    $update_query2 = "UPDATE $table SET is_verified = true WHERE $idField = '$userId'";
                    $update_result2 = mysqli_query($con, $update_query2);

                    if ($update_result1 && $update_result2) {
                        $_SESSION[$idField] = $fetch_user[$idField];
                        $_SESSION[$emailField] = $fetch_user[$emailField];
                        $data['userType'] = $userType;
                        $data['status'] = "success";
                        $data['message'] = "2FA verified successfully!";
                    } else {
                        $data['status'] = "error";
                        $data['message'] = "Failed to update verification status.";
                    }
                } else {
                    $data['status'] = "error";
                    $data['message'] = "User not found.";
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "Invalid verification code. Please double-check and try again.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Invalid verification code. Please double-check and try again.";
        }
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
