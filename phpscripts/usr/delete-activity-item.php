<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $itemId = isset($_POST['itemId']) ? mysqli_real_escape_string($con, $_POST['itemId']) : null;
    $activityId = isset($_POST['activityId']) ? mysqli_real_escape_string($con, $_POST['activityId']) : null;

    if (!$itemId || !$activityId) {
        $data['status'] = "error";
        $data['message'] = "Item ID and Activity ID are required.";
    } else {
        $sqlFetch = "SELECT item_image FROM activity_items WHERE item_id = '$itemId' AND activity_id = '$activityId'";
        $result = mysqli_query($con, $sqlFetch);

        if ($result && mysqli_num_rows($result) > 0) {
            $item = mysqli_fetch_assoc($result);
            $itemImagePath = $item['item_image'];

            $targetDirectory = "../../assets/images/drag-and-drop-activities/";

            if ($itemImagePath && file_exists($targetDirectory . $itemImagePath)) {
                unlink($targetDirectory . $itemImagePath);
            }

            $sqlDelete = "DELETE FROM activity_items WHERE item_id = '$itemId' AND activity_id = '$activityId'";

            if (mysqli_query($con, $sqlDelete)) {
                $data['status'] = "success";
                $data['message'] = "Item and its image deleted successfully!";
            } else {
                $data['status'] = "error";
                $data['message'] = "Failed to delete item: " . mysqli_error($con);
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Item not found.";
        }
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);

mysqli_close($con);
?>