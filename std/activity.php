<?php session_start();
include("../phpscripts/database-connection.php");
include("../phpscripts/check-login.php");
$user_data = check_login($con);
$activityId = isset($_GET['act']) ? htmlspecialchars($_GET['act']) : '';

$getPassingPercentageQuery = "SELECT passing_percentage FROM activities WHERE activity_id = '$activityId'";
$getPassingPercentageResult = mysqli_query($con, $getPassingPercentageQuery);

$passingPercentage = "";
if ($getPassingPercentageResult && mysqli_num_rows($getPassingPercentageResult) > 0) {
    $row = mysqli_fetch_assoc($getPassingPercentageResult);
    $passingPercentage = $row['passing_percentage'];
}
?>
<!doctype html>
<html lang="en">

<head>
    <?php include("../includes/header.php"); ?>
</head>

<body class="activity-page" data-user-id="<?php echo $user_data['user_id']; ?>"
    data-passing-percentage="<?php echo $passingPercentage; ?>" style="background-color: #000034;">
    <?php include("../includes/components/sidebar.php"); ?>
    <div class="home-section">
        <section>
            <div class="container-fluid container-activity">
                <div class="text-end mb-3">
                    <i class="fa-solid fa-circle-question fs-2" style="cursor: pointer;" data-bs-toggle="tooltip"
                        data-bs-placement="left" data-bs-title="Drag the items to the correct position."></i>
                </div>
                <div class="container container-dragable">
                    <!-- Display all the items here -->
                </div>
                <div class="container container-dropzone">
                    <!-- This is the dropzone -->
                </div>
            </div>
        </section>
    </div>
    <!-- Score Modal -->
    <div class="modal fade" id="scoreModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="icon-tag"></div>
                    <div class="container container-score"></div>
                </div>
            </div>
        </div>
    </div>
    <?php include("../includes/components/toast.php"); ?>
    <?php include("../includes/components/modal.php"); ?>
    <?php include("../includes/scripts.php"); ?>
    <script src="../assets/js/components/sidebar.js"></script>
    <script src="../assets/js/std/dragDropActivity.js"></script>

</body>

</html>