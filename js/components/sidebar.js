$(document).ready(function () {
	let $sidebar = $(".sidebar");
	let $closeBtn = $("#btn");
	let $logoImg = $(".logo-image");

	$closeBtn.on("click", function () {
		$sidebar.toggleClass("open");
		menuBtnChange();
	});

	function menuBtnChange() {
		if ($sidebar.hasClass("open")) {
			$closeBtn.removeClass("fa-bars").addClass("fa-align-right");
			$logoImg.removeClass("d-none");
			$(".sidebar .logo-details").css("height", "85px");
			$(".sidebar .nav-list").css("height", "calc(100% - 240px)");
		} else {
			$closeBtn.removeClass("fa-align-right").addClass("fa-bars");
			$logoImg.addClass("d-none");
			$(".sidebar .logo-details").css("height", "60px");
			$(".sidebar .nav-list").css("height", "calc(100% - 215px)");
		}
	}

	var currentUrl = window.location.href;

	$(".sidebar .nav-list li a").each(function () {
		var href = $(this).attr("href");

		if (
			currentUrl.indexOf(href) > -1 ||
			(currentUrl.indexOf("quiz") > -1 && href.indexOf("readings") > -1) ||
			(currentUrl.indexOf("activity") > -1 &&
				href.indexOf("readings") > -1) ||
			(currentUrl.indexOf("reading") > -1 &&
				href.indexOf("readings") > -1) ||
			(currentUrl.indexOf("readings") > -1 && href.indexOf("reading") > -1)
		) {
			$(this).parent().addClass("active");
		}
	});

	$(".sidebar .nav-list li a").click(function () {
		$(".sidebar .nav-list li").removeClass("active");
		$(this).parent().addClass("active");
	});

	$(document).on("click", ".logout-account", function (event) {
		event.preventDefault();

		$(".modal-title").text("Logout");
		$("#reusableModal .modal-body").html(`
			<p class="mb-0">Are you sure you want to log out?</p>
			<div class="d-flex align-items-center justify-content-end gap-2 mt-3">
				<button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal">No</button>
				<button type="button" class="btn btn-primary btn-sm confirm-exit">Yes</button>
			</div>
		`);
		$("#reusableModal").modal("show");
	});

	$(document).on("click", ".confirm-exit", function () {
		window.location.href = `../phpscripts/logout`;
	});
});
