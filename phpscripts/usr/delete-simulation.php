<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['model_id'])) {
        $modelId = mysqli_real_escape_string($con, $_POST['model_id']);

        $fetchQuery = "SELECT file FROM 3d_models WHERE model_id = '$modelId'";
        $fetchResult = mysqli_query($con, $fetchQuery);

        if ($fetchResult && mysqli_num_rows($fetchResult) > 0) {
            $fetchData = mysqli_fetch_assoc($fetchResult);
            $filePath = "../../assets/models/" . $fetchData['file'];

            $query = "DELETE FROM 3d_models WHERE model_id = '$modelId'";
            $result = mysqli_query($con, $query);

            if ($result) {
                $data['status'] = "success";
                $data['message'] = "Simulation deleted successfully.";

                if ($filePath && file_exists($filePath)) {
                    if (unlink($filePath)) {
                        $data['message'] = "Simulation deleted successfully.";
                    } else {
                        $data['message'] = "Failed to delete the simulation file.";
                    }
                } else {
                    $data['message'] = "File does not exist.";
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "Failed to delete simulation.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Simulation not found or invalid ID.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Simulation ID is missing.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>