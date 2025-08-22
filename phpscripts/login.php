<?php
session_start();
include("database-connection.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../assets/vendor/autoload.php';

$data = [];

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === "POST") {
    // Sanitize input
    $userEmail = mysqli_real_escape_string($con, $_POST['userEmail']);
    $userPassword = $_POST['userPassword'];
    $userType = mysqli_real_escape_string($con, $_POST['userType']);

    // Validate required fields
    if (empty($userEmail) || empty($userPassword)) {
        $data['status'] = "error";
        $data['message'] = "Email and password are required.";
        echo json_encode($data);
        exit;
    }

    // Determine table and session keys based on user type
    $table = $userType === "user" ? "user_data" : ($userType === "admin" ? "admin_data" : null);
    $emailField = $userType === "user" ? "user_email" : "admin_email";
    $passwordField = $userType === "user" ? "user_password" : "admin_password";
    $nameField = $userType === "user" ? "user_first_name" : "admin_name";
    $idField = $userType === "user" ? "user_id" : "admin_id";

    if (!$table) {
        $data['status'] = "error";
        $data['message'] = "Invalid user type. Please select 'student' or 'admin'.";
        echo json_encode($data);
        exit;
    }

    // Query the database
    $query = "SELECT * FROM $table WHERE $emailField = '$userEmail'";
    $result = mysqli_query($con, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $userData = mysqli_fetch_assoc($result);
        $userId = $userData[$idField];

        // Verify password
        if (base64_encode($userPassword) === $userData[$passwordField]) {
            if ($userData['is_verified'] == true) {
                // Set session variables
                $_SESSION[$userType . '_id'] = $userData[$userType . '_id'];
                $_SESSION[$emailField] = $userData[$emailField];

                $data['status'] = "success";
                $data['message'] = "Login Successfully!";
            } else {
                $verificationId = rand(100000, 999999);
                $verificationCode = rand(100000, 999999);

                $insert_code_query = "INSERT INTO account_verification (verification_id, user_id, verification_code) VALUES ('$verificationId', '$userId', '$verificationCode')";
                $insert_code_result = mysqli_query($con, $insert_code_query);

                if ($insert_code_result) {
                    send2FACode($userData[$emailField], $userData[$nameField], $verificationCode);

                    $data['userType'] = $userType;
                    $data['userId'] = $userId;
                    $data['status'] = "2fa_required";
                    $data['message'] = "A verification code has been sent to your email.";
                } else {
                    $data['status'] = "error";
                    $data['message'] = "Error sending verification to your email";
                }
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Incorrect password. Please try again.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = ucfirst($userType) . " account not found.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method. Please try again.";
}

echo json_encode($data);

function send2FACode($user_email, $user_name, $verification_code)
{
    $mail = new PHPMailer(true);

    try {
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'edumechanic123@gmail.com';
        $mail->Password = 'rxqq jgzs vute ngqo';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('edumechanic123@gmail.com', 'Edu Mechanic Support Team');
        $mail->addAddress($user_email, $user_name);

        $mail->isHTML(true);
        $mail->Subject = "Verify Your Account - Edu Mechanic";
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;'>
            <img src='https://springgreen-boar-342142.hostingersite.com/assets/images/EduMechanic_Logo-.webp' alt='Edu Mechanic Logo' style='max-width: 150px; margin-bottom: 20px;'>
            <div style='background: #f4f4f4; padding: 20px; border-radius: 8px;'>
                <h2 style='color: #000034;'>Hello, $user_name!</h2>
                <p>We received a request to log into your Edu Mechanic account. To complete the login process, please use the verification code below:</p>
                <p style='font-size: 24px; font-weight: bold; color: #000034; background: #e8e8ff; padding: 10px; display: inline-block; border-radius: 5px;'>$verification_code</p>
                <p>If you didn't request this, please ignore this email or contact support.</p>
            </div>
            <p style='margin-top: 20px;'>Thank you,<br>
            <strong>Edu Mechanic Support Team</strong></p>
            <p style='font-size: 12px; color: #888;'>This is an automated message, please do not reply directly to this email.</p>
        </div>";
        $mail->send();
    } catch (Exception $e) {
        error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
    }
}
?>