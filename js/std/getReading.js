$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	var readingId = urlParams.get("id");
	var activityId = "";

	if (!readingId) {
		console.error("Reading ID not provided in the URL.");
		return;
	}

	$(".accordion-body").on("click", "li", function () {
		$(".accordion-body li").removeClass("link-active");
		$(this).addClass("link-active");
	});

	$(document).on("click", "#toggleSidebar", function () {
		$(".cs-content").toggleClass("is-active");
	});

	$(document).on("click", ".accordion-body ul li", function () {
		var section = $(this).data("section");
		var quizId = $(this).data("quiz-id");
		var btnText = $(this).text();
		activityId = $(this).data("activity-id");
		fetchContent(section, readingId, quizId, activityId, btnText);
	});

	getQuizzes(readingId);
	getActivities(readingId);
	fetchContent("Introduction", readingId, activityId, "Quiz 1");
});

function getQuizzes(readingId) {
	$.ajax({
		url: "../phpscripts/std/get-quizzes.php",
		type: "GET",
		data: { id: readingId },
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				var taskList = $("#taskList");
				if (taskList.length > 0) {
					response.data.forEach(function (quiz) {
						var quizItem = $("<li>")
							.attr("data-section", "Quiz")
							.attr("data-quiz-id", quiz.quiz_id)
							.text("Quiz " + quiz.quiz_number);
						taskList.append(quizItem);
					});
				} else {
					console.error("Quiz list container not found.");
				}
			} else {
				console.log("Error: " + response.message);
			}
		},
		error: function (error) {
			console.log("Error fetching quizzes: ", error);
		},
	});
}

function getActivities(readingId) {
	$.ajax({
		url: "../phpscripts/std/get-activities.php",
		type: "GET",
		data: { id: readingId },
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				var taskList = $("#taskList");
				if (taskList.length > 0) {
					response.data.forEach(function (activity) {
						var activityItem = $("<li>")
							.attr("data-section", "Activity")
							.attr("data-activity-id", activity.activity_id)
							.text("Activity " + activity.activity_number);
						taskList.append(activityItem);
					});
				} else {
					console.error("Activity list container not found.");
				}
			} else {
				console.log("Error: " + response.message);
			}
		},
		error: function (error) {
			console.log("Error fetching activities: ", error);
		},
	});
}

function fetchContent(section, readingId, quizId, activityId, btnText) {
	$.ajax({
		url: "../phpscripts/std/get-lesson-details.php",
		type: "GET",
		data: { id: readingId },
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				var lesson = response.data;

				// Generate Introduction
				var learningsArray = lesson.lesson_learnings.split(",");
				var lessonLearningsHtml = learningsArray
					.map((learning) => `<li class="my-2">${learning.trim()}</li>`)
					.join("");
				var introductionHtml = `
                    <div class="cs-description">
                        <h3 class="fw-bold mb-4">Welcome to the ${lesson.lesson_title} Course!</h3>
                        <h4 class="fw-bold mb-5">Learning Objectives</h4>
                        <h4 class="fw-bold mb-1">In this course, you will learn:</h4>
                        <ul class="fs-5 text-dark fw-bold">
                            ${lessonLearningsHtml}
                        </ul>
                    </div>
                `;

				// Generate Content
				var lessonFiles = lesson.lesson_content.split(","); // Assuming multiple files are comma-separated

				var contentHtml = '<div class="pdf-container">';
				if (lessonFiles.length === 1) {
					// Display single lesson file
					contentHtml += `<embed src="${lessonFiles[0]}" type="application/pdf" width="100%" height="100%">`;
				} else {
					// Display buttons for multiple lesson files
					contentHtml += `<div class="lesson-buttons center mb-3">`;
					lessonFiles.forEach((file, index) => {
						contentHtml += `<button class="btn btn-primary btn-sm mx-1 lesson-btn" data-src="${file}">Reading ${
							index + 1
						}</button>`;
					});
					contentHtml += `</div>`;
					// Default embed (first lesson)
					contentHtml += `<embed id="lessonEmbed" src="${lessonFiles[0]}" type="application/pdf" width="100%" height="100%">`;
				}
				contentHtml += `</div>`;

				// Generate Activity
				var activitytHtml = `
                    <div class="cs-description">
                        <h3 class="fw-bold mb-4">Activity: Drag-and-Drop Tools</h3>
                        <div class="box-container">
                            <h4 class="fw-bold mb-1">Activity Details</h4>
                            <ul class="mechanic-act">
                                <li>Click and hold the mechanic tool and release the mouse button from the corresponding function box.</li>
                                <li>Make sure that each mechanic tool is correctly matched to its name.</li>
                                <li>You can't exit from the activity while you're in progress.</li>
                                <li>You can make multiple attempts until all matches are correct.</li>
                                <li>You'll get points on the basis of your correct answers.</li>
                            </ul>
                            <div class="text-center mt-4">
                                <a href="activity?dragDropAct&tle=${lesson.lesson_title}&rid=${readingId}&act=${activityId}" class="btn btn-primary">Start Now</a>
                            </div>
                        </div>
                    </div>
                `;

				// Generate Quiz
				var quiztHtml = `
                    <div class="cs-description">
                        <h3 class="fw-bold mb-4">${btnText}</h3>
                        <div class="box-container">
                            <h4 class="fw-bold mb-1">Quiz Details</h4>
                            <ul class="mechanic-act">
                                <li>You will be given time to finish the quiz.</li>
                                <li>You can't exit from the quiz while you're in progress.</li>
                                <li>You can make multiple attempts.</li>
                                <li>You'll get points on the basis of your correct answers.</li>
                            </ul>
                            <div class="text-center mt-4">
                                <a href="quiz?tle=${lesson.lesson_title}&qnum=${btnText}&qz=${quizId}&rid=${readingId}" class="btn btn-primary">Start Now</a>
                            </div>
                        </div>
                    </div>
                `;

				// Update content based on section
				var contentWrapper = $(".cs-content");
				var sidebarToggleHtml = `
                    <a href="#" id="toggleSidebar">
                        <i class="fa-solid fa-bars fs-3 text-dark"></i>
                    </a>
                `;

				if (section === "Introduction") {
					contentWrapper.slideUp(300, function () {
						$(this)
							.html(sidebarToggleHtml + introductionHtml)
							.slideDown(300);
					});
				} else if (section === "Content") {
					contentWrapper.slideUp(300, function () {
						$(this).html(sidebarToggleHtml + contentHtml);
						$(".pdf-container").hide().fadeIn(500); // Add animation
						$(this).slideDown(300);
					});

					$(document).on("click", ".lesson-btn", function () {
						var newSrc = $(this).data("src");
						$("#lessonEmbed").fadeOut(300, function () {
							$(this).attr("src", newSrc).fadeIn(300);
						});
					});
				} else if (section === "Activity") {
					contentWrapper.slideUp(300, function () {
						$(this)
							.html(sidebarToggleHtml + activitytHtml)
							.slideDown(300);
					});
				} else if (section === "Quiz") {
					contentWrapper.slideUp(300, function () {
						$(this)
							.html(sidebarToggleHtml + quiztHtml)
							.slideDown(300);
					});
				}

				$(".pdf-container").css({
					position: "relative",
					overflow: "auto",
				});
			} else {
				console.error("Error:", response.message);
			}
		},
		error: function (xhr, status, error) {
			console.error("AJAX Error:", error);
		},
	});

	function togglePdfContainer() {
		if ($(window).width() <= 426) {
			$(".pdf-container embed").hide();
			$(".message-container").show();
		} else {
			$(".pdf-container embed").show();
			$(".message-container").hide();
		}
	}
}
