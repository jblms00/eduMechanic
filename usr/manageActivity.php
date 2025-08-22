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
    <style>
        input::-webkit-inner-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        /* Remove number input spinner in Firefox */
        input[type="number"] {
            -moz-appearance: textfield;
        }
    </style>
</head>

<body class="admin-side" style="background-color: #000034;">
    <?php include("../includes/components/sidebar.php"); ?>
    <div class="home-section">
        <section style="padding: 3rem;">
            <div class="page-title">
                <h1 class="mb-0 fw-bold animation-left">Manage Activity</h1>
            </div>
            <div class="container table-container animation-left">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <button type="button" class="btn btn-primary btn-sm animation-right" id="addActivity">
                        Add New Activity
                    </button>
                    <input type="text" id="searchBar" class="form-control" placeholder="Search activities..."
                        style="width: 30%;" />
                </div>
                <table class="table table-bordered table-striped table-light border border-opacity-50"
                    id="activityTable">
                    <thead>
                        <tr>
                            <th class="text-center">#</th>
                            <th>Title</th>
                            <th class="text-center">Passing Percentage</th>
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
    <div class="modal fade" id="deleteConfirmationModal" data-bs-backdrop="static" data-bs-keyboard="false"
        tabindex="-1" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close close-only-this-modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-4">
                        <p id="deleteMessage" class="mb-0 text-muted"></p>
                    </div>
                    <div class="text-center mt-4">
                        <button type="button" class="btn btn-danger btn-sm w-25 delete-item">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php include("../includes/scripts.php"); ?>
    <script src="../assets/js/components/sidebar.js"></script>
    <script src="../assets/js/components/modal.js"></script>
    <script src="../assets/js/usr/formatDateTime.js"></script>
    <script src="../assets/js/usr/formatDateOnly.js"></script>
    <script src="../assets/js/usr/getPassingStatus.js"></script>
    <script src="../assets/js/usr/manageActivity.js"></script>
</body>

</html>