<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $simulationTitle = mysqli_real_escape_string($con, $_POST['simulationTitle']);
    $simulationUrl = mysqli_real_escape_string($con, $_POST['simulationUrl']);
    $simulationBanner = isset($_FILES['simulationBanner']) ? $_FILES['simulationBanner'] : null;
    $simulationFile = isset($_FILES['simulationFile']) ? $_FILES['simulationFile'] : null;

    // Validate required fields
    if (empty($simulationTitle) || empty($simulationUrl)) {
        $data['status'] = "error";
        $data['message'] = "All fields are required.";
    } elseif (!$simulationBanner || $simulationBanner['error'] != 0) {
        $data['status'] = "error";
        $data['message'] = "Simulation banner is required.";
    } elseif ($simulationBanner['size'] > 40 * 1024 * 1024) { // 40MB limit
        $data['status'] = "error";
        $data['message'] = "Banner exceeds the maximum allowed size (40MB).";
    } elseif (strlen($simulationTitle) < 3 || strlen($simulationTitle) > 100) {
        $data['status'] = "error";
        $data['message'] = "Title must be between 3 and 100 characters.";
    } elseif (!$simulationFile || $simulationFile['error'] != 0) {
        $data['status'] = "error";
        $data['message'] = "Simulation file is required.";
    } else {
        $bannerUploadDir = "../../assets/images/";
        $allowedBannerTypes = ['image/jpeg', 'image/jpg'];

        $bannerFileName = uniqid() . '-' . basename($simulationBanner['name']);
        $bannerUploadPath = $bannerUploadDir . $bannerFileName;

        $simulationUploadDir = "../../assets/models/";
        $allowedSimulationTypes = ['glb', 'gltf'];

        $simulationFileExtension = pathinfo($simulationFile['name'], PATHINFO_EXTENSION);
        $simulationFileName = uniqid() . '-' . basename($simulationFile['name']);
        $simulationUploadPath = $simulationUploadDir . $simulationFileName;

        if (!in_array($simulationBanner['type'], $allowedBannerTypes)) {
            $data['status'] = "error";
            $data['message'] = "Invalid banner file. Only JPG and JPEG files are allowed.";
        } elseif (!move_uploaded_file($simulationBanner['tmp_name'], $bannerUploadPath)) {
            $data['status'] = "error";
            $data['message'] = "Failed to upload the banner. Error code: " . $simulationBanner['error'];
        } elseif (!in_array($simulationFileExtension, $allowedSimulationTypes)) {
            $data['status'] = "error";
            $data['message'] = "Invalid simulation file type. Only GLB and GLTF files are allowed.";
        } elseif (!move_uploaded_file($simulationFile['tmp_name'], $simulationUploadPath)) {
            $data['status'] = "error";
            $data['message'] = "Failed to upload the simulation file. Error code: " . $simulationFile['error'];
        } else {
            $modelId = rand(100000, 999999);
            $sql = "INSERT INTO 3d_models (model_id, title, banner, file, datetime_created) 
                    VALUES ('$modelId', '$simulationTitle', '$bannerFileName', '$simulationFileName', NOW())";

            if (mysqli_query($con, $sql)) {
                $data['status'] = "success";
                $data['message'] = "3D Model added successfully.";
            } else {
                $data['status'] = "error";
                $data['message'] = "Error adding model: " . mysqli_error($con);
            }
        }
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>