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
            <div class="text-end p-4">
                <a href="profile" class="user-profile text-dark animation-right">
                    <img src="../assets/images/userProfileImgs/<?php echo $user_profile; ?>" alt="profile photo">
                </a>
            </div>
            <div class="text-center">
                <h1 class="mb-5 fw-bold animation-left">Preventive Maintenance Service Simulations</h1>
            </div>
            <div class="container-fluid" id="containerSimulations" style="padding: 2rem;"></div>
        </section>
    </div>
    <?php include("../includes/components/modal.php"); ?>
    <?php include("../includes/scripts.php"); ?>
    <script src="../assets/js/components/sidebar.js"></script>
    <script src="../assets/js/std/displaySimulations.js"></script>
</body>

</html>