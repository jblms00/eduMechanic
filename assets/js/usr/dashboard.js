$(document).ready(function () {
	getCounts();
	getRecentTasks();
});

function getCounts() {
	$.ajax({
		url: "../phpscripts/usr/get-dashboard-counts.php",
		method: "GET",
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				$("#totalStudents").text(response.totalStudents);
				$("#totalQuizzes").text(response.totalQuizzes); // Update total quizzes
				$("#totalActivities").text(response.totalActivities); // Update total activities

				updateActivityChart(response.activitiesCompletedPerLesson);
				updateQuizChart(response.quizPerformance);
			} else {
				console.error(response.message);
			}
		},
		error: function (error) {
			console.error("Error fetching counts:", error);
		},
	});
}

function updateActivityChart(activitiesCompletedPerLesson) {
	var lessons = [];
	var activitiesCompleted = [];
	var lessonIndex = 1;

	for (var lesson in activitiesCompletedPerLesson) {
		lessons.push("Lesson " + lessonIndex);
		activitiesCompleted.push(Number(activitiesCompletedPerLesson[lesson]));
		lessonIndex++;
	}

	var activityOptions = {
		chart: {
			type: "bar",
			height: 350,
		},
		series: [
			{
				name: "Activities Completed",
				data: activitiesCompleted,
			},
		],
		xaxis: {
			categories: lessons,
		},
	};

	var activityChart = new ApexCharts(
		document.querySelector("#activityChart"),
		activityOptions
	);
	activityChart.render();
}

function updateQuizChart(quizPerformance) {
	var passed = Number(quizPerformance.Passed);
	var failed = Number(quizPerformance.Failed);
	var pending = Number(quizPerformance.Pending);
	var notAttempted = Number(quizPerformance["Not Attempted"]);

	var quizOptions = {
		chart: {
			type: "pie",
			height: 350,
		},
		series: [passed, failed, pending, notAttempted],
		labels: ["Passed", "Failed", "Pending", "Not Attempted"],
	};

	var quizChart = new ApexCharts(
		document.querySelector("#quizChart"),
		quizOptions
	);
	quizChart.render();
}

function getRecentTasks() {
	$.ajax({
		url: "../phpscripts/usr/get-recent-tasks.php",
		method: "GET",
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				displayRecentTasks(response.recentTasks);
			} else {
				console.error(response.message);
			}
		},
		error: function (error) {
			console.error("Error fetching recent tasks:", error);
		},
	});
}

function displayRecentTasks(tasks) {
	let html = "";

	if (tasks.length === 0) {
		html = `<tr>
                    <td class="text-center text-danger" colspan="6">No recent task/s available.</td>
                </tr>`;
	} else {
		tasks.forEach(function (task, index) {
			let badgeClass = "";
			if (task.passing_status === "Passed") {
				badgeClass = "bg-success";
			} else if (task.passing_status === "Failed") {
				badgeClass = "bg-danger";
			} else if (task.passing_status === "Incomplete") {
				badgeClass = "bg-warning";
			} else {
				badgeClass = "bg-secondary";
			}

			html += `<tr>
                        <td class="text-center">${index + 1}</td>
                        <td class="text-center">${task.student}</td>
                        <td class="text-center">${task.task_type}</td>
                        <td class="text-center">${task.score}</td>
                        <td class="text-center">
                            <span class="badge ${badgeClass} w-100">
                                ${task.passing_status}
                            </span>
                        </td>
                        <td class="text-center">${formatDate(task.date)}</td>
                    </tr>`;
		});
	}

	$("#recentTasks tbody").html(html);
}
