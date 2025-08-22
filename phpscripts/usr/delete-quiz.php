<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['quiz_id'])) {
    $quizId = mysqli_real_escape_string($con, $_POST['quiz_id']);

    // Queries to delete associated data
    $queries = [
        "DELETE FROM quiz_questionnaire WHERE quiz_id = '$quizId'",
        "DELETE FROM quiz_attempts WHERE quiz_id = '$quizId'",
        "DELETE FROM user_scores WHERE task_type = 'quiz' AND task_id = '$quizId'",
        "DELETE FROM quiz WHERE quiz_id = '$quizId'"
    ];

    // Execute each query and check for errors
    foreach ($queries as $query) {
        if (!mysqli_query($con, $query)) {
            $data['status'] = 'error';
            $data['message'] = 'Failed to delete associated data: ' . mysqli_error($con);
            echo json_encode($data);
            exit;
        }
    }

    $data['status'] = 'success';
    $data['message'] = 'Quiz and all associated data deleted successfully.';
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request or missing quiz ID.';
}

echo json_encode($data);
?>