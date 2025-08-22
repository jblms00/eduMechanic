<?php
session_start();
include("../database-connection.php");

$data = [];
$targetDirectory = "../../assets/images/drag-and-drop-activities/";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $activityId = isset($_POST['activity_id']) ? mysqli_real_escape_string($con, trim($_POST['activity_id'])) : '';
    $itemName = isset($_POST['item_name']) ? mysqli_real_escape_string($con, trim($_POST['item_name'])) : '';
    $itemImage = isset($_FILES['item_image']) ? $_FILES['item_image'] : null;

    if (empty($activityId) || empty($itemName) || !$itemImage || $itemImage['error'] != 0) {
        $data['status'] = 'error';
        $data['message'] = 'Item name and valid image are required.';
    } else {
        $targetFile = $targetDirectory . basename($itemImage['name']);
        $fileName = basename($itemImage['name']);

        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
        if ($imageFileType != 'png') {
            $data['status'] = 'error';
            $data['message'] = 'Only PNG image files are allowed.';
        } else {

            if (move_uploaded_file($itemImage['tmp_name'], $targetFile)) {
                $itemId = rand(100000, 999999);
                $insertQuery = "INSERT INTO activity_items (item_id, activity_id, item_name, item_image) VALUES ('$itemId', '$activityId', '$itemName', '$fileName')";

                if (mysqli_query($con, $insertQuery)) {
                    $data['status'] = 'success';
                    $data['message'] = 'Item saved successfully with PNG image.';
                } else {
                    $data['status'] = 'error';
                    $data['message'] = 'Database error: ' . mysqli_error($con);
                }
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Failed to upload image.';
            }
        }
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method. Use POST.';
}

echo json_encode($data);
?>