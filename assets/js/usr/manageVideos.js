const toastMessage = $("#liveToast .toast-body p");
const tableBody = $("#videosTable tbody");
const noDataMessage = $(
	"<tr><td colspan='5' class='text-center text-danger'>No data found</td></tr>"
);

$(document).ready(function () {
	displayVideosOnTable();
	editVideoOnModal();
	saveVideoEdit();
	deleteVideoOnModal();
	addNewVideo();

	$("#searchBar").on("input", function () {
		var searchText = $(this).val().toLowerCase();
		var found = false;

		tableBody.find("tr:contains('No data found')").remove();

		tableBody.find("tr").each(function () {
			var rowText = $(this).text().toLowerCase();
			if (rowText.includes(searchText)) {
				$(this).show();
				found = true;
			} else {
				$(this).hide();
			}
		});

		if (found == false) {
			tableBody.append(noDataMessage);
		}
	});
});

function displayVideosOnTable() {
	$.ajax({
		url: "../phpscripts/std/fetch-videos.php",
		type: "GET",
		dataType: "json",
		success: function (response) {
			tableBody.empty();

			if (response.status === "success") {
				if (response.videos.length === 0) {
					tableBody.append(noDataMessage);
				} else {
					let counter = 1;

					response.videos.forEach((video) => {
						var row = `
                            <tr data-video-id="${video.video_id}"
                                data-video-img="${video.video_img}"
                                data-video-url="${video.video_url}">
                                <td class="text-center fw-bold">${counter++}</td>
                                <td class="text-center">
                                    <img class="img-fluid object-fit-contain"
                                    src="../assets/images/${video.video_img}" 
                                    alt="img" style="height: 100px;">
                                </td>
                                <td>${video.video_title}</td>
                                <td class="text-center">
                                    ${formatDateOnly(video.datetime_added)}
                                </td>
                                <td class="text-center">
                                    <div class="dropdown">
                                        <button class="btn-option" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="dropdown-item edit" href="#">
                                                    <i class="fa-solid fa-pen-to-square me-2"></i> Edit
                                                </a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item delete" href="#">
                                                    <i class="fa-solid fa-trash-can me-2"></i> Delete
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>`;
						tableBody.append(row);
					});
				}
			} else {
				console.error(response.message);
			}
		},
		error: function (xhr, status, error) {
			console.error(error);
		},
	});
}

function editVideoOnModal() {
	$(document).on("click", ".edit", function (event) {
		event.preventDefault();

		var row = $(this).closest("tr");
		var videoId = row.data("video-id");
		var videoImg = row.data("video-img");
		var videoUrl = row.data("video-url");
		var videoTitle = row.find("td").eq(2).text();
		$(".modal-title").text("Edit Video");

		var modalContentHtml = `
            <input type="hidden" id="videoId" value="${videoId}">
            <div class="mb-4 text-center">
                <img class="img-fluid object-fit-contain" id="previewImage" style="height: 200px;"
                    src="../assets/images/${videoImg}" alt="img">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text fw-semibold">Video Title</span>
                <input type="text" class="form-control" id="videoTitle" value="${videoTitle}">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text fw-semibold">Video Url</span>
                <input type="text" class="form-control" id="videoUrl" value="${videoUrl}">
            </div>
            <div class="input-group mb-3">
                <input type="file" class="form-control" id="uploadNewFileBanner" accept=".jpg, .jpeg">
                <label class="input-group-text fw-semibold" for="uploadNewFileBanner">Upload Banner</label>
            </div>
            <div class="btn-container">
                <button type="button" class="btn btn-primary save-updates">Save changes</button>
            </div>
        `;

		$("#reusableModal .modal-body").html(modalContentHtml);
		$("#reusableModal").modal("show");

		$("#uploadNewFileBanner").on("change", function () {
			var file = this.files[0];
			if (file) {
				var reader = new FileReader();
				reader.onload = function (e) {
					$("#previewImage").attr("src", e.target.result);
				};
				reader.readAsDataURL(file);
			}
		});
	});
}

function saveVideoEdit() {
	$(document).on("click", ".save-updates", function () {
		var videoId = $("#videoId").val();
		var videoTitle = $("#videoTitle").val();
		var videoUrl = $("#videoUrl").val();
		var videoBanner = $("#uploadNewFileBanner")[0].files[0];

		if (!videoId || !videoTitle || !videoUrl) {
			toastMessage
				.text("All fields are required.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			return;
		}

		var formData = new FormData();
		formData.append("videoId", videoId);
		formData.append("videoTitle", videoTitle);
		formData.append("videoUrl", videoUrl);

		if (videoBanner) {
			formData.append("videoBanner", videoBanner);
		}

		$.ajax({
			method: "POST",
			url: "../phpscripts/usr/update-video-demonstration.php",
			data: formData,
			dataType: "json",
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.status === "success") {
					toastMessage
						.text(response.message)
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");
					displayVideosOnTable();
					$("#reusableModal").modal("hide");
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

function deleteVideoOnModal() {
	$(document).on("click", ".delete", function (event) {
		event.preventDefault();

		var row = $(this).closest("tr");
		var videoId = row.data("video-id");

		$(".modal-title").text("Delete Video");
		$("#reusableModal .modal-body").html(`
            <p class="mb-0 text-center">Are you sure you want to delete this video?</p>
            <input type="hidden" id="videoId" value="${videoId}">
            <div class="text-center mt-4">
                <button type="button" class="btn btn-danger btn-sm w-50 confirm-delete">Confirm</button>
            </div>
        `);

		$("#reusableModal").modal("show");
	});

	$(document).on("click", ".confirm-delete", function () {
		var videoId = $("#videoId").val();
		if (videoId) {
			$.ajax({
				type: "POST",
				url: "../phpscripts/usr/delete-video.php",
				data: { video_id: videoId },
				dataType: "json",
				success: function (response) {
					if (response.status === "success") {
						toastMessage
							.text(response.message)
							.addClass("text-success")
							.removeClass("text-danger");
						$("#liveToast").toast("show");
						displayVideosOnTable();
						$("#reusableModal").modal("hide");
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
		}
	});
}

function addNewVideo() {
	$(document).on("click", "#addVideo", function (event) {
		event.preventDefault();

		$(".modal-title").text("New Video");

		var modalContentHtml = `
			<form id="newVideoForm" enctype="multipart/form-data" novalidate>
				<div class="input-group mb-3">
					<span class="input-group-text fw-semibold">Video Title<span class="text-danger">*</span></span>
					<input type="text" class="form-control" id="videoTitle" required minlength="3" maxlength="100">
					<div class="invalid-feedback">Please provide a video title (3-100 characters).</div>
				</div>
				<div class="input-group mb-3">
					<span class="input-group-text fw-semibold">Video Url<span class="text-danger">*</span></span>
					<input type="text" class="form-control" id="videoUrl" required>
					<div class="invalid-feedback">Please provide a youtube video url.</div>
				</div>
				<div class="input-group mb-3">
					<input type="file" class="form-control" id="uploadNewFileBanner" accept=".jpg, .jpeg" required>
					<label class="input-group-text fw-semibold" for="uploadNewFileBanner">Upload Banner <span class="text-danger">*</span></label>
					<div class="invalid-feedback">Please upload a banner file (JPEG only).</div>
				</div>
				<div class="btn-container">
					<button type="submit" class="btn btn-primary">Submit</button>
				</div>
			</form>
		`;
		$("#reusableModal .modal-body").html(modalContentHtml);
		$("#reusableModal").modal("show");
	});

	$(document).on("submit", "#newVideoForm", function (event) {
		event.preventDefault();
		var form = $(this);

		if (!form[0].checkValidity()) {
			form.addClass("was-validated");
			return;
		}

		var videoBanner = $("#uploadNewFileBanner")[0].files[0];

		if (!videoBanner) {
			if (!videoBanner) {
				$("#uploadNewFileBanner").siblings(".invalid-feedback").show();
			}
			form.addClass("was-validated");
			return;
		}

		var formData = new FormData();
		formData.append("videoTitle", $("#videoTitle").val());
		formData.append("videoUrl", $("#videoUrl").val());
		formData.append("videoBanner", videoBanner);

		$.ajax({
			method: "POST",
			url: "../phpscripts/usr/add-video-demonstration.php",
			data: formData,
			dataType: "json",
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.status === "success") {
					toastMessage
						.text(response.message)
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");
					displayVideosOnTable();
					$("#reusableModal").modal("hide");
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
