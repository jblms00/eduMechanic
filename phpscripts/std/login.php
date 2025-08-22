<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $userEmail = $_POST['userEmail'];
    $user_password = $_POST['userPassword'];

    $get_users_query = "SELECT * FROM user_data WHERE user_email = '$userEmail'";
    $get_users_result = mysqli_query($con, $get_users_query);
    $fetch_users = mysqli_fetch_assoc($get_users_result);

    if ($get_users_result && mysqli_num_rows($get_users_result) <= 0) {
        $data['status'] = "error";
        $data['message'] = "No user account found";
    } else if (empty($userEmail) || empty($user_password)) {
        $data['status'] = "error";
        $data['message'] = "Please enter user email and password";
    } else if (!($userEmail == $fetch_users['user_email'])) {
        $data['status'] = "error";
        $data['message'] = "Incorrect email. Please try again.";
    } else if (base64_encode($user_password) != $fetch_users['user_password']) {
        $data['status'] = "error";
        $data['message'] = "Incorrect password. Please try again.";
    } else {
        $_SESSION['user_id'] = $fetch_users['user_id'];
        $_SESSION['user_email'] = $fetch_users['user_email'];

        $data['status'] = "success";
        $data['message'] = "Login Successfully!";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method. Please try again.";
}

echo json_encode($data);
