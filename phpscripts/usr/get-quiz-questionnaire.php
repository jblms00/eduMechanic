<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['quizId']) && !empty(trim($_GET['quizId']))) {
        $quizId = mysqli_real_escape_string($con, trim($_GET['quizId']));

        $sql = "SELECT * FROM quiz_questionnaire WHERE quiz_id = '$quizId'";
        $result = mysqli_query($con, $sql);

        if ($result) {
            if (mysqli_num_rows($result) > 0) {
                $questionnaires = [];
                while ($row = mysqli_fetch_assoc($result)) {
                    $questionnaires[] = $row;
                }
                $data['status'] = "success";
                $data['questionnaires'] = $questionnaires;
            } else {
                $data['status'] = "error";
                $data['message'] = "No questionnaires found for the provided reading ID.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Database query error: " . mysqli_error($con);
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Missing or invalid reading ID.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method. Use GET.";
}

echo json_encode($data);
?>