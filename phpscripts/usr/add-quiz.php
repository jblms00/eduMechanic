<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (empty($_POST['quizTitle']) || strlen($_POST['quizTitle']) < 3 || strlen($_POST['quizTitle']) > 100) {
        $data['status'] = 'error';
        $data['message'] = 'Quiz title is required and must be between 3 and 100 characters.';
        exit;
    } else if (empty($_POST['readingId']) || !is_numeric($_POST['readingId'])) {
        $data['status'] = 'error';
        $data['message'] = 'A valid reading ID is required.';
    } else if (empty($_POST['newQuizNumber'])) {
        $data['status'] = 'error';
        $data['message'] = 'Please enter the quiz number.';
    } else if (empty($_POST['newQuizDuration'])) {
        $data['status'] = 'error';
        $data['message'] = 'Please enter the quiz duration.';
    } else if (empty($_POST['newQuizDueDate'])) {
        $data['status'] = 'error';
        $data['message'] = 'Please enter the quiz due date.';
    } else if (!preg_match('/^(?:[01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/', $_POST['newQuizDuration'])) {
        $data['status'] = 'error';
        $data['message'] = 'Quiz duration must be in the format HH:MM:SS (24-hour format).';
        exit;
    } else if (empty($_POST['newQuizPassingPercentage'])) {
        $data['status'] = 'error';
        $data['message'] = 'Please enter the quiz passing percentage.';
    } else if (empty($_POST['questions']) || !is_array(json_decode($_POST['questions'], true)) || count(json_decode($_POST['questions'], true)) < 5) {
        $data['status'] = 'error';
        $data['message'] = 'You must add at least 10 questions.';
    } else {
        $readingId = mysqli_real_escape_string($con, $_POST['readingId']);
        $quizTitle = mysqli_real_escape_string($con, $_POST['quizTitle']);
        $newQuizNumber = mysqli_real_escape_string($con, $_POST['newQuizNumber']);
        $newQuizDuration = mysqli_real_escape_string($con, $_POST['newQuizDuration']);
        $newQuizDueDate = mysqli_real_escape_string($con, $_POST['newQuizDueDate']);
        $newQuizPassingPercentage = mysqli_real_escape_string($con, $_POST['newQuizPassingPercentage']);
        $questions = json_decode($_POST['questions'], true);

        // Generate a quiz ID (you can keep it as is if you prefer)
        $quizId = rand(100000, 999999);

        // Insert the quiz into the quiz table
        $sqlQuiz = "INSERT INTO quiz (quiz_id, quiz_title, reading_id, passing_percentage, quiz_number, quiz_duration, quiz_due_date, datetime_created) VALUES ('$quizId', '$quizTitle', '$readingId', '$newQuizPassingPercentage', '$newQuizNumber', '$newQuizDuration', '$newQuizDueDate', NOW())";
        if (!mysqli_query($con, $sqlQuiz)) {
            $data['status'] = 'error';
            $data['message'] = 'Failed to add the quiz.';
            echo json_encode($data);
            exit;
        }

        // Get the inserted quiz ID
        $quizId = mysqli_insert_id($con);

        // Insert each question into the quiz_questionnaire table
        foreach ($questions as $question) {
            // Sanitize the question and choices before insertion
            $questionText = mysqli_real_escape_string($con, $question['question']);
            $choices = mysqli_real_escape_string($con, str_replace("||", " || ", $question['choices']));
            $answer = mysqli_real_escape_string($con, $question['answer']);

            // Insert the question into the quiz_questionnaire table
            $sqlQuestion = "INSERT INTO quiz_questionnaire (quiz_id, question, choices, answer) 
                            VALUES ('$quizId', '$questionText', '$choices', '$answer')";
            if (!mysqli_query($con, $sqlQuestion)) {
                $data['status'] = 'error';
                $data['message'] = 'Failed to add the questions.';
                echo json_encode($data);
                exit;
            }
        }

        $data['status'] = 'success';
        $data['message'] = 'Quiz added successfully.';
    }

} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request or missing data.';
}

echo json_encode($data);
?>