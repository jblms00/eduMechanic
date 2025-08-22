<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['rid']) && !empty($_GET['rid'])) {
        $readingId = mysqli_real_escape_string($con, $_GET['rid']);
        $quizId = mysqli_real_escape_string($con, $_GET['qz']);

        $sql = "
            SELECT 
                q.quiz_id, 
                q.reading_id, 
                q.quiz_number, 
                q.quiz_duration, 
                q.datetime_created,
                qq.questionnaire_id,
                qq.question, 
                qq.choices, 
                qq.answer
            FROM quiz q
            LEFT JOIN quiz_questionnaire qq ON q.quiz_id = qq.quiz_id
            WHERE q.reading_id = '$readingId'
            AND qq.quiz_id = '$quizId'
        ";

        $result = mysqli_query($con, $sql);

        if ($result) {
            $questions = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $questions[] = $row;
            }

            if (!empty($questions)) {
                $data['status'] = "success";
                $data['data'] = $questions;
            } else {
                $data['status'] = "error";
                $data['message'] = "No quizzes or questions found for the specified reading ID.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Query error: " . mysqli_error($con);
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Missing or invalid reading ID.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>