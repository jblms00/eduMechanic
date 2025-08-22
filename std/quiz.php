<?php session_start();
include("../phpscripts/database-connection.php");
include("../phpscripts/check-login.php");
$user_data = check_login($con);
$quizId = isset($_GET['qz']) ? htmlspecialchars($_GET['qz']) : '';
$quizTitle = isset($_GET['tle']) ? htmlspecialchars($_GET['tle']) : '';

$getPassingPercentageQuery = "SELECT passing_percentage FROM quiz WHERE quiz_id = '$quizId'";
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

<body class="quiz-page" data-user-id="<?php echo $user_data['user_id']; ?>"
    data-passing-percentage="<?php echo $passingPercentage; ?>">
    <section style="padding: 3rem; height: 100vh; display: flex; flex-direction: column; justify-content: center;">
        <div class="page-title d-flex align-items-center justify-content-between">
            <h1 class="mb-0 fw-bold quiz-number animation-left"></h1>
            <div class="user-answers animation-downwards"></div>
        </div>
        <div class="p-4">
            <div class="container-fluid container-quiz animation-fade-in">
                <div class="d-flex align-items-center justify-content-between mb-4">
                    <div class="question-number">Question 1 out of 10</div>
                    <div class="timer-container">
                        <i class="fa-solid fa-stopwatch me-1"></i>
                        <span class="timer">2:00</span>
                    </div>
                </div>
                <div class="question"></div>
                <div class="choices"></div>
            </div>
            <div class="btn-next-container d-flex align-content-center justify-content-between gap-2">
                <a href="#" class="btn btn-danger rounded-pill animation-left go-back">
                    Exit Quiz
                </a>
                <button type="button" class="btn btn-primary rounded-pill ms-auto previous-question animation-right">
                    Previous Question
                </button>
                <button type="button" class="btn btn-primary rounded-pill next-question animation-right">
                    Next Question
                </button>
            </div>
        </div>
    </section>
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
    <script src="../assets/js/components/modal.js"></script>
    <script src="../assets/js/std/quiz.js"></script>
</body>

</html>