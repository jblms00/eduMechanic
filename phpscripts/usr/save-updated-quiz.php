<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['updatedAnswers'])) {
    $updatedAnswers = json_decode($_POST['updatedAnswers'], true);

    // Validate the incoming data
    foreach ($updatedAnswers as $answer) {
        if (empty($answer['question']) || empty($answer['choices']) || empty($answer['answer'])) {
            $data['status'] = "error";
            $data['message'] = "All fields must be filled.";
            echo json_encode($data);
            exit;
        }

        if (strlen($answer['question']) > 500) {
            $data['status'] = "error";
            $data['message'] = "Question is too long. Max 500 characters.";
            echo json_encode($data);
            exit;
        }

        if (strlen($answer['answer']) > 1) {
            $data['status'] = "error";
            $data['message'] = "Answer selection is invalid.";
            echo json_encode($data);
            exit;
        }
    }

    // Begin transaction
    $con->begin_transaction();

    try {
        // Update each question
        foreach ($updatedAnswers as $answer) {
            $questionnaire_id = mysqli_real_escape_string($con, $answer['questionnaire_id']);
            $question = mysqli_real_escape_string($con, $answer['question']);
            $choices = mysqli_real_escape_string($con, $answer['choices']);
            $correct_answer = mysqli_real_escape_string($con, $answer['answer']);

            // Update question data in the database
            $sql = "UPDATE quiz_questionnaire SET question = '$question', choices = '$choices', answer = '$correct_answer' WHERE questionnaire_id = '$questionnaire_id'";

            if (!mysqli_query($con, $sql)) {
                throw new Exception("Failed to update quiz data for questionnaire ID: $questionnaire_id.");
            }
        }

        // Commit the transaction
        $con->commit();

        $data['status'] = "success";
        $data['message'] = "Quiz updated successfully.";
    } catch (Exception $e) {
        // Rollback if any error occurs
        $con->rollback();
        $data['status'] = "error";
        $data['message'] = $e->getMessage();
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request.";
}

echo json_encode($data);
?>