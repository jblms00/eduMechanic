<?php
session_start();
include("../database-connection.php");

header("Content-Type: application/json");
$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode the JSON input
    $input = json_decode(file_get_contents("php://input"), true);

    // Check if model_id exists
    if (isset($input['model_id'])) {
        $modelId = mysqli_real_escape_string($con, $input['model_id']);

        $sql = "SELECT title, description, file FROM 3d_models WHERE model_id = '$modelId'";
        $result = mysqli_query($con, $sql);

        if ($result && mysqli_num_rows($result) > 0) {
            $data['status'] = "success";
            $data['model'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
        } else {
            $data['status'] = "error";
            $data['message'] = "No data found for the specified ID.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Missing model ID.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>