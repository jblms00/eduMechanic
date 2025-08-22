const toastMessage = $("#liveToast .toast-body p");
const currentUserId = $("body").data("user-id");

$(document).ready(function () {
	updateProfilePhoto();
	updatePassword();
});

function updateProfilePhoto() {
	$(document).on("change", "#fileToUpload", function (event) {
		var formData = new FormData();
		var file = $("#fileToUpload")[0].files[0];
		formData.append("fileToUpload", file);
		formData.append("user_id", currentUserId);

		$.ajax({
			url: "../phpscripts/std/update-profile-photo.php",
			type: "POST",
			data: formData,
			dataType: "json",
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.status === "success") {
					$(".profile-pic").css(
						"background-image",
						"url('../assets/images/userProfileImgs/" +
							response.newFileName +
							"')"
					);

					toastMessage
						.text(response.message)
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");
				} else {
					toastMessage
						.text(response.message)
						.addClass("text-danger")
						.removeClass("text-success");
					$("#liveToast").toast("show");
				}
			},
			error: function (error) {
				console.log(error);
			},
		});
	});
}

function updatePassword() {
	$(document).on("submit", "#userPasswordForm", function (event) {
		event.preventDefault();
		var form = $(this);

		if (!form[0].checkValidity()) {
			form.addClass("was-validated");
			return;
		}

		var currentPassword = $("input[name='currentPassword']").val();
		var newPassword = $("input[name='newPassword']").val();
		var confirmNewPassword = $("input[name='confirmNewPassword']").val();

		if (newPassword !== confirmNewPassword) {
			toastMessage
				.text("New password and confirmation do not match.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			return;
		}

		var formData = {
			user_id: currentUserId,
			current_password: currentPassword,
			new_password: newPassword,
			confirm_new_password: confirmNewPassword,
		};

		$.ajax({
			url: "../phpscripts/std/update-password.php",
			type: "POST",
			data: formData,
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					$("#userPasswordForm input").val("");
					toastMessage
						.text(response.message)
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");
				} else {
					toastMessage
						.text(response.message)
						.addClass("text-danger")
						.removeClass("text-success");
					$("#liveToast").toast("show");
				}
			},
			error: function (error) {
				console.log(error);
			},
		});
	});
}
