const toastMessage = $("#liveToast .toast-body p");
const tableBody = $("#modelsTable tbody");
const noDataMessage = $(
	"<tr><td colspan='5' class='text-center text-danger'>No data found</td></tr>"
);

$(document).ready(function () {
	displayModelsOnTable();
	deleteModelOnModal();
	addNewModel();

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

function displayModelsOnTable() {
	$.ajax({
		url: "../phpscripts/std/fetch-simulations.php",
		type: "GET",
		dataType: "json",
		success: function (response) {
			tableBody.empty();

			if (response.status === "success") {
				if (response.simulations.length === 0) {
					tableBody.append(noDataMessage);
				} else {
					let counter = 1;

					response.simulations.forEach((simulation) => {
						var row = `
                            <tr data-simulation-id="${simulation.model_id}">
                                <td class="text-center fw-bold">${counter++}</td>
                                <td class="text-center">
                                    <img class="img-fluid object-fit-contain"
                                    src="../assets/images/${simulation.banner}" 
                                    alt="img" style="height: 100px;">
                                </td>
                                <td>${simulation.title}</td>
                                <td class="text-center">
                                    ${formatDateOnly(
													simulation.datetime_created
												)}
                                </td>
                                <td class="text-center">
                                    <div class="dropdown">
                                        <button class="btn-option" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </button>
                                        <ul class="dropdown-menu">
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

function deleteModelOnModal() {
	$(document).on("click", ".delete", function (event) {
		event.preventDefault();

		var row = $(this).closest("tr");
		var simulationId = row.data("simulation-id");

		$(".modal-title").text("Delete simulation");
		$("#reusableModal .modal-body").html(`
            <p class="mb-0 text-center">Are you sure you want to delete this simulation?</p>
            <input type="hidden" id="simulationId" value="${simulationId}">
            <div class="text-center mt-4">
                <button type="button" class="btn btn-danger btn-sm w-50 confirm-delete">Confirm</button>
            </div>
        `);

		$("#reusableModal").modal("show");
	});

	$(document).on("click", ".confirm-delete", function () {
		var simulationId = $("#simulationId").val();
		if (simulationId) {
			$.ajax({
				type: "POST",
				url: "../phpscripts/usr/delete-simulation.php",
				data: { simulation_id: simulationId },
				dataType: "json",
				success: function (response) {
					if (response.status === "success") {
						toastMessage
							.text(response.message)
							.addClass("text-success")
							.removeClass("text-danger");
						$("#liveToast").toast("show");
						displayModelsOnTable();
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

function addNewModel() {
	$(document).on("click", "#addModel", function (event) {
		event.preventDefault();

		$(".modal-title").text("New simulation");

		var modalContentHtml = `
			<form id="newsimulationForm" enctype="multipart/form-data" novalidate>
				<div class="input-group mb-3">
					<span class="input-group-text fw-semibold">Simulation Title<span class="text-danger">*</span></span>
					<input type="text" class="form-control" id="simulationTitle" required minlength="3" maxlength="100">
					<div class="invalid-feedback">Please provide a simulation title (3-100 characters).</div>
				</div>
				<div class="input-group mb-3">
					<input type="file" class="form-control" id="uploadNewFileBanner" accept=".jpg, .jpeg" required>
					<label class="input-group-text fw-semibold" for="uploadNewFileBanner">Upload Banner <span class="text-danger">*</span></label>
					<div class="invalid-feedback">Please upload a banner file (JPG only).</div>
				</div>
				<div class="input-group mb-3">
					<input type="file" class="form-control" id="uploadNewFile" accept=".glb, .gltf" required>
					<label class="input-group-text fw-semibold" for="uploadNewFile">Upload Simulation <span class="text-danger">*</span></label>
					<div class="invalid-feedback">Please upload a simulation file (GLB or GLTF only).</div>
				</div>
				<div class="btn-container">
					<button type="submit" class="btn btn-primary">Submit</button>
				</div>
			</form>
		`;
		$("#reusableModal .modal-body").html(modalContentHtml);
		$("#reusableModal").modal("show");
	});

	$(document).on("submit", "#newsimulationForm", function (event) {
		event.preventDefault();
		var form = $(this);

		if (!form[0].checkValidity()) {
			form.addClass("was-validated");
			return;
		}

		var simulationBanner = $("#uploadNewFileBanner")[0].files[0];
		var simulationFile = $("#uploadNewFile")[0].files[0];

		if (!simulationBanner) {
			if (!simulationBanner) {
				$("#uploadNewFileBanner").siblings(".invalid-feedback").show();
			}
			if (!simulationFile) {
				$("#uploadNewFile").siblings(".invalid-feedback").show();
			}
			form.addClass("was-validated");
			return;
		}

		var formData = new FormData();
		formData.append("simulationTitle", $("#simulationTitle").val());
		formData.append("simulationUrl", $("#simulationUrl").val());
		formData.append("simulationBanner", simulationBanner);
		formData.append("simulationFile", simulationFile);

		$.ajax({
			method: "POST",
			url: "../phpscripts/usr/add-simulation.php",
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
					displayModelsOnTable();
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
