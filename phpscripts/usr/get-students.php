<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM user_data";
    $result = mysqli_query($con, $sql);

    if ($result) {
        if (mysqli_num_rows($result) > 0) {
            $students = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $students[] = $row;
            }
            $data['status'] = "success";
            $data['students'] = $students;
        } else {
            $data['status'] = "error";
            $data['message'] = "No students found.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Query error: " . mysqli_error($con);
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>