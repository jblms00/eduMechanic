<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['user_score'], $_POST['score_percentage'], $_POST['currentUserId'], $_POST['quizId'])) {
        $score = mysqli_real_escape_string($con, $_POST['user_score']);
        $scorePercentage = mysqli_real_escape_string($con, $_POST['score_percentage']);
        $userId = mysqli_real_escape_string($con, $_POST['currentUserId']);
        $quizId = mysqli_real_escape_string($con, $_POST['quizId']);

        if (empty($score) || empty($scorePercentage) || empty($userId) || empty($quizId)) {
            $data['status'] = "error";
            $data['message'] = "Missing required parameters.";
        } else {
            $scoreId = rand(100000, 999999);
            $attemptId = rand(100000, 999999);

            $insertScoreSql = "INSERT INTO user_scores (score_id, task_id, user_id, score, score_percentage, task_type, datetime_added) 
                                            VALUES ('$scoreId', '$quizId', '$userId', '$score', '$scorePercentage', 'quiz', NOW())";

            $insertAttemptSql = "INSERT INTO quiz_attempts (attempt_id, user_id, quiz_id, datetime_attempted) 
                          VALUES ('$attemptId', '$userId', '$quizId', NOW())";

            if (mysqli_query($con, $insertScoreSql) && mysqli_query($con, $insertAttemptSql)) {
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