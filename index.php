<?php session_start();
include("phpscripts/database-connection.php");
include("phpscripts/check-login.php"); ?>
<!doctype html>
<html lang="en">

<head>
    <?php include("includes/header.php"); ?>
    <style>
        body {
            background-color: #f4f0e5;
        }
    </style>
</head>

<body>
    <main class="homepage">
        <div class="container d-flex flex-column justify-content-center align-items-center gap-3"
            style="height: 100vh;">
            <div class="box-container login-container animation-right">
                <form id="loginForm" class="login needs-validation" novalidate>
                    <div class="text-center">
                        <img src="assets/images/EduMechanic_Logo-.webp" width="200" height="200" alt="logo">
                    </div>
                    <h3 class="text-uppercase text-center fw-bold mb-4">Sign In</h3>
                    <div class="row mb-3">
                        <div class="col">
                            <select class="form-select" id="loginUserType" aria-label="Select user type" required>
                                <option selected disabled>Please select user type</option>
                                <option value="user">Student</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div class="invalid-feedback fw-semibold">Please select a user type.</div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <input type="email" id="loginEmail" class="form-control login-form" placeholder="Email"
                                required>
                            <div class="invalid-feedback fw-semibold">Please enter your email address.</div>
                        </div>
                    </div>
                    <div class="row mb-4">
                        <div class="col">
                            <input type="password" id="loginPassword" class="form-control login-form"
                                placeholder="Password" required>
                            <div class="invalid-feedback fw-semibold">Please enter your password.</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col text-center">
                            <button type="submit"
                                class="btn btn-warning text-light fw-bold w-25 login-account">Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </main>
    <?php include("includes/components/toast.php"); ?>
    <?php include("includes/scripts.php"); ?>
    <script src="assets/js/login.js"></script>
</body>

</html>