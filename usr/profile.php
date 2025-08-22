<?php session_start();
include("../phpscripts/database-connection.php");
include("../phpscripts/check-login.php");
$admin_data = check_login($con);
$fullName = $admin_data['admin_name'];
$nameParts = explode(' ', $fullName);

$lastName = array_pop($nameParts);
$firstName = implode(' ', $nameParts);


?>
<!doctype html>
<html lang="en">

<head>
    <?php include("../includes/header.php"); ?>
</head>

<body style="background-color: #000034;" data-admin-id="<?php echo $admin_data['admin_id']; ?>">
    <?php include("../includes/components/sidebar.php"); ?>
    <div class="home-section">
        <section>
            <div class="container-profile">
                <div class="container-photo">
                    <form id="uploadPhoto" enctype="multipart/form-data">
                        <label for="fileToUpload">
                            <div class="profile-pic animation-downwards"
                                style="background-image: url('../assets/images/userProfileImgs/<?php echo $admin_data['admin_photo']; ?>')">
                                <span class="glyphicon glyphicon-camera"></span>
                                <span>Change Image</span>
                            </div>
                        </label>
                        <input type="File" name="fileToUpload" id="fileToUpload">
                        <h5 class="fw-bold mb-0 mt-2 text-muted animation-downwards">
                            <?php echo $admin_data['admin_id']; ?>
                        </h5>
                    </form>
                </div>
                <div class="container container-information">
                    <h3 class="fw-bold animation-left">Personal Information</h3>
                    <div class="row mb-5">
                        <div class="col animation-left">
                            <div class="input-container">
                                <h5>Email</h5>
                                <input type="text" class="form-control"
                                    value="<?php echo $admin_data['admin_email']; ?>" disabled>
                            </div>
                        </div>
                        <div class="col animation-downwards">
                            <div class="input-container">
                                <h5>First Name</h5>
                                <input type="text" class="form-control" value="<?php echo $firstName; ?>" disabled>
                            </div>
                        </div>
                        <div class="col animation-right">
                            <div class="input-container">
                                <h5>Last Name</h5>
                                <input type="text" class="form-control" value="<?php echo $lastName; ?>" disabled>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container container-information" style="margin-top: 65px;">
                    <h3 class="fw-bold animation-left">Password</h3>
                    <form id="userPasswordForm" class="needs-validation" novalidate>
                        <div class="row mb-5">
                            <div class="col animation-left">
                                <div class="input-container">
                                    <h5>Current Password</h5>
                                    <input type="password" name="currentPassword" class="form-control" required>
                                    <div class="invalid-feedback">Please enter your current password.</div>
                                </div>
                            </div>
                            <div class="col animation-upwards">
                                <div class="input-container">
                                    <h5>New Password</h5>
                                    <input type="password" name="newPassword" class="form-control" required>
                                    <div class="invalid-feedback">Please enter a new password.</div>
                                </div>
                            </div>
                            <div class="col animation-right">
                                <div class="input-container">
                                    <h5>Confirm New Password</h5>
                                    <input type="password" name="confirmNewPassword" class="form-control" required>
                                    <div class="invalid-feedback">Please confirm the new password.</div>
                                </div>
                            </div>
                        </div>
                        <div class="row text-center">
                            <div class="col animation-left">
                                <button type="submit" class="btn btn-primary">Change Password</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </div>
    <?php include("../includes/components/toast.php"); ?>
    <?php include("../includes/scripts.php"); ?>
    <script src="../assets/js/components/sidebar.js"></script>
    <script src="../assets/js/usr/updateProfile.js"></script>
</body>

</html>