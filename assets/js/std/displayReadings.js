$(document).ready(function () {
	displayReadings();

	$(".nav-link").on("click", function (event) {
		event.preventDefault();
		$(".nav-link").removeClass("active");
		$(this).addClass("active");
		var category = $(this).text();
		displayReadings(category);
	});
});

function displayReadings(category = "All") {
	$.ajax({
		url: "../phpscripts/std/fetch-readings.php",
		method: "GET",
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				var readingsHtml = "";
				response.data.forEach((reading) => {
					if (category === "All" || reading.lesson_level === category) {
						readingsHtml += `
                            <div class="reading" data-readings-id="${reading.reading_id}">
                                <img src="../assets/images/uploadedLessonBanner/${reading.lesson_media}" alt="img" class="img-fluid">
                                <h2 class="fw-bold">${reading.lesson_title}</h2>
                                <a href="reading?tl=${reading.lesson_title}&id=${reading.reading_id}" class="mt-auto ms-auto">
                                    <i class="fa-solid fa-circle-chevron-right fs-2 text-dark"></i>
                                </a>
                            </div>
                        `;
					}
				});

				// Apply the fade-in effect when new content is displayed
				var container = $("#containerReadings");
				container.fadeOut(300, function () {
					container.html(
						readingsHtml ||
							`<p>No readings available for ${category}.</p>`
					);
					container.fadeIn(500); // Adjust fade-in speed
				});
			} else {
				$("#containerReadings").html(
					`<p>No readings available at the moment.</p>`
				);
			}
		},
		error: function (error) {
			console.log(error);
		},
	});
}
