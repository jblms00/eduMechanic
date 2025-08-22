<?php
session_start();
include("../phpscripts/database-connection.php");
include("../phpscripts/check-login.php");
$user_data = check_login($con);
$user_profile = $user_data['user_photo'];
$user_id = $user_data['user_id'];
?>
<!doctype html>
<html lang="en">

<head>
    <?php include("../includes/header.php"); ?>
</head>

<body style="background-color: #000034;" data-user-id="<?php echo $user_id; ?>">
    <?php include("../includes/components/sidebar.php"); ?>
    <div class="home-section">
        <section>
            <div class="page-title d-flex align-items-center justify-content-between">
                <h1 class="mb-0 fw-bold animation-left">Grades</h1>
                <a href="profile" class="user-profile text-dark animation-right">
                    <img src="../assets/images/userProfileImgs/<?php echo $user_profile; ?>" alt="profile photo">
                </a>
            </div>
            <div class="container-fluid containter-grades">
                <h1 class="text-center fw-bold animation-downwards">Progress Report</h1>
                <div class="row">
                    <div class="col-8">
                        <div class="table-container animation-left">
                            <div class="d-flex gap-3 justify-content-between align-items-center mb-3">
                                <input type="text" class="form-control w-50 search-bar" placeholder="Search here..">
                                <select class="form-select filter-status ms-auto" aria-label="Filter status"
                                    style="width: 13%;">
                                    <option selected disabled>Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="incomplete">Incomplete</option>
                                    <option value="missing">Missing</option>
                                </select>
                                <select class="form-select filter-task" aria-label="Filter task" style="width: 13%;">
                                    <option selected disabled>Task Type</option>
                                    <option value="activity">Activity</option>
                                    <option value="quiz">Quiz</option>
                                </select>
                            </div>
                            <table class="table table-bordered table-sm border-dark align-middle" id="progressTable">
                                <thead>
                                    <th class="fs-4">Tasks</th>
                                    <th width="20%" class="text-center fs-4">Task Progress</th>
                                    <th width="25%" class="text-center fs-4">Performance Status</th>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-4 animation-right">
                        <div class="graph-container"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <?php include("../includes/components/modal.php"); ?>
    <?php include("../includes/scripts.php"); ?>
    <!-- Apexcharts -->
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script src="../assets/js/components/sidebar.js"></script>
    <script src="../assets/js/std/displayGrades.js"></script>
</body>

</html>