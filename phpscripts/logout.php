<?php
session_start();
include("database-connection.php");

if (isset($_SESSION['user_email'])) {
    $user_email = $_SESSION['user_email'];
    unset($_SESSION['user_email']);
    unset($_SESSION['user_id']);
    session_destroy();
    header("Location: ../");
    exit;
} else if (isset($_SESSION['admin_email']) || isset($_SESSION['admin_id'])) {
    $admin_identifier = isset($_SESSION['admin_email']) ? $_SESSION['admin_email'] : $_SESSION['admin_id'];
    unset($_SESSION['admin_email']);
    unset($_SESSION['admin_id']);
    unset($_SESSION['admin_type']);
    session_destroy();
    header("Location: ../");
    exit;
} else {
    header("Location: ../");
    exit;
}
