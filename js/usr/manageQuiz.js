const toastMessage = $("#liveToast .toast-body p");
const tableBody = $("#quizTable tbody");
const noDataMessage = $(
	"<tr><td colspan='5' class='text-center text-danger'>No data found</td></tr>"
);

$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	var readingId = urlParams.get("id");

	if (readingId) {
		displayQuizOnTable(readingId);
		editQuizOnModal();
		saveInfoUpdates(readingId);
		saveQuestionnaireUpdates();
		deleteQuizOnModal(readingId);
		addNewQuiz(readingId);
		viewStudentsScore();

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

		$(document).on("click", ".add-choice", function () {
			var questionIndex = $(this).data("question-index");
			var choiceContainer = $(this).closest(".choices");

			var choicesCount = $(this)
				.closest(".question-container")
				.find(".choice-container").length;
			var choiceLetter = String.fromCharCode(97 + choicesCount);

			var newChoiceHtml = `
                <div class="choice-container mb-2 d-flex align-items-center gap-3">
                    <input type="text" name="choices_${questionIndex}[]" class="form-control" style="width: 82%;" required>
                    <span style="font-size: 15px;">
                        <input type="radio" name="correct_answer_${questionIndex}" value="${choiceLetter}"> Correct
                    </span>
                    <i class="fa-solid fa-circle-xmark remove-choice text-danger fs-4" style="cursor: pointer;"></i>
                </div>
            `;

			choiceContainer.append(newChoiceHtml);
			updateChoiceLetters(questionIndex);
		});

		$(document).on("click", ".remove-choice", function () {
			var questionIndex = $(this)
				.closest(".question-container")
				.data("question-index");

			var choiceContainer = $(this).closest(".choice-container");
			choiceContainer.remove();

			updateChoiceLetters(questionIndex);
		});
	} else {
		console.error("Reading ID is missing in the URL.");
	}
});

function displayQuizOnTable(readingId) {
	$.ajax({
		url: "../phpscripts/usr/get-quizzes.php",
		data: { readingId },
		type: "GET",
		dataType: "json",
		success: function (response) {
			tableBody.empty();

			if (response.status === "success") {
				if (response.quizzes.length === 0) {
					tableBody.append(noDataMessage);
				} else {
					let counter = 1;

					response.quizzes.forEach((quiz) => {
						const row = `
                            <tr data-quiz-id="${quiz.quiz_id}" 
                                data-quiz-number="${quiz.quiz_number}"
                                data-quiz-duration="${quiz.quiz_duration}"
                                data-quiz-due-date="${quiz.quiz_due_date}">
                                <td class="text-center fw-bold">${counter++}</td>
                                <td>${quiz.quiz_title}</td>
                                <td class="text-center">
                                    ${quiz.passing_percentage}%
                                </td>
                                <td class="text-center">
                                    ${formatDuration(quiz.quiz_duration)}
                                </td>
                                <td class="text-center">
                                    ${formatDateOnly(quiz.quiz_due_date)}
                                </td>
                                <td class="text-center">
                                    <div class="dropdown">
                                        <button class="btn-option" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="dropdown-item edit-questionnaire" href="#">
                                                    <i class="fa-solid fa-clipboard-list me-2"></i> Edit Questionnaire
                                                </a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item edit-info" href="#">
                                                    <i class="fa-solid fa-pen-to-square me-2"></i> Edit Info
                                                </a>
                                            </li>
											<li><a class="dropdown-item view" href="#">
													<i class="fa-solid fa-eye me-2"></i> View Attempts
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

function formatDuration(duration) {
	if (!duration) return "0 seconds";

	var [hours, minutes, seconds] = duration.split(":").map(Number);

	var parts = [];
	if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
	if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
	if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

	return parts.length > 0 ? parts.join(" and ") : "0 seconds";
}

function editQuizOnModal() {
	$(document).on("click", ".edit-info", function (event) {
		event.preventDefault();

		var row = $(this).closest("tr");
		var quizId = row.data("quiz-id");
		var quizNumber = row.data("quiz-number");
		var quizTitle = row.find("td").eq(1).text();
		var passPercentage = row.find("td").eq(2).text().replace("%", "").trim();
		var duration = row.data("quiz-duration");
		var dueDate = row.data("quiz-due-date");

		const passingPercentageOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
			.map((value) => {
				const isSelected =
					passPercentage === value.toString() ? "selected" : "";
				return `<option value="${value}" ${isSelected}>${value}%</option>`;
			})
			.join("");

		var modalContentHtml = `
            <input type="hidden" id="editQuizId" value="${quizId}">
            <div class="input-group mb-3">
                <span class="input-group-text fw-semibold">Quiz Title</span>
                <input type="text" class="form-control" id="quizTitle" value="${quizTitle}">
            </div>
            <div class="row mb-3">
                <div class="col-3">
                    <div class="input-group">
                        <span class="input-group-text fw-semibold">Quiz #<span class="text-danger">*</span></span>
                        <input type="number" class="form-control" id="quizNumber" value="${quizNumber}" required>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group">
                        <span class="input-group-text fw-semibold">Duration<span class="text-danger">*</span></span>
                        <input type="text" class="form-control" id="quizDuration" value="${duration}" placeholder="HH:MM:SS" required>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group">
                        <span class="input-group-text fw-semibold">Due Date<span class="text-danger">*</span></span>
                        <input type="date" class="form-control" id="quizDueDate" value="${dueDate}" required>
                    </div>
                </div>
            </div>
            <div class="input-group mb-5">
                <select class="form-select form-select-sm" id="quizPassingPercentage">
                    <option selected disabled>Select a passing percentage for this quiz</option>
                    ${passingPercentageOptions}
                </select>
            </div>
            <div class="btn-container">
                <button type="button" class="btn btn-primary w-25 update-info">Save changes</button>
            </div>
        `;

		$(".modal-title").text("Edit Quiz");
		$("#reusableModal .modal-dialog").addClass("modal-lg");
		$("#reusableModal .modal-body").html(modalContentHtml);
		$("#reusableModal").modal("show");
	});

	$(document).on("click", ".edit-questionnaire", function () {
		var row = $(this).closest("tr");
		var quizId = row.data("quiz-id");

		$.ajax({
			url: "../phpscripts/usr/get-quiz-questionnaire.php",
			data: { quizId },
			type: "GET",
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					var modalContentHtml = `
                        <form id="quizForm">
                    `;

					// Loop through each questionnaire and create form content
					response.questionnaires.forEach(function (questionnaire) {
						var choices = questionnaire.choices.split("||");
						modalContentHtml += `
                            <div class="question-container mb-5" data-questionnaire-id="${questionnaire.questionnaire_id}">
                                <p class="fw-semibold mb-1">Question: </p>
                                <textarea class="form-control" placeholder="${questionnaire.question}" name="question_${questionnaire.questionnaire_id}" style="height: 80px" required>${questionnaire.question}</textarea>
                                <div class="choices mt-3">
                                    <div class="d-flex align-items-center justify-content-between mb-3">
                                        <p class="fw-semibold mb-1">Choices:</p>
                                        <button type="button" class="btn btn-secondary btn-sm add-choice" style="font-size: 13px;" 
                                        data-questionnaire-id="${questionnaire.questionnaire_id}">Add Choice</button>
                                    </div>
                        `;

						// Loop through choices and add input fields for each choice
						choices.forEach(function (choice, index) {
							var letter = String.fromCharCode(97 + index); // 'a', 'b', 'c', etc.
							var checked =
								questionnaire.answer.trim() === letter ? "checked" : "";

							modalContentHtml += `
                                    <div class="choice-container mb-2 d-flex align-items-center gap-3">
                                        <input type="text" name="choice_${questionnaire.questionnaire_id}_${index}" class="form-control choice-input" style="width: 82%;" value="${choice}" required>
                                        <span style="font-size: 15px;">
                                            <input type="radio" name="answer_${questionnaire.questionnaire_id}" value="${letter}" ${checked}> Correct
                                        </span>
                                        <i class="fa-solid fa-circle-xmark remove-choice text-danger fs-4" style="cursor: pointer;"></i>
                                    </div>
                            `;
						});

						modalContentHtml += `
                                </div>
                            </div>
                        `;
					});

					modalContentHtml += `
                        <div class="btn-container mt-3">
                            <button type="button" class="btn btn-primary btn-sm w-25 save-updates">Save changes</button>
                        </div>
                    </form>
                    `;

					$(".modal-title").text("Edit Quiz");
					$("#reusableModal .modal-dialog").addClass("modal-lg");
					$("#reusableModal .modal-body").html(modalContentHtml);
					$("#reusableModal").modal("show");

					handleChoiceEvents();
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

function handleChoiceEvents() {
	$(document).on("click", ".add-choice", function () {
		var questionnaireId = $(this).data("questionnaire-id");
		var choiceContainer = $(this).closest(".choices");
		var newChoiceIndex = choiceContainer.find(".choice-container").length;

		var newChoiceHtml = `
            <div class="choice-container mb-2 d-flex align-items-center gap-3">
                <input type="text" name="choice_${questionnaireId}_${newChoiceIndex}" class="form-control choice-input" style="width: 82%;" value="" required>
                <span style="font-size: 15px;">
                    <input type="radio" name="answer_${questionnaireId}" 
                    value="${String.fromCharCode(97 + newChoiceIndex)}"> Correct
                </span>
                <i class="fa-solid fa-circle-xmark remove-choice text-danger fs-4" style="cursor: pointer;"></i>
            </div>
        `;

		choiceContainer.append(newChoiceHtml);
	});

	$(document).on("click", ".remove-choice", function () {
		$(this).closest(".choice-container").remove();
	});
}

function saveInfoUpdates(readingId) {
	$(document).on("click", ".update-info", function () {
		var quizId = $("#editQuizId").val();
		var quizNumber = $("#quizNumber").val();
		var quizTitle = $("#quizTitle").val();
		var quizDuration = $("#quizDuration").val();
		var quizDueDate = $("#quizDueDate").val();
		var passingPercentage = $("#quizPassingPercentage").val();

		$.ajax({
			url: "../phpscripts/usr/save-quiz-info.php",
			data: {
				quizId: quizId,
				quizNumber: quizNumber,
				quizTitle: quizTitle,
				quizDuration: quizDuration,
				quizDueDate: quizDueDate,
				passingPercentage: passingPercentage,
			},
			type: "POST",
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					displayQuizOnTable(readingId);
					toastMessage
						.text(response.message)
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");
					$("#reusableModal").modal("hide");
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

function saveQuestionnaireUpdates(readingId) {
	$(document).on("click", ".save-updates", function () {
		var formData = [];

		$("#quizForm .question-container").each(function () {
			var questionnaireId = $(this).data("questionnaire-id");
			var question = $(this)
				.find(`textarea[name="question_${questionnaireId}"]`)
				.val()
				.replace(/"/g, "");
			var choices = [];
			var answer = "";

			$(this)
				.find(".choice-container")
				.each(function (index) {
					var choice = $(this)
						.find(`input[name="choice_${questionnaireId}_${index}"]`)
						.val();
					var isChecked = $(this)
						.find(`input[name="answer_${questionnaireId}"]:checked`)
						.val();

					choices.push(choice);

					if (isChecked) {
						answer = isChecked;
					}
				});

			formData.push({
				questionnaire_id: questionnaireId,
				question: question,
				choices: choices.join("||"),
				answer: answer,
			});
		});

		$.ajax({
			url: "../phpscripts/usr/save-updated-quiz.php",
			data: { updatedAnswers: JSON.stringify(formData) },
			type: "POST",
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					displayQuizOnTable(readingId);
					toastMessage
						.text(response.message)
						.addClass("text-success")
						.removeClass("text-danger");
					$("#liveToast").toast("show");
					$("#reusableModal").modal("hide");
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

function deleteQuizOnModal(readingId) {
	$(document).on("click", ".delete", function (event) {
		event.preventDefault();

		var row = $(this).closest("tr");
		var quizId = row.data("quiz-id");

		$(".modal-title").text("Delete Quiz");
		$("#reusableModal .modal-body").html(`
            <p class="mb-0 text-center">Are you sure you want to delete this quiz?</p>
            <input type="hidden" id="quizId" value="${quizId}">
            <div class="text-center mt-4">
                <button type="button" class="btn btn-danger btn-sm w-50 confirm-delete">Confirm</button>
            </div>
        `);

		$("#reusableModal").modal("show");
	});

	$(document).on("click", ".confirm-delete", function () {
		var quizToDelete = $("#quizId").val();
		if (quizToDelete) {
			$.ajax({
				type: "POST",
				url: "../phpscripts/usr/delete-quiz.php",
				data: { quiz_id: quizToDelete },
				dataType: "json",
				success: function (response) {
					if (response.status === "success") {
						toastMessage
							.text(response.message)
							.addClass("text-success")
							.removeClass("text-danger");
						$("#liveToast").toast("show");
						displayQuizOnTable(readingId);
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

function addNewQuiz(readingId) {
	$(document).on("click", "#addQuiz", function (event) {
		event.preventDefault();

		$(".modal-title").text("New Quiz");

		var modalContentHtml = `
			<form id="newQuizForm">
				<div class="input-group mb-3">
					<span class="input-group-text fw-semibold">Quiz Title<span class="text-danger">*</span></span>
					<input type="text" class="form-control" id="newQuizTitle" required minlength="3" maxlength="100">
				</div>
                <div class="row mb-3">
                    <div class="col-3">
                        <div class="input-group">
                            <span class="input-group-text fw-semibold">Quiz #<span class="text-danger">*</span></span>
                            <input type="number" class="form-control" id="newQuizNumber" required>
                        </div>
                    </div>
                    <div class="col">
                        <div class="input-group">
                            <span class="input-group-text fw-semibold">Duration<span class="text-danger">*</span></span>
                            <input type="text" class="form-control" id="newQuizDuration" placeholder="HH:MM:SS" required>
                        </div>
                    </div>
                    <div class="col">
                        <div class="input-group">
                            <span class="input-group-text fw-semibold">Due Date<span class="text-danger">*</span></span>
                            <input type="date" class="form-control" id="newQuizDueDate" required>
                        </div>
                    </div>
                </div>
                <div class="input-group mb-5">
                    <select class="form-select form-select-sm" id="newQuizPassingPercentage">
                        <option selected disabled>Select a passing percentage for this quiz</option>
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
				</div>
				<div id="questionsContainer">
					<!-- Questions will be dynamically added here -->
				</div>
				<div class="btn-container mt-3">
					<button type="button" class="btn btn-secondary btn-sm w-25" id="addQuestionBtn">Add Question</button>
					<button type="submit" class="btn btn-primary btn-sm w-25">Save Quiz</button>
				</div>
			</form>
		`;

		$("#reusableModal .modal-dialog").addClass("modal-lg");
		$("#reusableModal .modal-body").html(modalContentHtml);
		$("#reusableModal").modal("show");

		$("#addQuestionBtn").on("click", function () {
			addNewQuestion();
		});

		$("#newQuizForm").on("submit", function (event) {
			event.preventDefault();
			saveQuiz(readingId);
		});
	});
}

function addNewQuestion() {
	var questionIndex = $("#questionsContainer .question-container").length;

	var questionHtml = `
        <div class="question-container mb-5" data-question-index="${questionIndex}">
            <p class="fw-semibold mb-1">Question: </p>
            <textarea class="form-control" name="question[]" placeholder="Enter question" required></textarea>
            <div class="choices mt-3">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <p class="fw-semibold mb-1">Choices:</p>
                    <button type="button" class="btn btn-secondary btn-sm add-choice" data-question-index="${questionIndex}" style="font-size: 13px;">Add Choice</button>
                </div>
                <!-- Choices will be dynamically added here -->
            </div>
        </div>
    `;
	$("#questionsContainer").append(questionHtml);
}

function updateChoiceLetters(questionIndex) {
	var choices = $(
		`[data-question-index='${questionIndex}'] .choice-container`
	);

	choices.each(function (index) {
		var newLetter = String.fromCharCode(97 + index); // 'a', 'b', 'c', etc.
		$(this).find("input[type='radio']").val(newLetter);
	});
}

function saveQuiz(readingId) {
	var quizTitle = $("#newQuizTitle").val();
	var newQuizNumber = $("#newQuizNumber").val();
	var newQuizDuration = $("#newQuizDuration").val();
	var newQuizDueDate = $("#newQuizDueDate").val();
	var newQuizPassingPercentage = $("#newQuizPassingPercentage").val();

	// Regular expression to validate HH:MM:SS format
	var timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;

	// Validation for quiz title
	if (!quizTitle || quizTitle.length < 3 || quizTitle.length > 100) {
		toastMessage
			.text(
				"Quiz title is required and must be between 3 and 100 characters."
			)
			.addClass("text-danger")
			.removeClass("text-success");
		$("#liveToast").toast("show");
		console.log("Quiz title validation failed.");
		return;
	}

	// Validation for quiz duration (HH:MM:SS)
	if (!newQuizDuration || !timeFormatRegex.test(newQuizDuration)) {
		toastMessage
			.text("Quiz duration must be in the format HH:MM:SS.")
			.addClass("text-danger")
			.removeClass("text-success");
		$("#liveToast").toast("show");
		console.log("Quiz duration validation failed.");
		return;
	}

	// Validation for passing percentage
	if (
		!newQuizPassingPercentage ||
		isNaN(newQuizPassingPercentage) ||
		newQuizPassingPercentage < 0 ||
		newQuizPassingPercentage > 100
	) {
		toastMessage
			.text("Quiz passing percentage must be a number between 0 and 100.")
			.addClass("text-danger")
			.removeClass("text-success");
		$("#liveToast").toast("show");
		console.log("Quiz passing percentage validation failed.");
		return;
	}

	var questions = [];
	var validQuestionCount = 0;

	$("#questionsContainer .question-container").each(function () {
		var questionText = $(this).find("textarea[name='question[]']").val();
		var choices = [];
		var questionIndex = $(this).data("question-index");

		// Collect choices based on the dynamic name attribute (choices_{questionIndex}[])
		$(this)
			.find(`input[name='choices_${questionIndex}[]']`)
			.each(function () {
				var choiceValue = $(this).val().trim(); // Trim the choice value
				if (choiceValue) {
					choices.push(choiceValue);
				}
			});

		// Collect correct answer based on the dynamic name (correct_answer_{questionIndex})
		var correctAnswer = $(this)
			.find(`input[name='correct_answer_${questionIndex}']:checked`)
			.val();

		console.log("Checking question:", questionText);
		console.log("Choices:", choices);
		console.log("Correct Answer:", correctAnswer);

		// First check: Is there a question and at least 3 choices and a correct answer?
		if (questionText && choices.length >= 3 && correctAnswer) {
			questions.push({
				question: questionText,
				choices: choices.join("||"),
				answer: correctAnswer,
			});
			validQuestionCount++;
			console.log("Valid question added.");
		} else {
			console.log(
				"Invalid question: Missing question text, choices or correct answer."
			);
		}
	});

	// Validation for at least 5 questions
	console.log("Valid question count:", validQuestionCount);
	if (validQuestionCount < 5) {
		toastMessage
			.text(
				"You must add at least 5 questions with at least 3 choices and a correct answer."
			)
			.addClass("text-danger")
			.removeClass("text-success");
		$("#liveToast").toast("show");
		console.log("Not enough valid questions.");
		return;
	}

	// Validation for at least 5 questions
	console.log("Valid question count:", validQuestionCount);
	if (validQuestionCount < 5) {
		toastMessage
			.text(
				"You must add at least 5 questions with at least 3 choices and a correct answer."
			)
			.addClass("text-danger")
			.removeClass("text-success");
		$("#liveToast").toast("show");
		console.log("Not enough valid questions.");
		return;
	}

	$.ajax({
		url: "../phpscripts/usr/add-quiz.php",
		type: "POST",
		data: {
			readingId: readingId,
			quizTitle: quizTitle,
			newQuizNumber: newQuizNumber,
			newQuizDuration: newQuizDuration,
			newQuizDueDate: newQuizDueDate,
			newQuizPassingPercentage: newQuizPassingPercentage,
			questions: JSON.stringify(questions),
		},
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				$("#reusableModal").modal("hide");
				toastMessage
					.text(response.message)
					.addClass("text-success")
					.removeClass("text-danger");
				$("#liveToast").toast("show");
				displayQuizOnTable(readingId);
			} else {
				toastMessage
					.text(response.message)
					.addClass("text-danger")
					.removeClass("text-success");
				$("#liveToast").toast("show");
			}
		},
		error: function (xhr, status, error) {
			console.error("AJAX error:", error);
		},
	});
}

function viewStudentsScore() {
	$(document).on("click", ".view", function () {
		var row = $(this).closest("tr");
		var quizId = row.data("quiz-id");

		$.ajax({
			url: "../phpscripts/usr/get-students-quiz-scores.php",
			data: { quizId },
			type: "GET",
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					$(".modal-title").text("Quiz Attempts");

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
							score.total_questions
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
									${score.score}/${score.total_questions * 2}
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
