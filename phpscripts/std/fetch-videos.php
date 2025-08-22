<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM video_demonstration";
    $result = mysqli_query($con, $sql);

    if ($result) {
        if (mysqli_num_rows($result) > 0) {
            $videos = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $videos[] = $row;
            }
            $data['status'] = "success";
            $data['videos'] = $videos;
        } else {
            $data['status'] = "error";
            $data['message'] = "No videos found.";
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