<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['quizId']) && !empty(trim($_GET['quizId']))) {
        $quizId = mysqli_real_escape_string($con, trim($_GET['quizId']));

        $sql = "
            SELECT us.*, ud.user_first_name, ud.user_last_name, q.passing_percentage,
                (SELECT COUNT(*) FROM quiz_questionnaire qq WHERE qq.quiz_id = '$quizId') AS total_questions,
                qa.attempt_id, qa.datetime_attempted
            FROM user_scores us
            JOIN user_data ud ON us.user_id = ud.user_id
            JOIN quiz q ON us.task_id = q.quiz_id
            LEFT JOIN quiz_attempts qa ON qa.user_id = us.user_id AND qa.quiz_id = q.quiz_id
            WHERE us.task_id = '$quizId' AND us.task_type = 'quiz'
        ";
        $result = mysqli_query($con, $sql);

        if ($result) {
            if (mysqli_num_rows($result) > 0) {
                $scores = [];
                while ($row = mysqli_fetch_assoc($result)) {
                    $scores[] = $row;
                }
                $data['status'] = "success";
                $data['scores'] = $scores;
            } else {
                $data['status'] = "error";
                $data['message'] = "Currently, no students have taken the quiz.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Database query error: " . mysqli_error($con);
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Missing or invalid quiz ID.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method. Use GET.";
}

echo json_encode($data);
?>