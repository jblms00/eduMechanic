<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $itemId = mysqli_real_escape_string($con, $_POST['itemId']);
    $itemCode = mysqli_real_escape_string($con, $_POST['itemCode']);

    if (empty($itemId) || empty($itemCode)) {
        $data['status'] = "error";
        $data['message'] = "Please enter the sketchfab code.";
    } else {
        $update_query = "UPDATE activity_items SET sketchfab_code = '$itemCode' WHERE item_id = '$itemId'";
        $update_result = mysqli_query($con, $update_query);

        if ($update_result) {
            $data['status'] = "success";
            $data['message'] = "Sketchfab updated successfully!";
        } else {
            $data['status'] = "error";
            $data['message'] = "Failed to update the sketchfab code. Please try again.";
        }
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>