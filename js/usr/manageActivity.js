const toastMessage = $("#liveToast .toast-body p");
const tableBody = $("#activityTable tbody");
const noDataMessage = $(
	"<tr><td colspan='5' class='text-center text-danger'>No data found</td></tr>"
);
let rowToDelete;

$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	var readingId = urlParams.get("id");

	$('[data-bs-toggle="tooltip"]').tooltip();

	$(document).on("mouseenter", "[data-bs-toggle='tooltip']", function () {
		$(this).tooltip();
	});

	if (readingId) {
		displayactivityOnTable(readingId);
		viewStudentsScore();
		editActivityOnModal();
		saveUpdates();
		uploadNewItemImage();
		addNewItem();
		deleteItem();
		addNewActivity(readingId);
		deleteActivity(readingId);
		saveCode();

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

		$(document).on("click", ".remove-item", function () {
			rowToDelete = $(this).closest("tr");
			var itemId = rowToDelete.data("item-id");

			const itemName = rowToDelete.find("td input").val();
			$("#deleteMessage").attr("data-item-id", itemId);
			$("#deleteMessage").text(
				`Are you sure you want to delete "${itemName}"?`
			);
			$("#deleteConfirmationModal").modal("show");
		});

		$(document).on("click", ".upload-item", function () {
			$(this).siblings(".upload-item-input").trigger("click");

			$('[data-bs-toggle="tooltip"]').tooltip("hide");
			$(this)
				.closest("tr")
				.find('[data-bs-toggle="tooltip"]')
				.tooltip("hide");
		});

		$(document).on("click", "#addRowBtn", function () {
			const newRow = `
				<tr>
					<td class="text-center">
						<input type="text" class="form-control form-control-sm text-center item-name" placeholder="Enter item name">
					</td>
					<td class="text-center">
						<div class="d-flex align-items-center justify-content-center gap-2">
							<input type="text" class="form-control form-control-sm text-center sketchfab-code" placeholder="Enter sketchfab code">
							<button type="button" class="btn btn-success btn-sm rounded-circle save-added">
								<i class="fa-solid fa-check"></i>
							</button>
						</div>
					</td>
					<td class="text-center">
						<input type="file" class="form-control form-control-sm m-auto item-image" style="width: 79%;">
					</td>
					<td class="text-center">
						<div class="d-flex align-items-center justify-content-center gap-2">
							<button type="button" class="btn btn-success btn-sm rounded-circle save-added">
								<i class="fa-solid fa-check"></i>
							</button>
							<button type="button" class="btn btn-danger btn-sm rounded-circle remove-added">
								<i class="fa-solid fa-circle-xmark"></i>
							</button>
						</div>
					</td>
				</tr>
			`;
			$("#itemsTbl tbody").append(newRow);
			$("#emptyMessageRow").remove();
		});

		$(document).on("change", ".item-image", function () {
			const file = this.files[0];
			const td = $(this).closest("td");

			if (file) {
				const reader = new FileReader();
				reader.onload = function (e) {
					const uploadedImage = `<img src="${e.target.result}" class="uploaded-image" alt="Uploaded Image" style="width: 50px; height: 50px; cursor: pointer;">`;

					td.find(".uploaded-image").remove();
					td.append(uploadedImage);
				};
				reader.readAsDataURL(file);
			}

			$(this).addClass("d-none");
		});

		$(document).on("click", ".uploaded-image", function () {
			const td = $(this).closest("td");
			td.find(".item-image").trigger("click");
		});

		$(document).on("click", ".remove-added", function () {
			$(this).closest("tr").remove();

			if ($("#itemsTbl tbody tr").length === 0) {
				var emptyMessageRow = `
					<tr id="emptyMessageRow">
						<td colspan="4" class="text-center text-danger">Currently, no items here.</td>
					</tr>
				`;
				$("#itemsTbl tbody").append(emptyMessageRow);
			} else {
				$("#emptyMessageRow").remove();
			}
		});

		$(document).on("click", ".close-only-this-modal", function () {
			$("#deleteMessage").text("");
			$("#deleteMessage").attr("data-item-id", "");
			$("#deleteConfirmationModal").modal("hide");
		});
	} else {
		console.error("Reading ID is missing in the URL.");
	}
});

function displayactivityOnTable(readingId) {
	$.ajax({
		url: "../phpscripts/usr/get-activity.php",
		data: { readingId },
		type: "GET",
		dataType: "json",
		success: function (response) {
			tableBody.empty();

			if (response.status === "success") {
				if (response.activities.length === 0) {
					tableBody.append(noDataMessage);
				} else {
					let counter = 1;

					response.activities.forEach((activity) => {
						const row = `
                            <tr data-activity-id="${activity.activity_id}"
								data-activity-number="${activity.activity_number}"
								data-activity-due-date="${activity.activity_due_date}">
                                <td class="text-center fw-bold">${counter++}</td>
                                <td>${activity.activity_title}</td>
                                <td class="text-center">
                                    ${activity.passing_percentage}%
                                </td>
                                <td class="text-center">${formatDateOnly(
												activity.activity_due_date
											)}</td>
                                <td class="text-center">
                                    <div class="dropdown">
                                        <button class="btn-option" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </button>
                                        <ul class="dropdown-menu">
											<li>
                                                <a class="dropdown-item view" href="#">
													<i class="fa-solid fa-eye me-2"></i> View Attempts
												</a>
											</li>
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

function viewStudentsScore() {
	$(document).on("click", ".view", function () {
		var row = $(this).closest("tr");
		var activityId = row.data("activity-id");

		$.ajax({
			url: "../phpscripts/usr/get-students-activity-scores.php",
			data: { activityId },
			type: "GET",
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					$(".modal-title").text("Activity Attempts");

					// Create table to display user scores
					var modalContentHtml = `
                        <table class="table table-bordered table-striped table-sm">
                            <thead>
                                <tr>
                                    <th class="text-center" scope="col">#</th>
                                    <th scope="col">Student Name</th>
                                    <th class="text-center" scope="col">Score</th>
                                    <th class="text-center" scope="col">Status</th>
                                    <th style="width: 45%;" scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

					// Loop through the student scores and generate table rows
					response.scores.forEach(function (score, index) {
						var passingStatus = getPassingStatus(
							score.score,
							score.passing_percentage,
							score.total_items
						);

						let badgeClass = "";
						if (passingStatus === "Passed") {
							badgeClass = "bg-success";
						} else if (passingStatus === "Failed") {
							badgeClass = "bg-danger";
						} else if (passingStatus === "Incomplete") {
							badgeClass = "bg-warning";
						} else {
							badgeClass = "bg-secondary";
						}

						modalContentHtml += `
                            <tr>
                                <td class="text-center">${index + 1}</td>
                                <td>
									${score.user_first_name} ${score.user_last_name}
								</td>
                                <td class="text-center">
									${score.score}/${score.total_items * 2}
								</td>
								<td class="text-center">
									<span class="badge ${badgeClass} w-100">${passingStatus}</span>
								</td>
                                <td>${formatDate(score.datetime_attempted)}</td>
                            </tr>
                        `;
					});

					modalContentHtml += `
                            </tbody>
                        </table>
                    `;

					$("#reusableModal .modal-dialog").addClass("modal-lg");
					$("#reusableModal .modal-body").html(modalContentHtml);
					$("#reusableModal").modal("show");
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
}

function editActivityOnModal() {
	$(document).on("click", ".edit", function () {
		var row = $(this).closest("tr");
		var activityId = row.data("activity-id");
		var activityNumber = row.data("activity-number");
		var activityTitle = row.find("td").eq(1).text();
		var passPercentage = row.find("td").eq(2).text().replace("%", "").trim();
		var dueDate = row.data("activity-due-date");

		const passingPercentageOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
			.map((value) => {
				const isSelected =
					passPercentage === value.toString() ? "selected" : "";
				return `<option value="${value}" ${isSelected}>${value}%</option>`;
			})
			.join("");

		$.ajax({
			url: "../phpscripts/usr/get-activity-items.php",
			data: { activityId },
			type: "GET",
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					var modalContentHtml = `
						<input type="hidden" id="editActivityId" value="${activityId}">
						<div class="input-group mb-3">
							<span class="input-group-text fw-semibold">Activity Title<span class="text-danger">*</span></span>
							<input type="text" class="form-control" id="activityTitle" value="${activityTitle}">
						</div>
						<div class="row align-items-center mb-3">
							<div class="col-5">
								<div class="input-group">
									<span class="input-group-text fw-semibold">Activity #<span class="text-danger">*</span></span>
									<input type="number" class="form-control" id="activityNumber" value="${activityNumber}" required>
								</div>
							</div>
							<div class="col">
								<div class="input-group">
									<span class="input-group-text fw-semibold">Due Date<span class="text-danger">*</span></span>
									<input type="date" class="form-control" id="activityDueDate" value="${dueDate}" required>
								</div>
							</div>
						</div>
						<div class="input-group mb-3">
							<select class="form-select" id="activityPassingPercentage">
								<option selected disabled>Select a passing percentage for this activity</option>
								${passingPercentageOptions}
							</select>
						</div>
						<div class="table-container">
							<div class="text-center mb-3">
								<button type="button" class="btn btn-secondary btn-sm w-25 rounded-pill" id="addRowBtn">Add Item</button>
							</div>
							<table class="table table-bordered table-striped table-sm align-middle" id="itemsTbl">
								<thead>
									<tr>
										<th class="text-center" style="width: 15%;">Item Name</th>
										<th class="text-center" style="width: 50%;">Sketchfab Code</th>
										<th class="text-center" style="width: 15%;">Item Image</th>
										<th class="text-center" style="width: 10%;">Options</th>
									</tr>
								</thead>
								<tbody>
									${
										response.items.length === 0
											? `<tr id="emptyMessageRow"><td class="text-center text-danger" colspan="4">Currently, no items here.</td></tr>`
											: ""
									}
								</tbody>
							</table>
						</div>
						<div class="btn-container">
							<button type="button" class="btn btn-primary w-25 update-data">Save changes</button>
						</div>
					`;

					$(".modal-title").text("Edit Activity");
					$("#reusableModal .modal-dialog").addClass("modal-lg");
					$("#reusableModal .modal-body").html(modalContentHtml);
					$("#reusableModal").modal("show");

					if (response.items.length > 0) {
						refreshItemsTable();
					}
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
}

function refreshItemsTable() {
	$.ajax({
		url: "../phpscripts/usr/get-activity-items.php",
		data: { activityId: $("#editActivityId").val() },
		type: "GET",
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				const tableRows = response.items
					.map((item) => {
						return `
                            <tr data-item-id="${item.item_id}">
                                <td>
                                    <input type="text" class="form-control form-control-sm text-center item-name" value="${item.item_name}">
                                </td>
                                <td>
									<div class="d-flex align-items-center justify-content-center gap-2 p-1">
										<input type="text" class="form-control form-control-sm text-center sketchfab-code" value="${item.sketchfab_code}">
										<button type="button" class="btn btn-success btn-sm rounded-circle save-code">
											<i class="fa-solid fa-check"></i>
										</button>
									</div>
                                </td>
                                <td class="text-center">
                                    <img src="../assets/images/drag-and-drop-activities/${item.item_image}" alt="Item Image" style="width: 50px; height: 50px;">
                                </td>
                                <td class="text-center">
                                    <div class="d-flex align-items-center justify-content-center gap-2">
                                        <input type="file" class="upload-item-input" data-item-id="${item.item_id}" style="display: none;">
                                        <button type="button" class="btn btn-primary btn-sm rounded-circle upload-item" data-bs-toggle="tooltip" 
                                            data-bs-placement="left" data-bs-title="Upload New Item">
                                            <i class="fa-solid fa-upload"></i>
                                        </button>
                                        <button type="button" class="btn btn-danger btn-sm rounded-circle remove-item" data-bs-toggle="tooltip" 
                                            data-bs-placement="right" data-bs-title="Remove Item">
                                            <i class="fa-solid fa-circle-xmark"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
					})
					.join("");

				$("#itemsTbl tbody").html(tableRows);
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
}

function uploadNewItemImage() {
	$(document).on("change", ".upload-item-input", function () {
		var itemId = $(this).data("item-id");
		var file = this.files[0];
		var formData = new FormData();
		formData.append("file", file);
		formData.append("itemId", itemId);

		if (file.type !== "image/png") {
			toastMessage
				.text("Please upload a PNG file.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			this.value = "";
			return;
		}

		if (file.size > 2 * 1024 * 1024) {
			toastMessage
				.text("File size exceeds 2MB. Please upload a smaller file.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			this.value = "";
			return;
		}

		$.ajax({
			url: "../phpscripts/usr/upload-item-image.php",
			type: "POST",
			data: formData,
			contentType: false,
			processData: false,
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					$(this)
						.closest("tr")
						.find("td img")
						.attr("src", response.fileDirectory);

					this.value = "";

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
			}.bind(this),
			error: function (xhr, status, error) {
				console.error(error);
			},
		});
	});
}

function saveUpdates() {
	$(document).on("click", ".update-data", function () {
		var activityId = $("#editActivityId").val();
		var activityTitle = $("#activityTitle").val();
		var activityNumber = $("#activityNumber").val();
		var activityDueDate = $("#activityDueDate").val();
		var passingPercentage = $("#activityPassingPercentage").val();

		var updatedItems = [];
		var isValid = true;

		if (activityTitle === "") {
			isValid = false;
			$("#activityTitle").addClass("is-invalid").removeClass("is-valid");
		} else {
			$("#activityTitle").removeClass("is-invalid").addClass("is-valid");
		}

		if (
			activityNumber === "" ||
			isNaN(activityNumber) ||
			activityNumber <= 0
		) {
			isValid = false;
			$("#activityNumber").addClass("is-invalid").removeClass("is-valid");
		} else {
			$("#activityNumber").removeClass("is-invalid").addClass("is-valid");
		}

		if (activityDueDate === "") {
			isValid = false;
			$("#activityDueDate").addClass("is-invalid").removeClass("is-valid");
		} else {
			$("#activityDueDate").removeClass("is-invalid").addClass("is-valid");
		}

		if (!passingPercentage) {
			isValid = false;
			$("#activityPassingPercentage")
				.addClass("is-invalid")
				.removeClass("is-valid");
		} else {
			$("#activityPassingPercentage")
				.removeClass("is-invalid")
				.addClass("is-valid");
		}

		if ($("#itemsTbl tbody tr").length < 5) {
			isValid = false;
			toastMessage
				.text("You must add at least 5 items to update the activity.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			return;
		}

		$("#itemsTbl tbody tr").each(function () {
			var itemId = $(this).data("item-id");
			var itemName = $(this).find(".item-name").val();

			if (itemName === "") {
				isValid = false;
				$(this)
					.find(".item-name")
					.addClass("is-invalid")
					.removeClass("is-valid");
			} else {
				$(this)
					.find(".item-name")
					.removeClass("is-invalid")
					.addClass("is-valid");
			}
			updatedItems.push({ itemId: itemId, itemName: itemName });
		});

		if (!isValid) {
			toastMessage
				.text("All item names are required.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			return;
		}

		var data = {
			activityId: activityId,
			activityTitle: activityTitle,
			activityNumber: activityNumber,
			activityDueDate: activityDueDate,
			passingPercentage: passingPercentage,
			items: updatedItems,
		};

		$.ajax({
			url: "../phpscripts/usr/save-activity-updates.php",
			type: "POST",
			data: data,
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					$("#reusableModal").modal("hide");
					toastMessage
						.text("Activity updated successfully!")
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
			error: function (xhr, status, error) {
				console.error(error);
			},
		});
	});
}

function addNewItem() {
	$(document).on("click", ".save-added", function () {
		const row = $(this).closest("tr");
		const activityId = $("#editActivityId").val();
		const itemName = row.find(".item-name").val();
		const itemImage = row.find(".item-image")[0].files[0];

		if (!itemName) {
			toastMessage
				.text("Please enter an item name.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			return;
		}

		if (!itemImage) {
			toastMessage
				.text("Please upload an image.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			return;
		}

		const fileExtension = itemImage.name.split(".").pop().toLowerCase();
		if (fileExtension !== "png") {
			toastMessage
				.text("Invalid image format. Please upload a png image.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			return;
		}

		// Check the image size (2MB max)
		const imgSize = itemImage.size;
		if (imgSize > 2 * 1024 * 1024) {
			toastMessage
				.text("Image size exceeds 2MB. Please upload a smaller image.")
				.addClass("text-danger")
				.removeClass("text-success");
			$("#liveToast").toast("show");
			return;
		}

		const formData = new FormData();
		formData.append("activity_id", activityId);
		formData.append("item_name", itemName);
		formData.append("item_image", itemImage);

		$.ajax({
			url: "../phpscripts/usr/add-new-item.php",
			method: "POST",
			data: formData,
			contentType: false,
			processData: false,
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					toastMessage
						.text("Activity updated successfully!")
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");

					refreshItemsTable();
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

function deleteItem() {
	$(document).on("click", ".delete-item", function () {
		var itemId = $("#deleteMessage").data("item-id");
		var activityId = $("#editActivityId").val();

		$.ajax({
			url: "../phpscripts/usr/delete-activity-item.php",
			type: "POST",
			data: { itemId, activityId },
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					toastMessage
						.text("Activity updated successfully!")
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");

					if (rowToDelete) {
						rowToDelete.remove();
						rowToDelete = null;
					}

					if ($("#itemsTbl tbody tr").length === 0) {
						var emptyMessageRow = `
							<tr id="emptyMessageRow">
								<td colspan="4" class="text-center text-danger">Currently, no items here.</td>
							</tr>
						`;
						$("#itemsTbl tbody").append(emptyMessageRow);
					} else {
						$("#emptyMessageRow").remove();
					}

					$("#deleteMessage").text("");
					$("#deleteMessage").attr("data-item-id", "");
					$("#deleteConfirmationModal").modal("hide");
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
}

function addNewActivity(readingId) {
	$(document).on("click", "#addActivity", function () {
		var modalContentHtml = `
			<form id="activityForm" class="needs-validation" novalidate>
				<div class="input-group mb-3">
					<span class="input-group-text fw-semibold">Activity Title<span class="text-danger">*</span></span>
					<input type="text" class="form-control" id="activityTitle" required>
					<div class="invalid-feedback">Please enter activity title.</div>
				</div>
				<div class="row align-items-center mb-3">
					<div class="col-5">
						<div class="input-group">
							<span class="input-group-text fw-semibold">Activity #<span class="text-danger">*</span></span>
							<input type="number" class="form-control" id="activityNumber" required>
							<div class="invalid-feedback">Please enter activity number.</div>
						</div>
					</div>
					<div class="col">
						<div class="input-group">
							<span class="input-group-text fw-semibold">Due Date<span class="text-danger">*</span></span>
							<input type="date" class="form-control" id="activityDueDate" required>
							<div class="invalid-feedback">Please select activity due date.</div>
						</div>
					</div>
				</div>
				<div class="input-group mb-3">
					<select class="form-select" id="activityPassingPercentage" required>
						<option value="" selected disabled>Select a passing percentage for this activity</option>
						<option value="10">10%</option>
						<option value="20">20%</option>
						<option value="30">30%</option>
						<option value="40">40%</option>
						<option value="50">50%</option>
						<option value="60">60%</option>
						<option value="70">70%</option>
						<option value="80">80%</option>
						<option value="90">90%</option>
						<option value="100">100%</option>
					</select>
					<div class="invalid-feedback">Please select activity passing percentage.</div>
				</div>
				<div class="btn-container">
					<button type="submit" class="btn btn-primary w-25">Submit</button>
				</div>
			</form>
		`;

		$(".modal-title").text("New Activity");
		$("#reusableModal .modal-dialog").addClass("modal-lg");
		$("#reusableModal .modal-body").html(modalContentHtml);
		$("#reusableModal").modal("show");
	});

	$(document).on("submit", "#activityForm", function (event) {
		event.preventDefault();
		var form = $(this);
		var activityTitle = form.find("#activityTitle").val();
		var activityNumber = form.find("#activityNumber").val();
		var dueDate = form.find("#activityDueDate").val();
		var passingPercentage = form.find("#activityPassingPercentage").val();

		if (!form[0].checkValidity()) {
			form.addClass("was-validated");
			return;
		}

		if (!passingPercentage) {
			form.find("#activityPassingPercentage").addClass("is-invalid");
			form
				.find("#activityPassingPercentage")
				.next(".invalid-feedback")
				.text("Please select activity passing percentage.");
			return;
		} else {
			form.find("#activityPassingPercentage").removeClass("is-invalid");
		}

		$("#reusableModal .modal-dialog")
			.removeClass("modal-md")
			.addClass("modal-lg");

		$.ajax({
			url: "../phpscripts/usr/add-activity.php",
			type: "POST",
			data: {
				readingId: readingId,
				activityTitle: activityTitle,
				activityNumber: activityNumber,
				dueDate: dueDate,
				passingPercentage: passingPercentage,
			},
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					toastMessage
						.text("Activity updated successfully!")
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");

					form.find(".btn-container").remove();
					form
						.find(".btn-container btn-secondary")
						.removeClass("w-25")
						.addClass("w-50");

					form
						.find(".input-group input, .input-group select")
						.prop("disabled", true);

					var tableContent = `
						<input type="hidden" id="editActivityId" value="${response.activity_id}">
						<div class="table-container">
							<div class="text-center mb-3">
								<button type="button" class="btn btn-secondary btn-sm w-25 rounded-pill" id="addRowBtn">Add Item</button>
							</div>
							<table class="table table-bordered table-striped table-sm align-middle" id="itemsTbl">
								<thead>
									<tr>
										<th class="text-center" style="width: 15%;">Item Name</th>
										<th class="text-center" style="width: 50%;">Sketchfab Code</th>
										<th class="text-center" style="width: 15%;">Item Image</th>
										<th class="text-center" style="width: 10%;">Options</th>
									</tr>
								</thead>
								<tbody>
									<tr id="emptyMessageRow">
										<td class="text-center text-danger" colspan="4">Currently, no items here.</td>
									</tr>
								</tbody>
							</table>
						</div>
					`;
					$("#activityForm").append(tableContent);
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
}

function deleteActivity(readingId) {
	$(document).on("click", ".delete", function (event) {
		event.preventDefault();

		var row = $(this).closest("tr");
		var activityId = row.data("activity-id");

		$(".modal-title").text("Delete Activity");
		$("#reusableModal .modal-body").html(`
            <p class="mb-0 text-center">Are you sure you want to delete this activity?</p>
            <input type="hidden" id="deleteActivityId" value="${activityId}">
            <div class="text-center mt-4">
                <button type="button" class="btn btn-danger btn-sm w-50 confirm-delete">Confirm</button>
            </div>
        `);

		$("#reusableModal").modal("show");
	});

	$(document).on("click", ".confirm-delete", function () {
		var activityIdToDelete = $("#deleteActivityId").val();
		if (activityIdToDelete) {
			$.ajax({
				type: "POST",
				url: "../phpscripts/usr/delete-activity.php",
				data: { activity_id: activityIdToDelete },
				dataType: "json",
				success: function (response) {
					if (response.status === "success") {
						toastMessage
							.text(response.message)
							.addClass("text-success")
							.removeClass("text-danger");
						$("#liveToast").toast("show");
						displayactivityOnTable(readingId);
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

function saveCode() {
	$(document).on("click", ".save-code", function () {
		const row = $(this).closest("tr");
		const itemId = row.data("item-id");
		const itemCode = row.find(".sketchfab-code").val();

		console.log(itemId);
		console.log(itemCode);

		$.ajax({
			url: "../phpscripts/usr/update-item-code.php",
			method: "POST",
			data: { itemId: itemId, itemCode: itemCode },
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					toastMessage
						.text("Activity updated successfully!")
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");

					refreshItemsTable();
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
