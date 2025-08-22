<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['activity_id']) && is_numeric($_GET['activity_id'])) {
        $activityId = mysqli_real_escape_string($con, $_GET['activity_id']);

        $sql = "SELECT * FROM activity_items WHERE activity_id = '$activityId'";
        $result = mysqli_query($con, $sql);

        if ($result) {
            if (mysqli_num_rows($result) > 0) {
                $items = [];
                while ($row = mysqli_fetch_assoc($result)) {
                    $items[] = $row;
                }
                $data['status'] = "success";
                $data['data'] = $items;
            } else {
                $data['status'] = "error";
                $data['message'] = "No items found for this reading ID.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Query error: " . mysqli_error($con);
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Invalid or missing activity_id parameter.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>