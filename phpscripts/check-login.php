<?php

function check_login($con)
{
    if (isset($_SESSION['user_email']) || isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
        $user_email = $_SESSION['user_email'];

        $query = "SELECT * FROM user_data WHERE user_id = '$user_id' OR user_email = '$user_email'LIMIT 1";
        $result = mysqli_query($con, $query);

        if ($result && mysqli_num_rows($result) > 0) {
            $user_data = mysqli_fetch_assoc($result);
            return $user_data;
        }
    } else if (isset($_SESSION['admin_email']) || isset($_SESSION['admin_id'])) {
        $admin_id = $_SESSION['admin_id'];
        $admin_email = $_SESSION['admin_email'];

        $query = "SELECT * FROM admin_data WHERE admin_id = '$admin_id' OR admin_email = '$admin_email'LIMIT 1";
        $result = mysqli_query($con, $query);

        if ($result && mysqli_num_rows($result) > 0) {
            $admin_data = mysqli_fetch_assoc($result);
            return $admin_data;
        }
    }

    header("Location: ./");
    die;
}
