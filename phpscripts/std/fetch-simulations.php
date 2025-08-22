<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM 3d_models";
    $result = mysqli_query($con, $sql);

    if ($result) {
        if (mysqli_num_rows($result) > 0) {
            $simulations = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $simulations[] = $row;
            }
            $data['status'] = "success";
            $data['simulations'] = $simulations;
        } else {
            $data['status'] = "error";
            $data['message'] = "No simulations found.";
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