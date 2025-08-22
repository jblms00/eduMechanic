const toastMessage = $("#liveToast .toast-body p");
const tableBody = $("#lessonsTable tbody");
const noDataMessage = $(
	"<tr><td colspan='5' class='text-center text-danger'>No data found</td></tr>"
);
var lessonFiles = [];

$(document).ready(function () {
	displayLessonsOnTable();
	editLessonOnModal();
	saveLessonEdit();
	addNewLesson();
	saveAddedLesson();
	deleteLessonOnModal();

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

	$("#lessonsTable").on(
		"click",
		".dropdown-item[data-lesson-file]",
		function (event) {
			event.preventDefault();
			const lessonFile = $(this).data("lesson-file");

			if (lessonFile) {
				showLessonFileModal(lessonFile);
			} else {
				console.error("Lesson file not found.");
			}
		}
	);
});

function displayLessonsOnTable() {
	$.ajax({
		url: "../phpscripts/usr/get-lessons.php",
		type: "GET",
		dataType: "json",
		success: function (response) {
			tableBody.empty();

			if (response.status === "success") {
				if (response.lessons.length === 0) {
					tableBody.append(noDataMessage);
				} else {
					let counter = 1;

					response.lessons.forEach((lesson) => {
						let badgeClass;
						switch (lesson.lesson_level) {
							case "Beginner":
								badgeClass = "bg-primary";
								break;
							case "Intermediate":
								badgeClass = "bg-info";
								break;
							case "Advanced":
								badgeClass = "bg-warning";
								break;
							default:
								badgeClass = "bg-secondary";
						}

						const row = `
							<tr data-lesson-id="${lesson.reading_id}" 
								data-lesson-learnings="${lesson.lesson_learnings}" 
								data-lesson-media="${lesson.lesson_media}">
								<td class="text-center fw-bold">${counter++}</td>
								<td>${lesson.lesson_title}</td>
								<td class="text-center">
									<span class="badge ${badgeClass}" style="font-size: 12px;">
										${lesson.lesson_level}
									</span>
								</td>
								<td class="text-center">
									${formatDateOnly(lesson.datetime_added)}
								</td>
								<td class="text-center">
									<div class="dropdown">
										<button class="btn-option" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											<i class="fa-solid fa-ellipsis"></i>
										</button>
										<ul class="dropdown-menu">
											<li>
												<a class="dropdown-item" 
												href="manageActivity?lesson=${lesson.lesson_title}&id=${lesson.reading_id}" 
												target="_blank"> <i class="fa-solid fa-layer-group me-2"></i> Manage Activity</a>
											</li>
											<li>
												<a class="dropdown-item" 
												href="manageQuiz?lesson=${lesson.lesson_title}&id=${lesson.reading_id}" 
												target="_blank"> <i class="fa-solid fa-clipboard-list me-2"></i> Manage Quiz</a>
											</li>
											<li><a class="dropdown-item" href="#" 
													data-lesson-file="${lesson.lesson_content || "N/A"}">
													<i class="fa-solid fa-eye me-2"></i> View Lessons
												</a>
											</li>
											<li><a class="dropdown-item edit" href="#"><i class="fa-solid fa-pen-to-square me-2"></i> Edit</a></li>
											<li><a class="dropdown-item delete" href="#"><i class="fa-solid fa-trash-can me-2"></i> Delete</a></li>
										</ul>
									</div>
								</td>
							</tr>
						`;
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

function editLessonOnModal() {
	$(document).on("click", ".edit", function (event) {
		event.preventDefault();

		var row = $(this).closest("tr");
		var lessonId = row.data("lesson-id");
		var lessonTitle = row.find("td").eq(1).text();
		var lessonLevel = row.find("span.badge").text();

		$(".modal-title").text("Edit Lesson");

		var modalContentHtml = `
            <input type="hidden" id="editLessonId" value="${lessonId}">
            <div class="input-group mb-3">
                <span class="input-group-text fw-semibold">Lesson Title</span>
                <input type="text" class="form-control" id="editLessonTitle" value="${lessonTitle}">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text fw-semibold">Lesson Level</span>
                <select class="form-select" id="editLessonLevel" required>
                    <option value="Beginner" 
                        ${lessonLevel === "Beginner" ? "selected" : ""}>Beginner
                    </option>
                    <option value="Intermediate" 
                        ${lessonLevel === "Intermediate" ? "selected" : ""}>
                        Intermediate
                    </option>
                    <option value="Advanced" 
                        ${lessonLevel === "Advanced" ? "selected" : ""}>Advanced
                    </option>
                </select>
            </div>
            <div class="input-group mb-3">
                <input type="file" class="form-control" id="uploadNewFileBanner" accept=".jpg, .jpeg">
                <label class="input-group-text fw-semibold" for="uploadNewFileBanner">Upload Banner</label>
            </div>
            <div class="drag-file">
                <div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
                <h6>Drag & Drop New Lesson File Here</h6>
                <span>OR</span>
                <button type="button" class="browse-btn">Browse File</button>
                <input type="file" id="newLessonFileUpload" hidden>
                <div class="text-center" id="filePreview" style="display: none;">
                    <i class="fa-solid fa-file-pdf fs-1 text-danger"></i>
                    <p class="text-muted" id="fileName"></p>
                    <button type="button" id="removeFileBtn">Remove File</button>
                </div>
            </div>
            <div class="btn-container">
                <button type="button" class="btn btn-primary save-updates">Save changes</button>
            </div>
        `;

		$("#reusableModal .modal-body").html(modalContentHtml);
		$("#reusableModal").modal("show");

		$("#newLessonFileUpload").on("change", handleFileSelect);
		$(".drag-file").on("dragover", handleDragOver);
		$(".drag-file").on("dragleave", handleDragLeave);
		$(".drag-file").on("drop", handleFileDrop);

		$(".browse-btn").on("click", function () {
			$(".drag-file input[type='file']").click();
		});

		$("#removeFileBtn").on("click", function () {
			$("#newLessonFileUpload").val("");
			$("#filePreview").hide();

			$(
				".drag-file .icon, .drag-file h6, .drag-file span, .browse-btn"
			).show();
		});
	});
}

function saveLessonEdit() {
	$(document).on("click", ".save-updates", function () {
		// Get form data
		var lessonId = $("#editLessonId").val();
		var lessonTitle = $("#editLessonTitle").val();
		var lessonLevel = $("#editLessonLevel").val();
		var lessonFile = $("#newLessonFileUpload")[0].files[0];
		var lessonBanner = $("#uploadNewFileBanner")[0].files[0];

		if (!lessonId || !lessonTitle || !lessonLevel) {
			toastMessage
				.text("All fields are required.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			return;
		}

		var formData = new FormData();
		formData.append("lessonId", lessonId);
		formData.append("lessonTitle", lessonTitle);
		formData.append("lessonLevel", lessonLevel);

		if (lessonFile) {
			formData.append("lessonFile", lessonFile);
		}
		if (lessonBanner) {
			formData.append("lessonBanner", lessonBanner);
		}

		$.ajax({
			method: "POST",
			url: "../phpscripts/usr/update-lesson.php",
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
					displayLessonsOnTable();
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

function showLessonFileModal(lessonFileString) {
	var modal = $("#reusableModal");
	var modalBody = modal.find(".modal-body");

	modal.find(".modal-dialog").addClass("modal-xl");

	// Convert the string to an array and remove extra spaces
	var lessonFiles = lessonFileString.split(",").map((file) => file.trim());

	if (lessonFiles.length === 1 && lessonFiles[0] === "N/A") {
		modalBody.html(`
            <div class="d-flex flex-column align-items-center justify-content-center" style="height: 100%;">
                <i class="fa-solid fa-exclamation-circle fa-4x text-danger mb-3"></i>
                <p class="text-muted fw-semibold">No file is available for this lesson.</p>
            </div>
        `);
		modal.find(".modal-dialog").removeClass("modal-xl");
		modal.find(".modal-body").addClass("p-0");
	} else {
		// Generate lesson buttons dynamically (only if there's more than one lesson)
		let lessonButtons =
			lessonFiles.length > 1
				? `<div class="d-flex flex-wrap mb-3">` +
				  lessonFiles
						.map(
							(file, index) =>
								`<button class="btn btn-primary btn-sm m-1 lesson-btn" data-file="${file}">Reading ${
									index + 1
								}</button>`
						)
						.join("") +
				  `</div>`
				: "";

		// Display the first lesson file by default
		modalBody.html(`
            ${lessonButtons}
            <embed id="lessonEmbed" src="${lessonFiles[0]}" type="application/pdf" width="100%" height="600px" class="fade-in">
        `);

		// Event listener for lesson buttons (with animation)
		$(".lesson-btn").on("click", function () {
			var file = $(this).data("file");
			$("#lessonEmbed").fadeOut(200, function () {
				$(this).attr("src", file).fadeIn(200);
			});
		});
	}

	modal.modal("show");
}

function addNewLesson() {
	$(document).on("click", "#addLesson", function (event) {
		event.preventDefault();

		$(".modal-title").text("New Lesson");

		var modalContentHtml = `
			<form id="newLessonForm" enctype="multipart/form-data" novalidate>
				<div class="input-group mb-3">
					<span class="input-group-text fw-semibold">Lesson Title<span class="text-danger">*</span></span>
					<input type="text" class="form-control" id="newLessonTitle" required minlength="3" maxlength="100">
					<div class="invalid-feedback">Please provide a lesson title (3-100 characters).</div>
				</div>
				<div class="input-group mb-3">
					<span class="input-group-text fw-semibold">Lesson Level<span class="text-danger">*</span></span>
					<select class="form-select" id="newLessonLevel" required>
						<option value="">Select Level</option>
						<option value="Beginner">Beginner</option>
						<option value="Intermediate">Intermediate</option>
						<option value="Advanced">Advanced</option>
					</select>
					<div class="invalid-feedback">Please select a lesson level.</div>
				</div>
				<div class="form-floating mb-3">
					<textarea class="form-control" placeholder="Enter lesson learning" id="newLessonLearnings" required minlength="10" style="height: 100px"></textarea>
					<label for="newLessonLearnings">Lesson Learnings</label>
					<p class="text-muted my-1" style="font-size: 12px;">Format: Lesson Learning #1, Lesson Learning #2, etc.</p>
					<div class="invalid-feedback">Please provide lesson learnings (minimum 10 characters).</div>
				</div>
				<div class="input-group mb-3">
					<input type="file" class="form-control" id="uploadNewFileBanner" accept=".jpg, .jpeg" required>
					<label class="input-group-text fw-semibold" for="uploadNewFileBanner">Upload Banner <span class="text-danger">*</span></label>
					<div class="invalid-feedback">Please upload a banner file (JPEG only).</div>
				</div>
				<div class="drag-file">
					<div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
					<h6>Drag & Drop New Lesson Files Here</h6>
					<span>OR</span>
					<button type="button" class="browse-btn">Browse Files</button>
					<input type="file" id="newLessonFileUpload" hidden multiple required>
					<div class="invalid-feedback text-center my-3">Please upload lesson files. You can upload up to 5 PDFs.</div>
					<div id="filePreview" class="text-center d-flex align-items-center justify-content-center gap-3 flex-wrap my-3" style="display: none;"></div>
					<button type="button" id="removeFileBtn" class="btn btn-danger btn-sm" style="display: none;">Remove Files</button>
				</div>
				<div class="btn-container">
					<button type="submit" class="btn btn-primary">Submit</button>
				</div>
			</form>
		`;
		$("#reusableModal .modal-body").html(modalContentHtml);
		$("#reusableModal").modal("show");

		$("#newLessonFileUpload").on("change", handleFileSelect);
		$(".drag-file").on("dragover", handleDragOver);
		$(".drag-file").on("dragleave", handleDragLeave);
		$(".drag-file").on("drop", handleFileDrop);

		$(".browse-btn").on("click", function () {
			$("#newLessonFileUpload").click();
		});

		$("#removeFileBtn").on("click", function () {
			$("#newLessonFileUpload").val("");
			$("#filePreview").html("").hide();
			$("#removeFileBtn").hide();
			$(
				".drag-file .icon, .drag-file h6, .drag-file span, .browse-btn"
			).show();
		});
	});
}

function saveAddedLesson() {
	$(document).on("submit", "#newLessonForm", function (event) {
		event.preventDefault();
		var form = $(this);

		if (!form[0].checkValidity()) {
			form.addClass("was-validated");
			return;
		}

		var lessonFile = $("#newLessonFileUpload")[0].files[0];
		var lessonBanner = $("#uploadNewFileBanner")[0].files[0];

		if (!lessonFile || !lessonBanner) {
			if (!lessonFile) {
				$("#newLessonFileUpload").siblings(".invalid-feedback").show();
			}
			if (!lessonBanner) {
				$("#uploadNewFileBanner").siblings(".invalid-feedback").show();
			}
			form.addClass("was-validated");
			return;
		}

		if (lessonFiles.length > 5) {
			toastMessage
				.text("You can upload a maximum of 5 lesson files.")
				.addClass("text-success")
				.removeClass("text-danger");
			$("#liveToast").toast("show");
			return;
		}

		// Collect form data
		var formData = new FormData();
		formData.append("lessonTitle", $("#newLessonTitle").val());
		formData.append("lessonLevel", $("#newLessonLevel").val());
		formData.append("lessonLearnings", $("#newLessonLearnings").val());

		formData.append("lessonBanner", lessonBanner);

		$.each(lessonFiles, function (index, file) {
			formData.append("lessonFiles[]", file);
		});

		$.ajax({
			method: "POST",
			url: "../phpscripts/usr/add-lesson.php",
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
					displayLessonsOnTable();
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

function handleFileSelect(event) {
	event.preventDefault();
	var files = event.target.files;
	displayFiles(files);
}

function handleDragOver(event) {
	event.preventDefault();
	$(this).addClass("active");
	$("h6", this).text("Release to Upload PDF Files");
}

function handleDragLeave() {
	$(this).removeClass("active");
	$("h6", this).text("Drag & Drop New Lesson Files Here");
}

function handleFileDrop(event) {
	event.preventDefault();
	var files = event.originalEvent.dataTransfer.files;
	displayFiles(files);
}

function displayFiles(files) {
	if (files.length > 5) {
		toastMessage
			.text("You can upload up to 5 PDF files only.")
			.addClass("text-danger")
			.removeClass("text-success");
		$("#liveToast").toast("show");
		return;
	}

	var previewContainer = $("#filePreview");
	previewContainer.html("").show();

	lessonFiles = []; // Reset the lessonFiles array

	$.each(files, function (index, file) {
		if (file.type === "application/pdf") {
			lessonFiles.push(file);
			previewContainer.append(
				`<p class="text-muted"><i class="fa-solid fa-file-pdf text-danger"></i> ${file.name}</p>`
			);
		}
	});

	if (lessonFiles.length > 0) {
		$("#removeFileBtn").show();
		$(".drag-file .icon, .drag-file h6, .drag-file span, .browse-btn").hide();
	} else {
		toastMessage
			.text("Only PDF files are allowed.")
			.addClass("text-danger")
			.removeClass("text-success");
		$("#liveToast").toast("show");
	}
}

function deleteLessonOnModal() {
	$(document).on("click", ".delete", function (event) {
		event.preventDefault();

		var row = $(this).closest("tr");
		var lessonId = row.data("lesson-id");

		$(".modal-title").text("Delete Lesson");
		$("#reusableModal .modal-body").html(`
            <p class="mb-0 text-center">Are you sure you want to delete this lesson?</p>
            <input type="hidden" id="deleteLessonId" value="${lessonId}">
            <div class="text-center mt-4">
                <button type="button" class="btn btn-danger btn-sm w-50 confirm-delete">Confirm</button>
            </div>
        `);

		$("#reusableModal").modal("show");
	});

	$(document).on("click", ".confirm-delete", function () {
		var lessonIdToDelete = $("#deleteLessonId").val();
		if (lessonIdToDelete) {
			$.ajax({
				type: "POST",
				url: "../phpscripts/usr/delete-lesson.php",
				data: { lesson_id: lessonIdToDelete },
				dataType: "json",
				success: function (response) {
					if (response.status === "success") {
						toastMessage
							.text(response.message)
							.addClass("text-success")
							.removeClass("text-danger");
						$("#liveToast").toast("show");
						displayLessonsOnTable();
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
