<?php
session_start();
include("../database-connection.php");

$data = [];
$targetDirectory = "../../assets/images/drag-and-drop-activities/";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $readingId = mysqli_real_escape_string($con, ($_POST['readingId']));
    $activityTitle = mysqli_real_escape_string($con, ($_POST['activityTitle']));
    $activityNumber = mysqli_real_escape_string($con, ($_POST['activityNumber']));
    $dueDate = $_POST['dueDate'];
    $passingPercentage = $_POST['passingPercentage'];

    $activityId = rand(100000, 999999);
    $insertQuery = "INSERT INTO activities (activity_id, reading_id, activity_title, passing_percentage, activity_number, activity_due_date, datetime_created) VALUES ('$activityId', '$readingId', '$activityTitle', '$passingPercentage', '$activityNumber', '$dueDate', NOW())";

    if (mysqli_query($con, $insertQuery)) {
        $activityId = mysqli_insert_id($con);

        $data['activity_id'] = $activityId;
        $data['status'] = 'success';
        $data['message'] = 'Activity created successfully';
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Database error: ' . mysqli_error($con);
    }

} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method. Use POST.';
}

echo json_encode($data);
?>