<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM readings_lessons";
    $result = mysqli_query($con, $sql);

    if ($result) {
        if (mysqli_num_rows($result) > 0) {
            $readings = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $readings[] = $row;
            }
            $data['status'] = "success";
            $data['data'] = $readings;
        } else {
            $data['status'] = "error";
            $data['message'] = "No readings found.";
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