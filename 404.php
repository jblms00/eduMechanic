<?php
session_start();
include("phpscripts/database-connection.php");
include("phpscripts/check-login.php");
?>
<!doctype html>
<html lang="en">

<head>
    <?php include("includes/header.php"); ?>
</head>

<body class="homepage">
    <main class="d-flex align-items-center" style="height: 100vh;">
        <section class="error-page container">
            <div class="row">
                <div class="col text-center">
                    <img src="assets/images/EduMechanic_Logo-.webp" class="animation-fade-in object-fit-contain"
                        width="200" height="200" alt="IMCCS Logo">
                    <div class="school-name animation-fade-in">
                        <h3 class="custom-text-color fw-bold mb-4">Edu Mechanic</h3>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col text-center animation-fade-in">
                    <h1 class="fw-semibold text-uppercase">404 Not Found</h1>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col text-center animation-fade-in">
                    <h4>Sorry, the page you are looking for does not exist.</h4>
                </div>
            </div>
            <div class="row">
                <div class="col text-center animation-fade-in">
                    <button onclick="history.back()" class="btn btn-primary" style="width: 15%;">Go Back</button>
                </div>
            </div>
        </section>
    </main>
    <?php include("includes/scripts.php"); ?>
</body>

</html>