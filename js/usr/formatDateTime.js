function formatDate(dateString) {
	var date = new Date(dateString);
	return date.toLocaleString("en-US", {
		weekday: "short", // "Mon"
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
		month: "long", // "January"
		day: "2-digit",
		year: "numeric", // "2024"
	});
}
