$(document).ready(function () {
	$(document).on("click", "[data-bs-dismiss='modal']", function () {
		$("#reusableModal").modal("hide");
	});

	$("#reusableModal").on("hidden.bs.modal", function () {
		$(this).find(".modal-body").html("");
		$(this)
			.find(".modal-dialog")
			.removeClass("modal-xl modal-lg")
			.addClass("modal-md");
		$(this).find(".modal-title").text("");
	});
});
