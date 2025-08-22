<?php
session_start();
include("../phpscripts/database-connection.php");
include("../phpscripts/check-login.php");
$admin_data = check_login($con);
?>
<!doctype html>
<html lang="en">

<head>
    <?php include("../includes/header.php"); ?>
</head>

<body class="admin-side" style="background-color: #000034;">
    <?php include("../includes/components/sidebar.php"); ?>
    <div class="home-section">
        <section style="padding: 3rem;">
            <div class="page-title">
                <h1 class="mb-0 fw-bold animation-left">Manage Quiz</h1>
            </div>
            <div class="container table-container animation-left">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <button type="button" class="btn btn-primary btn-sm animation-right" id="addQuiz">
                        Add New Quiz
                    </button>
                    <input type="text" id="searchBar" class="form-control" placeholder="Search quizzes..."
                        style="width: 30%;" />
                </div>
                <table class="table table-bordered table-striped table-light border border-opacity-50" id="quizTable">
                    <thead>
                        <tr>
                            <th class="text-center">#</th>
                            <th>Title</th>
                            <th class="text-center">Passing Percentage</th>
                            <th class="text-center">Quiz Duration</th>
                            <th class="text-center">Due Date</th>
                            <th class="text-center">Options</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </section>
    </div>
    <?php include("../includes/components/toast.php"); ?>
    <?php include("../includes/components/modal.php"); ?>
    <?php include("../includes/scripts.php"); ?>
    <script src="../assets/js/components/sidebar.js"></script>
    <script src="../assets/js/components/modal.js"></script>
    <script src="../assets/js/usr/formatDateTime.js"></script>
    <script src="../assets/js/usr/formatDateOnly.js"></script>
    <script src="../assets/js/usr/getPassingStatus.js"></script>
    <script src="../assets/js/usr/manageQuiz.js"></script>
</body>

</html>