<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['studentId']) && !empty(trim($_GET['studentId']))) {
        $studentId = mysqli_real_escape_string($con, trim($_GET['studentId']));

        $sql = "
            SELECT 
                us.*, q.passing_percentage,
                (SELECT COUNT(*) FROM quiz_questionnaire qq WHERE qq.quiz_id = us.task_id) AS total_questions,
                (SELECT COUNT(*) FROM quiz_questionnaire qq WHERE qq.quiz_id = us.task_id) AS total_questions,
                qa.attempt_id AS quiz_attempt_id, qa.datetime_attempted AS quiz_datetime_attempted,
                a.activity_id, a.reading_id, a.activity_title, a.passing_percentage AS activity_passing_percentage,
                a.activity_number, a.activity_due_date, a.datetime_created,
                aa.activity_attempt_id, aa.datetime_attempted AS activity_datetime_attempted
            FROM user_scores us
            LEFT JOIN quiz q ON us.task_id = q.quiz_id
            LEFT JOIN quiz_attempts qa ON qa.user_id = us.user_id AND qa.quiz_id = q.quiz_id
            LEFT JOIN activities a ON us.task_id = a.activity_id
            LEFT JOIN activity_attempts aa ON aa.user_id = us.user_id AND aa.activity_id = a.activity_id
            WHERE us.user_id = '$studentId' AND (us.task_type = 'quiz' OR us.task_type = 'activity')
        ";

        $result = mysqli_query($con, $sql);

        if ($result) {
            if (mysqli_num_rows($result) > 0) {
                $records = [];
                while ($row = mysqli_fetch_assoc($result)) {
                    $records[] = $row;
                }
                $data['status'] = "success";
                $data['records'] = $records;
            } else {
                $data['status'] = "error";
                $data['message'] = "No records found for this student.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Database query error: " . mysqli_error($con);
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Missing or invalid student ID.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method. Use GET.";
}

echo json_encode($data);
?>