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
                <h1 class="mb-0 fw-bold animation-left">Welcome to Edu Mechanic!</h1>
                <a href="profile" class="user-profile text-dark animation-right">
                    <img src="../assets/images/userProfileImgs/<?php echo $user_profile; ?>" alt="profile photo">
                </a>
            </div>
            <div class="container-fluid banner animation-fade-in" style="background-color: #f0f0f0; padding: 5rem;">
                <div class="row align-items-center">
                    <div class="col animation-left">
                        <h2 class="fw-bold mb-3">Preparation for Automotive Mechanics NC I</h2>
                        <h5 class="fw-bold mb-4">Unleash the full potential of auto mechanics with Edu Mechanic,
                            featuring comprehensive lessons on various mechanic tools and equipment, preventive
                            maintenance services (PMS), and more!</h5>
                        <a href="readings" class="btn btn-primary">Explore Modules</a>
                    </div>
                    <div class="col animation-right text-center">
                        <img src="../assets/images/8a8dbae7761780ed1ab8e57f4f21e26c.webp" height="100%" width="500"
                            class="img-fluid object-fit-contain" alt="img">
                    </div>
                </div>
            </div>
            <div class="container container-materials" style="padding: 3rem;">
                <h2 class="text-center fw-bold mb-5 animation-downwards">Learning Materials right for you</h2>
                <div class="row">
                    <div class="col">
                        <div class="card animation-right">
                            <img src="../assets/images/home_readings.webp" class="card-img-top" alt="img">
                            <div class="card-body pb-0">
                                <h5 class="card-title fw-semibold">Readings</h5>
                                <p class="card-text">Explore various modules on the essential competency designed for
                                    automotive mechanics.</p>
                            </div>
                            <div class="card-footer border-0" style="background: none;">
                                <a href="readings" class="btn btn-primary rounded-pill fw-bold">Go to Readings</a>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card animation-right">
                            <img src="../assets/images/home_videos.webp" class="card-img-top" alt="img">
                            <div class="card-body pb-0">
                                <h5 class="card-title fw-semibold">Videos</h5>
                                <p class="card-text">Access tutorials on the preventive maintenance services (PMS) on
                                    using different mechanic tools and equipment to enhance automotive mechanics skills.
                                </p>
                            </div>
                            <div class="card-footer border-0" style="background: none;">
                                <a href="videos" class="btn btn-primary rounded-pill fw-bold">Go to Videos</a>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card animation-right">
                            <img src="../assets/images/home_simulations.webp" class="card-img-top" alt="img">
                            <div class="card-body pb-0">
                                <h5 class="card-title fw-semibold">Simulation</h5>
                                <p class="card-text">Engage 3D simulations in applying automotive mechanics skills,
                                    specifically preventive maintenance services (PMS).</p>
                            </div>
                            <div class="card-footer border-0" style="background: none;">
                                <a href="simulation" class="btn btn-primary rounded-pill fw-bold">Go to Simulation</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <?php include("../includes/components/modal.php"); ?>
    <?php include("../includes/scripts.php"); ?>
    <script src="../assets/js/components/sidebar.js"></script>
</body>

</html>