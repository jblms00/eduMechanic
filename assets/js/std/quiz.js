const toastMessage = $("#liveToast .toast-body p");
const currentUserId = $("body").data("user-id");
var selectedAnswers = {};

$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	var rid = urlParams.get("rid"); // Reading ID
	var tle = urlParams.get("tle"); // Title
	var qz = urlParams.get("qz"); // Quiz Id
	var qnum = urlParams.get("qnum"); // Quiz #

	if (!rid || !tle || !qz || !qnum) {
		console.error("Invalid parameters: rid, tle, qz or qnum not found.");
		return;
	}

	displayQuestions(rid, qz, qnum);
	saveScore(rid, tle, qz);

	$(".quiz-number").text(qnum);

	$(document).on("click", ".go-back", function (event) {
		event.preventDefault();

		$(".modal-title").text("Exit Quiz");
		$("#reusableModal .modal-body").html(`
			<p class="mb-0 text-center">Are you sure you want to exit the quiz?</p>
			<div class="text-center mt-4">
				<button type="button" class="btn btn-danger btn-sm w-50 confirm-exit">Confirm</button>
			</div>
		`);
		$("#reusableModal").modal("show");
	});

	$(document).on("click", ".confirm-exit", function () {
		window.location.href = `reading?tl=${tle}&id=${rid}`;
	});

	$(document).on("click", ".finish-quiz", function () {
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		$(".next-question").off("click");
		$(".previous-question").off("click");
		calculateScore();
	});

	$(document).on("click", "#retryQuizBtn", function () {
		$("#scoreModal").modal("hide");

		selectedAnswers = {};

		$(".user-answers").empty();
		$(".previous-question, .next-question").prop("disabled", false);
		$(".next-question").text("Next Question");
		$(".question").html("");
		$(".choices").html("");

		currentQuestionIndex = 0;

		startTimer();
		displayQuestions(rid, qz, qnum);
	});
});

function displayQuestions(rid, qz, qnum) {
	$.ajax({
		url: "../phpscripts/std/fetch-questions.php",
		type: "GET",
		data: { rid: rid, qz: qz, qnum: qnum },
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				var questions = response.data;

				$("body").attr("data-quiz-duration", questions[0].quiz_duration);

				if (!questions || questions.length === 0) {
					$(".question").html("<p>No questions available.</p>");
					$(".choices").html("");
					$(".previous-question, .next-question").prop("disabled", true);
					return;
				}

				// Store the total number of questions
				totalQuestions = questions.length;

				// Create item circles for each question in user-answers
				for (let i = 1; i <= totalQuestions; i++) {
					$(".user-answers").append(
						`<div class="item q${i}" data-ca=""></div>`
					);
				}

				shuffleArray(questions);
				var currentQuestionIndex = 0; // Keep track of current question index

				// Set totalQuestions in global scope for access in other functions
				window.totalQuestions = totalQuestions;

				function updateQuestion() {
					if (
						currentQuestionIndex < 0 ||
						currentQuestionIndex >= questions.length
					) {
						console.error(
							"Invalid question index:",
							currentQuestionIndex
						);
						return;
					}

					var question = questions[currentQuestionIndex];

					// Set the correct answer in the data-ca attribute for the current question item
					$(".user-answers .item")
						.eq(currentQuestionIndex)
						.attr("data-ca", base64Encode(question.answer));

					// Fade out the current question and choices before updating
					$(".question, .choices").fadeOut(200, function () {
						$(".question").html(
							`<h4 class="mb-3 fw-semibold">${question.question}</h4>`
						);

						var choicesHtml = question.choices
							.split("||")
							.map((choice, index) => {
								var capitalizedChoice = choice
									.split(" ")
									.map(
										(word) =>
											word.charAt(0).toUpperCase() + word.slice(1)
									)
									.join(" ");

								var varter = String.fromCharCode(97 + index);
								return `
                                    <div class="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">
                                        <input type="radio" class="btn-check" name="choices" id="choice-${varter}" value="${varter}" autocomplete="off"
                                        ${
															selectedAnswers[
																currentQuestionIndex
															] === varter
																? "checked"
																: ""
														}>
                                        <label class="btn btn-outline-secondary" for="choice-${varter}">${capitalizedChoice}</label>
                                    </div>`;
							})
							.join("");
						$(".choices").html(choicesHtml);

						// Fade in the updated question and choices
						$(".question, .choices").fadeIn(200);
					});

					// Update the question number
					$(".question-number").text(
						`Question ${currentQuestionIndex + 1} out of ${
							questions.length
						}`
					);

					// Disable the previous/next buttons as needed
					$(".previous-question").prop(
						"disabled",
						currentQuestionIndex === 0
					);

					var nextButton = $(".next-question");
					if (currentQuestionIndex === questions.length - 1) {
						nextButton
							.text("Finish Quiz")
							.off("click")
							.on("click", function () {
								if (timerInterval) {
									clearInterval(timerInterval);
								}

								$(".next-question").off("click");
								$(".previous-question").off("click");

								calculateScore();
							});
					} else {
						nextButton.text("Next Question").removeClass("finish-quiz");
					}

					// Update user-answers (circle) based on selected answers
					$(".user-answers .item").each(function (index) {
						var questionNum = index + 1;
						var selectedAnswer = selectedAnswers[questionNum - 1] || "";
						$(this).text(selectedAnswer);
					});
				}

				// Change question based on Next/Previous button
				function changeQuestion(next = true) {
					var selectedChoice = $("input[name='choices']:checked");
					if (selectedChoice.length) {
						selectedAnswers[currentQuestionIndex] = selectedChoice.val();
					}

					if (next) {
						currentQuestionIndex += 1;
					} else {
						currentQuestionIndex -= 1;
					}

					updateQuestion();
				}

				$(".previous-question").on("click", () => changeQuestion(false));
				$(".next-question").on("click", () => changeQuestion(true));

				$(".choices").on("change", "input[name='choices']", function () {
					var selectedChoice = $(this).val();
					selectedAnswers[currentQuestionIndex] = selectedChoice;

					var currentItem = $(".user-answers .item").eq(
						currentQuestionIndex
					);

					// Fade out the current item text before updating
					currentItem.fadeOut(200, function () {
						// Update the text of the current item
						currentItem.text(selectedChoice);

						// Fade in the updated answer
						currentItem.fadeIn(200);
					});
				});

				updateQuestion();
				startTimer();
			} else {
				console.error("Failed to fetch questions:", response.message);
				$(".question").html("<p>No questions available.</p>");
			}
		},
		error: function (error) {
			console.error("Error fetching questions:", error);
		},
	});
}

var timerInterval;

function startTimer() {
	// Clear any existing timer interval before starting a new one
	if (timerInterval) {
		clearInterval(timerInterval);
	}

	var timeString = $("body").data("quiz-duration");
	var timeParts = timeString.split(":");
	var timeRemaining =
		parseInt(timeParts[0]) * 3600 +
		parseInt(timeParts[1]) * 60 +
		parseInt(timeParts[2]);

	var timerDisplay = $(".timer");

	// Define pulse effect CSS
	$(".timer").css("transition", "transform 0.3s ease-in-out");

	// Start the timer interval
	timerInterval = setInterval(() => {
		var minutes = Math.floor(timeRemaining / 60);
		var seconds = timeRemaining % 60;
		var timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

		// Apply pulse effect when updating the timer display
		timerDisplay.text(timeFormatted);
		timerDisplay.css("transform", "scale(1.2)");

		// Revert to normal size after pulse effect
		setTimeout(function () {
			timerDisplay.css("transform", "scale(1)");
		}, 300); // Duration of the pulse effect

		// Change color of the timer as time runs out
		if (timeRemaining <= 10) {
			timerDisplay.css("color", "red"); // Change color to red when time is almost out
		} else {
			timerDisplay.css("color", "black"); // Default color
		}

		if (timeRemaining <= 0) {
			clearInterval(timerInterval); // Stop the timer
			$(".next-question").off("click");
			$(".previous-question").off("click");

			calculateScore();
		} else {
			timeRemaining--;
		}
	}, 1000);
}

function calculateScore() {
	var totalPoints = 0;
	var passingPercentage = $("body").data("passing-percentage");
	var pointsPerItem = 2; // Each item is worth 2 points
	var correctAnswers = 0; // Counter for correct answers
	var totalQuestions = window.totalQuestions; // Total number of questions
	var maxPoints = totalQuestions * pointsPerItem; // Maximum possible points
	var passingPoints = (maxPoints * passingPercentage) / 100;

	// Loop through the selected answers and compare with correct answers
	for (let i = 0; i < totalQuestions; i++) {
		var selectedAnswer = selectedAnswers[i];
		var correctAnswer = $(".user-answers .item").eq(i).attr("data-ca");

		// If the answer is correct, add points
		if (selectedAnswer === base64Decode(correctAnswer)) {
			correctAnswers++;
			totalPoints += pointsPerItem;
		}
	}

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
                <div class="card" data-user-score="${totalPoints}" data-score-percentage="${achievedPercentage}">
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

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function base64Encode(str) {
	return btoa(unescape(encodeURIComponent(str)));
}

function base64Decode(str) {
	return decodeURIComponent(escape(atob(str)));
}

function saveScore(rid, tle, quizId) {
	$(document).on("click", "#finishBtn", function () {
		var modal = $(this).closest(".modal");
		var user_score = modal.find(".card").data("user-score");
		var score_percentage = modal.find(".card").data("score-percentage");

		$.ajax({
			method: "POST",
			url: "../phpscripts/std/save-quiz-score.php",
			data: { user_score, score_percentage, currentUserId, quizId },
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					$("button, input, select").prop("disabled", true);
					$("a")
						.addClass("disabled")
						.on("click", function (e) {
							e.preventDefault();
						});

					toastMessage
						.text(response.message)
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");

					toastMessage.fadeOut(3000, function () {
						window.location.href = `reading?tl=${tle}&id=${rid}`;
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
	});
}
