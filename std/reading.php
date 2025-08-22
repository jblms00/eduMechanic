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
            <div class="cs-wrapper">
                <div class="cs-sidebar animation-left">
                    <div class="accordion" id="accordionExample">
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button fw-bold" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Chapter 1
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show"
                                data-bs-parent="#accordionExample">
                                <div class="accordion-body p-0">
                                    <ul>
                                        <li class="link-active" data-section="Introduction">Introduction</li>
                                        <li data-section="Content">Content</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button fw-bold" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                    Graded Tasks
                                </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse show"
                                data-bs-parent="#accordionExample">
                                <div class="accordion-body p-0">
                                    <ul id="taskList"></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cs-content is-active animation-fade-in">
                    <div class="cs-description"></div>
                    <div class="cs-data-content">
                        <!-- The PDF will be embedded here -->
                        <div class="pdf-container"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <?php include("../includes/components/modal.php"); ?>
    <?php include("../includes/scripts.php"); ?>
    <script src="../assets/js/components/sidebar.js"></script>
    <script src="../assets/js/std/getReading.js"></script>

</body>

</html>