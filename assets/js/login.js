const toastMessage = $("#liveToast .toast-body p");

$(document).ready(function () {
	userLogin();
	handle2FA();
});

function userLogin() {
	$(document).on("submit", "#loginForm", function (event) {
		event.preventDefault();
		var form = $(this);
		var userEmail = form.find("#loginEmail").val();
		var userPassword = form.find("#loginPassword").val();
		var userType = form.find("#loginUserType").val();
		var loginContainer = $(".login-container");
		var logo = loginContainer.find("img");
		var formContent = loginContainer.find("form");

		if (!form[0].checkValidity()) {
			form.addClass("was-validated");
			return;
		}

		if (!userType) {
			form.find("#loginUserType").addClass("is-invalid");
			return;
		} else {
			form.find("#loginUserType").removeClass("is-invalid");
		}

		formContent.hide();
		loginContainer.append(`
			<div id="loadingMessage" class="text-center mt-3">
				<div class="spinner-border text-warning" role="status"></div>
				<p class="fw-bold mt-2">Please wait for a moment...</p>
			</div>
		`);

		$.ajax({
			method: "POST",
			url: "phpscripts/login.php",
			data: {
				userEmail: userEmail,
				userPassword: userPassword,
				userType: userType,
			},
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					$("button, input, select").prop("disabled", true);
					$("a")
						.addClass("disabled")
						.on("click", function (e) {
							e.preventDefault();
						});

					toastMessage
						.text(response.message)
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");

					setTimeout(function () {
						if (userType === "user") {
							window.location.href = "std/homepage";
						} else if (userType === "admin") {
							window.location.href = "usr/dashboard";
						}
					}, 3000);
				} else if (response.status === "2fa_required") {
					$("#loadingMessage").remove();

					$(".homepage .container").html(get2FAForm());
					$("#verifyingUserId").val(response.userId);
					$("#verifyingUserType").val(response.userType);
				} else {
					toastMessage
						.text(response.message)
						.addClass("text-danger")
						.removeClass("text-success");
					$("#liveToast").toast("show");

					$("#loadingMessage").remove();
					formContent.show();
				}
			},
			error: function (xhr, status, error) {
				console.log(error);
			},
		});
	});
}

function get2FAForm() {
	return `
        <div class="box-container p-3" style="width: 35%;">
			<div class="text-center">
				<img src="assets/images/EduMechanic_Logo-.webp" width="200" height="200" alt="logo">
			</div>
            <form id="2faForm" class="needs-validation text-center" novalidate>
                <h2 class="text-uppercase fw-bold">Enter 2FA Code</h2>
                <div class="mb-3">
                    <input type="hidden" id="verifyingUserId" class="form-control">
                    <input type="hidden" id="verifyingUserType" class="form-control">
                    <input type="text" id="2faCode" class="form-control" placeholder="Enter your 2FA code" required>
                    <div class="invalid-feedback fw-semibold text-start">Please enter the 2FA code sent to you.</div>
                </div>
                <div class="row mb-4">
                    <div class="col text-center">
                        <button type="submit" class="btn btn-warning text-light fw-bold w-50">Verify</button>
                    </div>
                </div>
            </form>
        </div>
    `;
}

function handle2FA() {
	$(document).on("submit", "#2faForm", function (event) {
		event.preventDefault();
		var form = $(this);
		var code = form.find("#2faCode").val();
		var verifyingUserId = form.find("#verifyingUserId").val();
		var verifyingUserType = form.find("#verifyingUserType").val();

		if (!form[0].checkValidity()) {
			form.addClass("was-validated");
			return;
		}

		$.ajax({
			method: "POST",
			url: "phpscripts/verify-2fa.php",
			data: {
				code: code,
				userId: verifyingUserId,
				userType: verifyingUserType,
			},
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					$("button, input, select").prop("disabled", true);
					$("a")
						.addClass("disabled")
						.on("click", function (e) {
							e.preventDefault();
						});

					toastMessage
						.text(response.message)
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");

					setTimeout(function () {
						if (verifyingUserType === "user") {
							window.location.href = "std/homepage";
						} else if (verifyingUserType === "admin") {
							window.location.href = "usr/dashboard";
						}
					}, 3000);
				} else {
					toastMessage
						.text(response.message)
						.addClass("text-danger")
						.removeClass("text-success");
					$("#liveToast").toast("show");
				}
			},
			error: function (xhr, status, error) {
				console.log("AJAX Error:", status, error);
			},
		});
	});
}
