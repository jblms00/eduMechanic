function formatDateOnly(datetime) {
	const date = new Date(datetime);
	const dateOptions = { year: "numeric", month: "long", day: "numeric" };

	return date.toLocaleDateString("en-US", dateOptions);
}
