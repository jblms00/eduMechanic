$(document).ready(function () {
	displayVideos();

	$(document).on("click", ".video-card", function () {
		var videoTitle = $(this).find(".card-title").text();
		var videoUrl = $(this).data("video-url");
		var embedUrl = videoUrl.replace("watch?v=", "embed/");

		$("#videoModalLabel").text(videoTitle);
		$("#videoModal .modal-body").html(`
            <div class="ratio ratio-16x9">
                <iframe src="${embedUrl}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            </div>
        `);

		$("#videoModal").modal("show");
	});

	$("#videoModal").on("hidden.bs.modal", function () {
		$("#videoModal .modal-body").html("");
	});
});

function displayVideos() {
	$.ajax({
		url: "../phpscripts/std/fetch-videos.php",
		method: "GET",
		dataType: "json",
		success: function (response) {
			if (response.status === "success") {
				var videos = response.videos;
				var videosHtml = "";

				videos.forEach(function (video) {
					videosHtml += `
                    <div class="card video-card" data-video-url="${video.video_url}">
                        <img src="../assets/images/${video.video_img}" class="card-img-top" alt="${video.video_title}">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${video.video_title}</h5>
                        </div>
                    </div>`;
				});

				$("#containerVideos").html(videosHtml);

				// Apply fade-in animation
				$(".video-card")
					.hide()
					.each(function (index) {
						$(this)
							.delay(index * 200)
							.fadeIn(400);
					});
			} else {
				$("#containerVideos").html(
					"<li class='mt-3 text-danger fw-semibold'>No videos found.</li>"
				);
			}
		},
		error: function (error) {
			console.error(error);
		},
	});
}
