<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $adminId = $_POST['admin_id'];
    $firstName = mysqli_real_escape_string($con, $_POST['first_name']);
    $lastName = mysqli_real_escape_string($con, $_POST['last_name']);
    $fullname = $firstName . " " . $lastName;

    if (empty($firstName) || empty($lastName)) {
        $data['status'] = "error";
        $data['message'] = "Please fill out all the fields.";
    } else {
        $update_query = "UPDATE admin_data SET admin_name = '$fullname' WHERE admin_id = '$adminId'";
        $update_result = mysqli_query($con, $update_query);

        if ($update_result) {
            $data['status'] = "success";
            $data['message'] = "Personal information updated successfully!";
        } else {
            $data['status'] = "error";
            $data['message'] = "Failed to update personal information. Please try again.";
        }
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>