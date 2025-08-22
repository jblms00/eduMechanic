$(document).ready(function () {
	displaySimulations();
});

function displaySimulations() {
	$.ajax({
		url: "../phpscripts/std/fetch-simulations.php",
		method: "GET",
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				var simulationsHtml = "";

				response.simulations.forEach(function (simulation) {
					var simulationVideo = simulation.video.replace(".mp4", "");
					simulationsHtml += `
                    <a href="preview?${simulation.title}&id=${simulation.model_id}&code=${simulationVideo}">
						<div class="card simulation-card" style="background-image: url(../assets/images/${simulation.banner});">
							<div class="card-footer">
								<h3 class="card-title">${simulation.title}</h3>
								<i class="fa-solid fa-circle-arrow-right fs-2 text-dark"></i>
							</div>
						</div>
					</a>`;
				});

				$("#containerSimulations").html(simulationsHtml);

				// Apply fade-in animation
				$(".simulation-card")
					.hide()
					.each(function (index) {
						$(this)
							.delay(index * 200)
							.fadeIn(400);
					});
			} else {
				$("#containerSimulations").html(
					"<li class='mt-3 text-danger fw-semibold'>No simulations found.</li>"
				);
			}
		},
		error: function (error) {
			console.error(error);
		},
	});
}
