<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['activity_id'], $_POST['score'], $_POST['score_percentage'], $_POST['user_id'])) {
        $activityId = mysqli_real_escape_string($con, $_POST['activity_id']);
        $score = mysqli_real_escape_string($con, $_POST['score']);
        $scorePercentage = mysqli_real_escape_string($con, $_POST['score_percentage']);
        $userId = mysqli_real_escape_string($con, $_POST['user_id']);

        if (empty($activityId) || empty($score) || empty($scorePercentage) || empty($userId)) {
            $data['status'] = "error";
            $data['message'] = "Missing required parameters.";
        } else {
            $scoreId = rand(100000, 999999);
            $attemptId = rand(100000, 999999);

            $insertActSql = "INSERT INTO user_scores (score_id, task_id, user_id, score, score_percentage, task_type, datetime_added) 
                          VALUES ('$scoreId', '$activityId', '$userId', '$score', '$scorePercentage', 'activity', NOW())";

            $insertAttemptSql = "INSERT INTO activity_attempts (activity_attempt_id, user_id, activity_id, datetime_attempted) 
                          VALUES ('$attemptId', '$userId', '$activityId', NOW())";

            if (mysqli_query($con, $insertActSql) && mysqli_query($con, $insertAttemptSql)) {
                $data['status'] = "success";
                $data['message'] = "Score has been saved successfully!";
            } else {
                $data['status'] = "error";
                $data['message'] = "Error inserting score: " . mysqli_error($con);
            }
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Missing required parameters.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>