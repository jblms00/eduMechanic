<?php
session_start();
include("../database-connection.php");

require '../../assets/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        $data['status'] = 'error';
        $data['message'] = 'Please upload a valid Excel or CSV file.';
        echo json_encode($data);
        exit;
    }

    $file = $_FILES['file'];
    $fileType = pathinfo($file['name'], PATHINFO_EXTENSION);

    if (!in_array($fileType, ['csv', 'xls', 'xlsx'])) {
        $data['status'] = 'error';
        $data['message'] = 'Only Excel (.xls, .xlsx) and CSV files are allowed.';
        echo json_encode($data);
        exit;
    }

    try {
        $spreadsheet = IOFactory::load($file['tmp_name']);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray();

        // Skip the first row if it's a header
        array_shift($rows);

        $studentsInserted = 0;
        $studentsSkipped = 0;

        foreach ($rows as $row) {
            if (count($row) < 4) {
                continue;
            }

            $studentId = mysqli_real_escape_string($con, trim($row[0]));
            $studentFirstName = mysqli_real_escape_string($con, trim($row[1]));
            $studentLastName = mysqli_real_escape_string($con, trim($row[2]));
            $studentEmail = mysqli_real_escape_string($con, trim($row[3]));

            if (!filter_var($studentEmail, FILTER_VALIDATE_EMAIL)) {
                continue; // Skip invalid emails
            }

            // Check if student already exists
            $checkQuery = "SELECT COUNT(*) AS count FROM user_data WHERE user_id = '$studentId'";
            $result = mysqli_query($con, $checkQuery);
            $rowCount = mysqli_fetch_assoc($result)['count'];

            if ($rowCount > 0) {
                $studentsSkipped++;
                continue; // Skip already inserted student
            }

            // Generate password
            $lastFiveDigits = substr($studentId, -5);
            $lastTwoLetters = substr($studentLastName, -2);
            $formattedLastTwoLetters = ucfirst(strtolower($lastTwoLetters));
            $rawPassword = $formattedLastTwoLetters . "#" . $lastFiveDigits;
            $formattedPassword = ucfirst($rawPassword);
            $base64Password = base64_encode($formattedPassword);

            // Insert new student
            $sql = "INSERT INTO user_data (user_id, user_first_name, user_last_name, user_email, user_password, datetime_created, is_verified) 
                    VALUES ('$studentId', '$studentFirstName', '$studentLastName', '$studentEmail', '$base64Password', NOW(), 0)";

            if (mysqli_query($con, $sql)) {
                $studentsInserted++;
            }
        }

        if ($studentsInserted > 0) {
            $data['status'] = 'success';
            $data['message'] = "$studentsInserted student(s) added successfully. $studentsSkipped student(s) skipped (already inserted).";
        } else {
            $data['status'] = 'error';
            $data['message'] = $studentsSkipped > 0
                ? "No new students were added. $studentsSkipped student(s) were already inserted."
                : "No students were added. Please check your file format.";
        }
    } catch (Exception $e) {
        $data['status'] = 'error';
        $data['message'] = 'Error processing file: ' . $e->getMessage();
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request or missing data.';
}

echo json_encode($data);
?>