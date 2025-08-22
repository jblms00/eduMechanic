<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $activityId = isset($_POST['activityId']) ? mysqli_real_escape_string($con, trim($_POST['activityId'])) : '';
    $activityTitle = isset($_POST['activityTitle']) ? mysqli_real_escape_string($con, trim($_POST['activityTitle'])) : '';
    $activityNumber = isset($_POST['activityNumber']) ? mysqli_real_escape_string($con, trim($_POST['activityNumber'])) : '';
    $activityDueDate = isset($_POST['activityDueDate']) ? mysqli_real_escape_string($con, trim($_POST['activityDueDate'])) : '';
    $passingPercentage = isset($_POST['passingPercentage']) ? mysqli_real_escape_string($con, trim($_POST['passingPercentage'])) : '';

    // Validate form data
    if (empty($activityId) || empty($activityTitle) || empty($activityNumber) || empty($activityDueDate) || empty($passingPercentage)) {
        $data['status'] = 'error';
        $data['message'] = 'All fields are required.';
    } else {
        // Update activity
        $updateActivityQuery = "UPDATE activities
                                SET activity_title = '$activityTitle',
                                    activity_number = '$activityNumber',
                                    activity_due_date = '$activityDueDate',
                                    passing_percentage = '$passingPercentage'
                                WHERE activity_id = '$activityId'";

        if (mysqli_query($con, $updateActivityQuery)) {
            // Update activity items
            if (isset($_POST['items']) && is_array($_POST['items'])) {
                foreach ($_POST['items'] as $item) {
                    $itemId = isset($item['itemId']) ? mysqli_real_escape_string($con, trim($item['itemId'])) : '';
                    $itemName = isset($item['itemName']) ? mysqli_real_escape_string($con, trim($item['itemName'])) : '';

                    // Ensure item data is valid
                    if (!empty($itemId) && !empty($itemName) && !empty($itemImage)) {
                        $updateItemQuery = "UPDATE activity_items
                                            SET item_name = '$itemName',
                                            WHERE item_id = '$itemId' AND activity_id = '$activityId'";

                        mysqli_query($con, $updateItemQuery);
                    }
                }
            }

            $data['status'] = 'success';
            $data['message'] = 'Activity updated successfully.';
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Database error: ' . mysqli_error($con);
        }
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method. Use POST.';
}

echo json_encode($data);
?>