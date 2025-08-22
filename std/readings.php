<?php
session_start();
include("../phpscripts/database-connection.php");
include("../phpscripts/check-login.php");
$user_data = check_login($con);
$user_profile = $user_data['user_photo'];
?>
<!doctype html>
<html lang="en">

<head>
    <?php include("../includes/header.php"); ?>
</head>

<body style="background-color: #000034;">
    <?php include("../includes/components/sidebar.php"); ?>
    <div class="home-section">
        <section>
            <div class="page-title d-flex align-items-center justify-content-between">
                <h1 class="mb-0 fw-bold animation-left">Readings</h1>
                <a href="profile" class="user-profile text-dark animation-right">
                    <img src="../assets/images/userProfileImgs/<?php echo $user_profile; ?>" alt="profile photo">
                </a>
            </div>
            <ul class="nav nav-tabs justify-content-evenly readings-tab animation-downwards">
                <li class="nav-item text-center" style="width: 20%;">
                    <a class="nav-link active" href="#">All</a>
                </li>
                <li class="nav-item text-center" style="width: 20%;">
                    <a class="nav-link" href="#">Beginner</a>
                </li>
                <li class="nav-item text-center" style="width: 20%;">
                    <a class="nav-link" href="#">Intermediate</a>
                </li>
                <li class="nav-item text-center" style="width: 20%;">
                    <a class="nav-link" href="#">Advanced</a>
                </li>
            </ul>
            <div class="container-fluid" id="containerReadings" style="padding: 2rem;"></div>
        </section>
    </div>
    <?php include("../includes/components/modal.php"); ?>
    <?php include("../includes/scripts.php"); ?>
    <script src="../assets/js/components/sidebar.js"></script>
    <script src="../assets/js/std/displayReadings.js"></script>
</body>

</html>