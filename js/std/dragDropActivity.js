const toastMessage = $("#liveToast .toast-body p");
const currentUserId = $("body").data("user-id");

$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	var tle = urlParams.get("tle");
	var rid = urlParams.get("rid");
	var act = urlParams.get("act");

	$('[data-bs-toggle="tooltip"]').tooltip();

	fetchItems(rid, tle, act);

	$(document).on("click", "#retryQuizBtn", function () {
		$(".container-dragable").empty();
		$(".container-dropzone").empty();
		fetchItems(rid, tle, act);
		$("#scoreModal").modal("hide");
	});

	$(document).on("click", "#finishBtn", function () {
		var totalPoints = calculateScore();
		var scorePercentage = calculateScorePercentage(totalPoints);

		var scoreData = {
			activity_id: act,
			user_id: currentUserId,
			score: totalPoints,
			score_percentage: scorePercentage,
		};

		saveScore(scoreData, rid, tle, act);
	});

	$(document).on("click", ".info-btn", function () {
		var sketchfabCode = $(this).data("sketchfab-code");
		var itemName = $(this).data("name");

		$("#reusableModal .modal-title").text(itemName);

		if (sketchfabCode) {
			$("#reusableModal .modal-body").html(`
				<iframe title="${itemName}" 
					frameborder="0" 
					allow="autoplay; fullscreen; xr-spatial-tracking" 
					width="100%" height="400px"
					src="https://sketchfab.com/models/${sketchfabCode}/embed">
				</iframe>
			`);
			$("#reusableModal .modal-dialog").addClass(
				"modal-lg modal-dialog-centered"
			);
		} else {
			$("#reusableModal .modal-body").html(`
				<div class="text-center pb-3">
					<p class="text-danger fw-bold mb-0">No model found.</p>
				</div>
			`);
			$("#reusableModal .modal-dialog").removeClass("modal-dialog-centered");
			$("#reusableModal .modal-dialog").removeClass("modal-lg modal-md");
		}
		$("#reusableModal").modal("show");
	});
});

function fetchItems(rid, tle, act) {
	$.ajax({
		method: "GET",
		url: "../phpscripts/std/get-items.php",
		data: { activity_id: act },
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				var items = response.data;
				var draggableItems = [...items];
				var dropzones = [...items];

				shuffle(draggableItems);
				shuffle(dropzones);

				$(".container-dragable").empty();
				$(".container-dropzone").empty();

				draggableItems.forEach(function (item) {
					var itemHTML = `
                        <div class="draggable-item position-relative" id="item-${item.item_id}" data-id="${item.item_id}">
                            <img src="../assets/images/drag-and-drop-activities/${item.item_image}" alt="${item.item_name}" class="img-fluid" />
                            <button class="info-btn position-absolute top-0 end-0 p-0 m-1 btn btn-sm btn-primary rounded-circle" data-item-name="${item.item_name}" data-sketchfab-code="${item.sketchfab_code}">
                                <i class="fa-solid fa-info-circle fs-5"></i>
                            </button>
                        </div>`;
					$(".container-dragable").append(itemHTML);
				});

				dropzones.forEach(function (item) {
					var dropzoneHTML = `
                        <div class="dropzone" id="dropzone-${item.item_id}" data-id="${item.item_id}">
                            <h5 class="dropzone-name mb-0">${item.item_name}</h5>
                        </div>`;
					$(".container-dropzone").append(dropzoneHTML);
				});

				items.forEach(function (item) {
					makeDraggableAndDroppable(
						`#item-${item.item_id}`,
						`#dropzone-${item.item_id}`
					);
				});
			} else {
				console.log("Failed to get items.");
			}
		},
		error: function (error) {
			console.log(error);
		},
	});
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function makeDraggableAndDroppable(itemSelector, dropzoneSelector) {
	// Make the item draggable
	$(itemSelector).draggable({
		revert: "invalid",
		helper: "original",
		start: function (event, ui) {
			$(this).css("z-index", "100");
		},
	});

	// Make the dropzone droppable
	$(dropzoneSelector).droppable({
		accept: ".draggable-item",
		drop: function (event, ui) {
			if ($(this).hasClass("filled")) {
				alert("This dropzone is already filled!");
				return;
			}

			var droppedItem = ui.helper;
			$(this).append(droppedItem);
			$(this).css("min-width", "auto");

			droppedItem.css({
				position: "relative",
				top: "auto",
				left: "auto",
				transform: "none",
				width: "auto",
				height: "auto",
				zIndex: "auto",
			});

			$(this).addClass("filled").data("filled", droppedItem.data("id"));

			// Update border color
			updateDropzoneBorders();
			checkIfComplete();
		},
		out: function (event, ui) {
			$(this).removeClass("filled").data("filled", null);
			$(this).css("min-width", "320px");

			// Update border color
			updateDropzoneBorders();
		},
	});

	// Allow items to be dragged back
	$(".container-dragable").droppable({
		accept: ".draggable-item",
		drop: function (event, ui) {
			var droppedItem = ui.helper;
			$(this).append(droppedItem);
			droppedItem.css({
				position: "relative",
				top: "auto",
				left: "auto",
				transform: "none",
				zIndex: "auto",
			});

			$(`.dropzone[data-id="${droppedItem.data("id")}"]`)
				.removeClass("filled")
				.data("filled", null);

			// Update border color
			updateDropzoneBorders();
		},
	});
}

// Function to update dropzone border based on filled status
function updateDropzoneBorders() {
	$(".dropzone").each(function () {
		if ($(this).hasClass("filled")) {
			$(this).removeClass("border-danger").addClass("border-success");
		} else {
			$(this).removeClass("border-success").addClass("border-danger");
		}
	});
}

function checkIfComplete() {
	let totalItems = $(".draggable-item").length;
	let filledZones = $(".dropzone.filled").length;

	if (totalItems === filledZones) {
		checkScore();
	}
}

function checkScore() {
	let correctDrops = 0;
	var totalItems = $(".dropzone").length;
	var passingPercentage = $("body").data("passing-percentage");
	var pointsPerItem = 2; // Each item is worth 2 points
	var maxPoints = totalItems * pointsPerItem; // Maximum possible points
	var passingPoints = (maxPoints * passingPercentage) / 100;

	// Calculate correct drops
	$(".dropzone").each(function () {
		let dropzoneId = $(this).data("id");
		let filledItemId = $(this).data("filled");

		// Check if the dropzone has the correct item
		if (dropzoneId === filledItemId) {
			correctDrops++;
		}
	});

	var totalPoints = correctDrops * pointsPerItem;
	var achievedPercentage = (totalPoints / maxPoints) * 100;

	var contentHtml = "";

	// Determine if the user passed
	if (totalPoints >= passingPoints) {
		contentHtml = `
            <div class="icon-tag text-center">
                <i class="fa-solid fa-circle-check text-success"></i>
            </div>
            <h3 class="text-success text-center fw-bold mb-4">Congratulations! You’ve Passed</h3>
            <div class="container container-score d-flex justify-content-around">
                <div class="card">
                    <div class="card-body">
                        <h5>Score</h5>
                        <h1>${achievedPercentage}%</h1>
                        <hr>
                        <p class="mb-0 fw-semibold">Passing score: ${passingPercentage}%</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h5>Points</h5>
                        <h1>${totalPoints}</h1>
                        <hr>
                        <p class="mb-0 fw-semibold">Passing points: ${passingPoints}</p>
                    </div>
                </div>
            </div>
			<div class="text-center mt-3">
            	<button class="btn btn-primary" id="finishBtn">Finish</button>
			</div>
        `;
	} else {
		contentHtml = `
            <div class="icon-tag text-center">
                <i class="fa-solid fa-circle-xmark text-danger"></i>
            </div>
            <h3 class="text-danger text-center fw-bold mb-4">Almost there! Review the material and make another attempt!</h3>
            <div class="container container-score d-flex justify-content-around mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5>Score</h5>
                        <h1>${achievedPercentage}%</h1>
                        <hr>
                        <p class="mb-0 fw-semibold">Passing score: ${passingPercentage}%</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h5>Points</h5>
                        <h1>${totalPoints}</h1>
                        <hr>
                        <p class="mb-0 fw-semibold">Passing points: ${passingPoints}</p>
                    </div>
                </div>
            </div>
			<div class="text-center mt-3">
				<button class="btn btn-primary" id="retryQuizBtn">Retry Quiz</button>
			</div>
        `;
	}

	$(".modal-body").html(contentHtml);
	$("#scoreModal").modal("show");
}

function calculateScore() {
	// Calculate the total score based on correct drops
	let correctDrops = 0;
	$(".dropzone").each(function () {
		let dropzoneId = $(this).data("id");
		let filledItemId = $(this).data("filled");

		// Check if the dropzone has the correct item
		if (dropzoneId === filledItemId) {
			correctDrops++;
		}
	});

	// Assuming each correct drop is worth 2 points
	return correctDrops * 2;
}

function calculateScorePercentage(totalPoints) {
	// Calculate percentage based on total possible points
	var totalItems = $(".dropzone").length;
	var pointsPerItem = 2; // Points per item
	var maxPoints = totalItems * pointsPerItem; // Maximum points
	return (totalPoints / maxPoints) * 100;
}

function saveScore(data, rid, tle, act) {
	$.ajax({
		method: "POST",
		url: "../phpscripts/std/save-activity-score.php",
		data: data,
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				$("button, input, select").prop("disabled", true);
				$("a")
					.addClass("disabled")
					.on("click", function (e) {
						e.preventDefault();
					});
				$(".draggable").draggable("disable");

				toastMessage
					.text(response.message)
					.addClass("text-success")
					.removeClass("text-danger");
				$("#liveToast").toast("show");

				toastMessage.fadeOut(3000, function () {
					window.location.href = `reading?tl=${tle}&id=${rid}&act=${act}`;
				});
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
