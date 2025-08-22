<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['activityId']) && !empty(trim($_GET['activityId']))) {
        $activityId = mysqli_real_escape_string($con, trim($_GET['activityId']));

        $sql = "SELECT * FROM activity_items WHERE activity_id = '$activityId'";
        $result = mysqli_query($con, $sql);

        if ($result) {
            if (mysqli_num_rows($result) > 0) {
                $items = [];
                while ($row = mysqli_fetch_assoc($result)) {
                    $items[] = $row;
                }
                $data['status'] = "success";
                $data['items'] = $items;
            } else {
                $data['status'] = "success";
                $data['items'] = [];
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Database query error: " . mysqli_error($con);
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Missing or invalid activity ID.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method. Use GET.";
}

echo json_encode($data);
?>