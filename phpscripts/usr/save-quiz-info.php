<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $quizId = isset($_POST['quizId']) ? mysqli_real_escape_string($con, trim($_POST['quizId'])) : '';
    $quizNumber = isset($_POST['quizNumber']) ? mysqli_real_escape_string($con, trim($_POST['quizNumber'])) : '';
    $quizTitle = isset($_POST['quizTitle']) ? mysqli_real_escape_string($con, trim($_POST['quizTitle'])) : '';
    $quizDuration = isset($_POST['quizDuration']) ? mysqli_real_escape_string($con, trim($_POST['quizDuration'])) : '';
    $quizDueDate = isset($_POST['quizDueDate']) ? mysqli_real_escape_string($con, trim($_POST['quizDueDate'])) : '';
    $passingPercentage = isset($_POST['passingPercentage']) ? mysqli_real_escape_string($con, trim($_POST['passingPercentage'])) : '';

    if (empty($quizId) || empty($quizNumber) || empty($quizTitle) || empty($quizDuration) || empty($quizDueDate) || empty($passingPercentage)) {
        $data['status'] = 'error';
        $data['message'] = 'All fields are required.';
    } else {
        $updateQuery = "UPDATE quiz
                        SET quiz_number = '$quizNumber',
                        quiz_title = '$quizTitle',
                        quiz_duration = '$quizDuration',
                        quiz_due_date = '$quizDueDate',
                        passing_percentage = '$passingPercentage'
                        WHERE quiz_id = '$quizId'
        ";

        if (mysqli_query($con, $updateQuery)) {
            $data['status'] = 'success';
            $data['message'] = 'Quiz info updated successfully.';
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