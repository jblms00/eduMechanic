const toastMessage = $("#liveToast .toast-body p");
const tableBody = $("#studentsTable tbody");
const noDataMessage = $(
	"<tr><td colspan='6' class='text-center text-danger'>No data found</td></tr>"
);

$(document).ready(function () {
	displayStudentsOnTable();
	deleteStudentOnModal();
	displayScores();
	addStudents();

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

function displayStudentsOnTable() {
	$.ajax({
		url: "../phpscripts/usr/get-students.php",
		type: "GET",
		dataType: "json",
		success: function (response) {
			tableBody.empty();

			if (response.status === "success") {
				if (response.students.length === 0) {
					tableBody.append(noDataMessage);
				} else {
					response.students.forEach((student) => {
						var row = `
                            <tr>
								<td class="text-center">
                                    <img class="object-fit-cover rounded-circle"
                                    src="../assets/images/userProfileImgs/${
													student.user_photo
												}" 
                                    alt="img" width="80" height="80">
                                </td>
                                <td class="text-center">
                                    ${student.user_id}
                                </td>
                                <td class="text-center">
                                    ${student.user_email}
                                </td>
                                <td class="text-center">
                                    ${student.user_first_name} 
                                    ${student.user_last_name}
                                </td>
                                <td class="text-center">
                                    ${formatDateOnly(student.datetime_created)}
                                </td>
                                <td class="text-center">
                                    <div class="dropdown">
                                        <button class="btn-option" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="dropdown-item view" href="#">
                                                    <i class="fa-solid fa-clipboard-list me-2"></i>View Scores
                                                </a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item delete" href="#">
                                                    <i class="fa-solid fa-trash-can me-2"></i>Delete
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

function deleteStudentOnModal() {
	$(document).on("click", ".delete", function (event) {
		event.preventDefault();

		var row = $(this).closest("tr");
		var studentId = row.find("td").eq(1).text();

		$(".modal-title").text("Delete student");
		$("#reusableModal .modal-body").html(`
            <p class="mb-0 text-center">Are you sure you want to remove this student?</p>
            <input type="hidden" id="studentId" value="${studentId}">
            <div class="text-center mt-4">
                <button type="button" class="btn btn-danger btn-sm w-50 confirm-delete">Confirm</button>
            </div>
        `);

		$("#reusableModal").modal("show");
	});

	$(document).on("click", ".confirm-delete", function () {
		var studentId = $("#studentId").val();
		if (studentId) {
			$.ajax({
				type: "POST",
				url: "../phpscripts/usr/delete-student.php",
				data: { student_id: studentId },
				dataType: "json",
				success: function (response) {
					if (response.status === "success") {
						toastMessage
							.text(response.message)
							.addClass("text-success")
							.removeClass("text-danger");
						$("#liveToast").toast("show");
						displayStudentsOnTable();
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

function displayScores() {
	$(document).on("click", ".view", function () {
		var row = $(this).closest("tr");
		var studentId = row.find("td").eq(1).text();
		var studentName = row.find("td").eq(3).text();

		$.ajax({
			url: "../phpscripts/std/get-progress.php",
			data: { user_id: studentId },
			type: "GET",
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					$(".modal-title").text(studentName + "Grades");

					let tableHtml = "";

					if (response.activities && response.activities.length > 0) {
						response.activities.forEach(function (activity) {
							let status =
								activity.status === "Completed"
									? "Completed"
									: "Incomplete";
							let badgeClass =
								activity.status === "Completed"
									? "badge bg-complete"
									: "badge bg-incomplete";
							let dateType =
								activity.status === "Completed"
									? "Completed on " + activity.datetime_attempted
									: "Due at " + activity.due_date;
							let pointsType =
								activity.status === "Completed"
									? activity.score + "/" + activity.total_points
									: activity.total_points + " points";

							let passingStatus =
								{
									Passed: `<i class="fa-solid fa-circle-check text-success fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Passed"></i>`,
									Failed: `<i class="fa-solid fa-circle-xmark text-danger fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Failed"></i>`,
									Incomplete: `<i class="fa-solid fa-circle-exclamation text-dark fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Incomplete"></i>`,
								}[activity.passing_status] ||
								`<i class="fa-solid fa-circle-question text-warning fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Pending"></i>`;

							tableHtml += `
                                <tr data-task-type="activity"
									data-status="${status.toLocaleLowerCase()}">
                                    <td>
                                        <h5>
											Activity ${activity.activity_number}
										</h5>
                                        <div class="d-flex align-items-center gap-3">
                                            <p class="mb-0">
												${activity.activity_title}
											</p>
                                            <p class="mb-0">${dateType}</p>
                                            <span class="${badgeClass}" style="font-size: 11px;">${pointsType}</span>
                                        </div>
                                    </td>
                                    <td class="text-center"><span class="${badgeClass}">${status}</span></td>
                                    <td class="text-center">${passingStatus}</td>
                                </tr>
                            `;
						});
					}

					if (response.quizzes && response.quizzes.length > 0) {
						response.quizzes.forEach(function (quiz) {
							let status =
								quiz.status === "Completed"
									? "Completed"
									: "Incomplete";
							let badgeClass =
								quiz.status === "Completed"
									? "badge bg-complete"
									: "badge bg-incomplete";
							let dateType =
								quiz.status === "Completed"
									? quiz.datetime_attempted
									: quiz.due_date;
							let pointsType =
								quiz.status === "Completed"
									? quiz.score + "/" + quiz.total_points
									: quiz.total_points + " points";

							let passingStatus =
								{
									Passed: `<i class="fa-solid fa-circle-check text-success fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Passed"></i>`,
									Failed: `<i class="fa-solid fa-circle-xmark text-danger fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Failed"></i>`,
									Incomplete: `<i class="fa-solid fa-circle-exclamation text-dark fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Incomplete"></i>`,
								}[quiz.passing_status] ||
								`<i class="fa-solid fa-circle-question text-warning fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Pending"></i>`;

							tableHtml += `
                                <tr data-task-type="quiz" data-status="${status.toLocaleLowerCase()}">
                                    <td>
                                        <h5>Quiz ${quiz.quiz_number}</h5>
                                        <div class="d-flex align-items-center gap-3">
                                            <p class="mb-0">
												${quiz.quiz_title}
											</p>
                                            <p class="mb-0">${dateType}</p>
                                            <span class="${badgeClass}" style="font-size: 11px;">${pointsType}</span>
                                        </div>
                                    </td>
                                    <td class="text-center"><span class="${badgeClass}">${status}</span></td>
                                    <td class="text-center">${passingStatus}</td>
                                </tr>
                            `;
						});
					}

					// Build modal HTML with table
					let modalContentHtml = `
						<div class="d-flex gap-3 justify-content-between align-items-center mb-3">
							<input type="text" class="form-control w-50 search-bar" placeholder="Search here..">
							<select class="form-select filter-status ms-auto" aria-label="Filter status"
								style="width: 18%;">
								<option selected disabled>Status</option>
								<option value="completed">Completed</option>
								<option value="incomplete">Incomplete</option>
								<option value="missing">Missing</option>
							</select>
							<select class="form-select filter-task" aria-label="Filter task" style="width: 18%;">
								<option selected disabled>Task Type</option>
								<option value="activity">Activity</option>
								<option value="quiz">Quiz</option>
							</select>
						</div>
                        <table class="table table-bordered table-sm border-dark align-middle" id="progressTable">
                            <thead>
                                <tr>
                                    <th>Tasks</th>
                                    <th width="20%" class="text-center">Task Progress</th>
                                    <th width="25%" class="text-center">Performance Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableHtml}
                            </tbody>
                        </table>
                    `;

					// Inject into modal and display it
					$("#reusableModal .modal-dialog").addClass("modal-lg");
					$("#reusableModal .modal-body").html(modalContentHtml);
					$("#reusableModal").modal("show");

					$(".search-bar").on("keyup", function () {
						$(".filter-task").val("Task Type");
						$(".filter-status").val("Status");
						searchTableOnModal();
					});

					$(".filter-task").on("change", function () {
						$(".filter-status").val("Status");
						$(".search-bar").val("");
						filterByTaskType();
					});

					$(".filter-status").on("change", function () {
						$(".filter-task").val("Task Type");
						$(".search-bar").val("");
						filterByStatus();
					});

					$('[data-bs-toggle="tooltip"]').tooltip();
				} else {
					toastMessage
						.text(response.message)
						.addClass("text-danger")
						.removeClass("text-success");
					$("#liveToast").toast("show");
				}
			},
			error: function (xhr, status, error) {
				console.error(error);
			},
		});
	});
	0;
}

function searchTableOnModal() {
	let searchText = $(".search-bar").val().toLowerCase();
	let hasResults = false;

	$("#progressTable tbody tr").each(function () {
		let rowText = $(this).text().toLowerCase();
		$(this).toggle(rowText.includes(searchText));
		hasResults ||= rowText.includes(searchText);
	});

	checkIfNoTasks(hasResults);
}

function filterByTaskType() {
	let taskTypeFilter = $(".filter-task").val();
	let hasResults = false;

	$("#progressTable tbody tr").each(function () {
		let taskType = $(this).data("task-type");
		let matchesTask =
			taskTypeFilter === "Filter" || taskType === taskTypeFilter;

		$(this).toggle(matchesTask);
		hasResults ||= matchesTask;
	});

	checkIfNoTasks(hasResults);
}

function filterByStatus() {
	let statusFilter = $(".filter-status").val();
	let hasResults = false;

	$("#progressTable tbody tr").each(function () {
		let status = $(this).data("status");
		let matchesStatus = statusFilter === "Filter" || status === statusFilter;

		$(this).toggle(matchesStatus);
		hasResults ||= matchesStatus;
	});

	checkIfNoTasks(hasResults);
}

function checkIfNoTasks(hasResults) {
	$("#progressTable tbody .no-task-row").remove();
	if (!hasResults) {
		$("#progressTable tbody").append(`
            <tr class="no-task-row">
                <td colspan="3" class="text-center text-danger">No task found</td>
            </tr>
        `);
	}
}

function addStudents() {
	$(document).on("click", "#addStudents", function (event) {
		event.preventDefault();

		$(".modal-title").text("Upload Student/s");
		var modalContentHtml = `
			<form id="uploadRecordForm" enctype="multipart/form-data" novalidate>
				<div class="drag-file">
					<div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
					<h6>Drag & Upload Student Record Here</h6>
					<span>OR</span>
					<button type="button" class="browse-btn">Browse File</button>
					<input type="file" id="fileUpload" hidden required>
					<div class="invalid-feedback text-center my-3">Please upload a file.</div>
					<div class="text-center" id="filePreview" style="display: none;">
						<i class="fa-solid fa-file-csv fs-1 text-success"></i>
						<p class="text-muted" id="fileName"></p>
						<button type="button" id="removeFileBtn">Remove File</button>
					</div>
				</div>
				<div class="btn-container">
					<button type="submit" class="btn btn-primary btn-sm">Submit</button>
				</div>
			</form>
		`;
		$("#reusableModal .modal-body").html(modalContentHtml);
		$("#reusableModal").modal("show");

		$("#fileUpload").on("change", handleFileSelect);
		$(".drag-file").on("dragover", handleDragOver);
		$(".drag-file").on("dragleave", handleDragLeave);
		$(".drag-file").on("drop", handleFileDrop);

		$(".browse-btn").on("click", function () {
			$(".drag-file input[type='file']").click();
		});

		$("#removeFileBtn").on("click", function () {
			$("#fileUpload").val("");
			$("#filePreview").hide();

			$(
				".drag-file .icon, .drag-file h6, .drag-file span, .browse-btn"
			).show();
		});
	});

	$(document).on("submit", "#uploadRecordForm", function (event) {
		event.preventDefault();

		var fileUpload = $("#fileUpload")[0].files[0];
		var form = $(this);
		var modalBody = $(".modal-body");

		if (!fileUpload) {
			$("#fileUpload").siblings(".invalid-feedback").show();
			$(".admin-side .drag-file").css({
				border: "1px dashed #dc3545",
				height: "220px",
			});

			$(
				".fa-cloud-upload-alt, .drag-file h6, .drag-file span, .browse-btn"
			).css("color", " #dc3545");

			$(".browse-btn").css("border-color", "#dc3545");

			toastMessage
				.text("Please upload a file.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			return;
		}

		var formData = new FormData();
		formData.append("file", fileUpload);

		form.hide();
		modalBody.append(`
			<div id="loadingMessage" class="text-center mt-3">
				<div class="spinner-border text-warning" role="status"></div>
				<p class="fw-bold mt-2">Please wait for a moment...</p>
			</div>
		`);
		$(".modal-header").addClass("d-none");

		$.ajax({
			method: "POST",
			url: "../phpscripts/usr/upload-students.php",
			data: formData,
			dataType: "json",
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.status === "success") {
					$("#loadingMessage p")
						.text(response.message)
						.addClass("text-success");
					$(".modal-header").removeClass("d-none");

					setTimeout(function () {
						$("#reusableModal").modal("hide");
						displayStudentsOnTable();
					}, 2000);
				} else {
					toastMessage
						.text(response.message)
						.addClass("text-danger")
						.removeClass("text-success");
					$("#liveToast").toast("show");

					$("#loadingMessage").remove();
					$(".modal-header").removeClass("d-none");
					form.show();
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

	// Ensure exactly 1 file is selected
	if (files.length !== 1) {
		toastMessage
			.text("Please select exactly one file.")
			.addClass("text-danger")
			.removeClass("text-success");
		$("#liveToast").toast("show");
		return;
	}

	var file = files[0];

	if (
		file &&
		(file.type ===
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
			file.type === "application/vnd.ms-excel" ||
			file.type === "text/csv")
	) {
		$(".drag-file .icon, .drag-file h6, .drag-file span, .browse-btn").hide();
		$("#filePreview").show();
		$("#fileName").text(file.name);
	} else {
		toastMessage
			.text("Please upload an Excel or CSV file.")
			.addClass("text-danger")
			.removeClass("text-success");
		$("#liveToast").toast("show");
	}
}

// Handle drag over event
function handleDragOver(event) {
	event.preventDefault();
	$(this).addClass("active");
	$("h6", this).text("Release to Upload Excel or CSV File");
}

// Handle drag leave event
function handleDragLeave() {
	$(this).removeClass("active");
	$("h6", this).text("Drag & Drop New Spreadsheet Here");
}

// Handle file drop event
function handleFileDrop(event) {
	event.preventDefault();
	var files = event.originalEvent.dataTransfer.files;

	// Ensure exactly 1 file is dropped
	if (files.length !== 1) {
		toastMessage
			.text("Please drop exactly one file.")
			.addClass("text-danger")
			.removeClass("text-success");
		$("#liveToast").toast("show");
		return;
	}

	var file = files[0];

	if (
		file &&
		(file.type ===
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
			file.type === "application/vnd.ms-excel" ||
			file.type === "text/csv")
	) {
		$(".drag-file .icon, .drag-file h6, .drag-file span, .browse-btn").hide();
		$("#filePreview").show();
		$("#fileName").text(file.name);
	} else {
		toastMessage
			.text("Please drop an Excel or CSV file.")
			.addClass("text-danger")
			.removeClass("text-success");
		$("#liveToast").toast("show");
	}
}
