<?php
session_start();
include("../database-connection.php");

$data = [];
$targetDirectory = "../../assets/images/drag-and-drop-activities/";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['activity_id'])) {
    $activityId = mysqli_real_escape_string($con, $_POST['activity_id']);

    // Fetch the image (if exists)
    $fetchImgQuery = "SELECT item_image FROM activity_items WHERE activity_id = '$activityId'";
    $fetchImgResult = mysqli_query($con, $fetchImgQuery);

    if ($fetchImgResult) {
        while ($row = mysqli_fetch_assoc($fetchImgResult)) {
            if (!empty($row['item_image'])) {
                $imagePath = $targetDirectory . $row['item_image'];
                if (file_exists($imagePath)) {
                    unlink($imagePath); // Remove the image file
                }
            }
        }
    }

    // Proceed with deletion regardless of image existence
    $queries = [
        "DELETE FROM activity_attempts WHERE activity_id = '$activityId'",
        "DELETE FROM user_scores WHERE task_type = 'activity' AND task_id = '$activityId'",
        "DELETE FROM activity_items WHERE activity_id = '$activityId'",
        "DELETE FROM activities WHERE activity_id = '$activityId'"
    ];

    foreach ($queries as $query) {
        if (!mysqli_query($con, $query)) {
            $data['status'] = 'error';
            $data['message'] = 'Failed to delete associated data: ' . mysqli_error($con);
            echo json_encode($data);
            exit;
        }
    }

    $data['status'] = 'success';
    $data['message'] = 'Activity and all associated data deleted successfully.';
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request or missing activity ID.';
}

echo json_encode($data);
?>