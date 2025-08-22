const currentUserId = $("body").data("user-id");

$(document).ready(function () {
	displayProgressReports();

	$(".search-bar").on("keyup", function () {
		$(".filter-task").val("Task Type");
		$(".filter-status").val("Status");
		searchTable();
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
});

function displayProgressReports() {
	$.ajax({
		url: "../phpscripts/std/get-progress.php",
		data: { user_id: currentUserId },
		method: "GET",
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				$("table#progressTable tbody").empty();

				let tableHtml = "";

				// Loop through activities and display them
				response.activities.forEach(function (activity) {
					let status =
						activity.status === "Completed" ? "Completed" : "Incomplete";

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

					let passingStatus;
					if (activity.passing_status === "Passed") {
						passingStatus = `<i class="fa-solid fa-circle-check text-success fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Passed"></i>`;
					} else if (activity.passing_status === "Failed") {
						passingStatus = `<i class="fa-solid fa-circle-xmark text-danger fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Failed"></i>`;
					} else if (activity.passing_status === "Incomplete") {
						passingStatus = `<i class="fa-solid fa-circle-exclamation text-dark fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Incomplete"></i>`;
					} else {
						passingStatus = `<i class="fa-solid fa-circle-question text-warning fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Pending"></i>`;
					}

					tableHtml += `
                        <tr data-task-type="activity" data-status="${status.toLocaleLowerCase()}">
                            <td>
                                <h4>Activity ${activity.activity_number}</h4>
                                <div class="d-flex align-items-center gap-3">
                                    <p class="mb-0">
										${activity.activity_title}
									</p>
                                    <p class="mb-0">${dateType}</p>
                                    <span class="${badgeClass}" style="font-size: 12px;">${pointsType}</span>
                                </div>
                            </td>
                            <td class="text-center">
                                <span class="${badgeClass}">${status}</span>
                            </td>
                            <td class="text-center">${passingStatus}</td>
                        </tr>
                    `;
				});

				// Loop through quizzes and display them
				response.quizzes.forEach(function (quiz) {
					let status =
						quiz.status === "Completed" ? "Completed" : "Incomplete";
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

					let passingStatus;
					if (quiz.passing_status === "Passed") {
						passingStatus = `<i class="fa-solid fa-circle-check text-success fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Passed"></i>`;
					} else if (quiz.passing_status === "Failed") {
						passingStatus = `<i class="fa-solid fa-circle-xmark text-danger fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Failed"></i>`;
					} else if (quiz.passing_status === "Incomplete") {
						passingStatus = `<i class="fa-solid fa-circle-exclamation text-dark fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Incomplete"></i>`;
					} else {
						passingStatus = `<i class="fa-solid fa-circle-question text-warning fs-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Pending"></i>`;
					}

					tableHtml += `
						<tr data-task-type="quiz" data-status="${status.toLocaleLowerCase()}">
							<td>
								<h4>Quiz ${quiz.quiz_number}</h4>
								<div class="d-flex align-items-center gap-3">
									<p class="mb-0">${quiz.quiz_title}</p>
									<p class="mb-0">${dateType}</p>
									<span class="${badgeClass}" style="font-size: 12px;">${pointsType}</span>
								</div>
							</td>
							<td class="text-center">
								<span class="${badgeClass}">${status}</span>
							</td>
							<td class="text-center">${passingStatus}</td>
						</tr>
					`;
				});

				$("table#progressTable tbody").html(tableHtml);
				$('[data-bs-toggle="tooltip"]').tooltip();

				displayGraph();
			} else {
				console.log(response.message);
			}
		},
		error: function (error) {
			console.error(error);
		},
	});
}

function displayGraph() {
	let completedCount = 0;
	let incompleteCount = 0;

	// Loop through each row in the table
	$("#progressTable tbody tr").each(function () {
		const status = $(this).find("td:nth-child(2) span").text().trim();

		if (status === "Completed") {
			completedCount++;
		} else if (status === "Incomplete") {
			incompleteCount++;
		}
	});

	var options = {
		chart: {
			type: "pie",
			height: "550px",
		},
		series: [completedCount, incompleteCount],
		labels: ["Completed", "Incomplete"],
		colors: ["#8979ff", "#3cc3df"],
		legend: {
			position: "bottom",
			horizontalAlign: "center",
			floating: false,
			offsetY: 10,
		},
	};

	var chart = new ApexCharts(
		document.querySelector(".graph-container"),
		options
	);
	chart.render();
}

function searchTable() {
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
                <td colspan="3" class="text-center text-danger fs-5">No task found</td>
            </tr>
        `);
	}
}
