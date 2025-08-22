<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['readingId']) && !empty(trim($_GET['readingId']))) {
        $readingId = mysqli_real_escape_string($con, trim($_GET['readingId']));

        $sql = "SELECT * FROM quiz WHERE reading_id = '$readingId' ORDER BY datetime_created ASC";
        $result = mysqli_query($con, $sql);

        if ($result) {
            if (mysqli_num_rows($result) > 0) {
                $quizzes = [];
                while ($row = mysqli_fetch_assoc($result)) {
                    $quizzes[] = $row;
                }
                $data['status'] = "success";
                $data['quizzes'] = $quizzes;
            } else {
                $data['status'] = "error";
                $data['message'] = "No quizzes found for the provided reading ID.";
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