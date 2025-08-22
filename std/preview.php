<?php
session_start();
include("../phpscripts/database-connection.php");
include("../phpscripts/check-login.php");

$user_data = check_login($con);
$user_profile = $user_data['user_photo'] ?? 'default.jpg';

$modelTitle = "Untitled Model";
$modelId = "No ID provided";
$modalVideo = "No Code provided";

if (!empty($_SERVER['QUERY_STRING'])) {
    parse_str($_SERVER['QUERY_STRING'], $params);

    if (isset($params['id'])) {
        $modelId = intval($params['id']);
    }

    if (isset($params['code'])) {
        $modalVideo = $params['code']; // Keep as string to preserve the full code
    }

    // Extract the model title from the first query parameter
    $queryParts = explode("&", $_SERVER['QUERY_STRING']);
    $modelTitle = urldecode(explode("=", $queryParts[0])[0]); // Get the actual title
}
?>
<!doctype html>
<html lang="en">

<head>
    <?php include("../includes/header.php"); ?>
    <style>
        #simulationPreview {
            width: 100%;
            height: 70vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .model-container {
            opacity: 0;
            transition: opacity 1s ease-in-out;
        }

        .model-container.show {
            opacity: 1;
        }
    </style>
</head>

<body style="background-color: #000034;" data-model-id="<?php echo $modelId; ?>"
    data-video-code="<?php echo $modalVideo; ?>">
    <?php include("../includes/components/sidebar.php"); ?>
    <div class="home-section">
        <section style="background-color: #5E3217;">
            <div class="text-end p-4">
                <a href="profile" class="user-profile animation-right">
                    <img src="../assets/images/userProfileImgs/<?php echo htmlspecialchars($user_profile, ENT_QUOTES, 'UTF-8'); ?>"
                        class="bg-light" alt="profile photo">
                </a>
            </div>
            <div class="text-center">
                <h1 class="fw-bold text-light animation-left"><?php echo $modelTitle; ?></h1>
            </div>
            <div class="container-fluid position-relative" id="simulationPreview" style="padding: 2rem;">
                <div id="loader"
                    class="position-absolute top-50 start-50 translate-middle text-center animation-fade-in">
                    <div class="d-flex align-items-center gap-2 rounded rounded-4 p-3"
                        style="background: rgba(0, 0, 0, 0.7);">
                        <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;"></div>
                        <h5 class="mb-0 fw-bold text-light">Please wait a moment</h5>
                    </div>
                </div>
            </div>
            <div class="container-fluid" id="buttonContainer"></div>
        </section>
    </div>
    <?php include("../includes/components/modal.php"); ?>
    <?php include("../includes/scripts.php"); ?>
    <script src="../assets/js/components/sidebar.js"></script>
    <script src="../assets/js/components/modal.js"></script>
    <script async src="https://unpkg.com/es-module-shims@1.6.3/dist/es-module-shims.js"></script>
    <script type="importmap">
    {
        "imports": {
        "three": "https://unpkg.com/three@v0.163.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@v0.163.0/examples/jsm/"
        }
    }
    </script>
    <script type="module" src="../assets/js/std/previewSimulation.js"></script>
</body>

</html>