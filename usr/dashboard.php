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
    <div class="home-section dashboard">
        <section>
            <div class="page-title">
                <h1 class="mb-0 fw-bold animation-left">Dashboard</h1>
            </div>
            <div class="container p-3">
                <div class="cards-container">
                    <div class="row mb-4">
                        <div class="col-md-4">
                            <div class="card p-3 animation-downwards">
                                <h5 class="fw-bold">Total Students</h5>
                                <h2 id="totalStudents">0</h2>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card p-3 animation-downwards">
                                <h5 class="fw-bold">Total Quizzes</h5>
                                <h2 id="totalQuizzes">0</h2>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card p-3 animation-downwards">
                                <h5 class="fw-bold">Total Activities</h5>
                                <h2 id="totalActivities">0</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="charts-container">
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <div class="card p-3 animation-left" style="height: 430px;">
                                <h5 class="fw-bold">Activity Completion</h5>
                                <div id="activityChart"></div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card p-3 animation-right" style="height: 430px;">
                                <h5 class="fw-bold">Quiz Performance</h5>
                                <div id="quizChart"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="card p-3 animation-upwards">
                            <h5 class="fw-bold">Recent Tasks</h5>
                            <table class="table table-striped table-responsive" id="recentTasks">
                                <thead>
                                    <tr>
                                        <th class="text-center">#</th>
                                        <th class="text-center">Student</th>
                                        <th class="text-center">Task</th>
                                        <th class="text-center">Score</th>
                                        <th class="text-center">Status</th>
                                        <th class="text-center">Date</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <?php include("../includes/components/modal.php"); ?>
    <?php include("../includes/scripts.php"); ?>
    <script src="../assets/js/components/sidebar.js"></script>
    <script src="../assets/js/usr/formatDateTime.js"></script>
    <script src="../assets/js/usr/dashboard.js"></script>
</body>

</html>