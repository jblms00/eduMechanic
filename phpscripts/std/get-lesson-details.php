<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $readingId = mysqli_real_escape_string($con, $_GET['id']);

        // SQL to fetch data from readings_lessons
        $sql = "
            SELECT * 
            FROM readings_lessons 
            WHERE reading_id = '$readingId'
        ";

        $result = mysqli_query($con, $sql);

        if ($result) {
            if (mysqli_num_rows($result) > 0) {
                $data['status'] = "success";
                $data['data'] = mysqli_fetch_assoc($result);
            } else {
                $data['status'] = "error";
                $data['message'] = "No data found for the specified ID.";
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