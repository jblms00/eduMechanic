<?php
session_start();
include("../database-connection.php");

$data = [];
$targetDirectory = "../../assets/images/drag-and-drop-activities/";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $itemId = isset($_POST['itemId']) ? mysqli_real_escape_string($con, trim($_POST['itemId'])) : '';

    if (!empty($itemId) && isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $fileName = basename($file["name"]);
        $targetFilePath = $targetDirectory . $fileName;

        // Retrieve the current image file name from the database
        $selectQuery = "SELECT item_image FROM activity_items WHERE item_id = '$itemId'";
        $result = mysqli_query($con, $selectQuery);

        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $currentImage = $row['item_image'];

            // Delete the old image file if it exists
            if (!empty($currentImage)) {
                $oldFilePath = $targetDirectory . $currentImage;
                if (file_exists($oldFilePath)) {
                    unlink($oldFilePath);
                }
            }
        }

        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        if (in_array($fileType, ["jpg", "jpeg", "png", "gif"])) {
            if (move_uploaded_file($file["tmp_name"], $targetFilePath)) {
                $updateQuery = "UPDATE activity_items SET item_image = '$fileName' WHERE item_id = '$itemId'";
                if (mysqli_query($con, $updateQuery)) {
                    $data['status'] = 'success';
                    $data['fileDirectory'] = "../assets/images/drag-and-drop-activities/" . $fileName;
                    $data['message'] = ' Image updated successfully.';
                } else {
                    $data['status'] = 'error';
                    $data['message'] = 'Failed to update item image in database.';
                }
            } else {
                $data['status'] = 'error';
                $data['message'] = 'There was an error uploading the file.';
            }
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'No file or item ID received.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>