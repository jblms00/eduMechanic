function getPassingStatus(score, passingPercentage, totalItems) {
	pointsPerItem = 2;
	maxPoints = totalItems * pointsPerItem;
	requiredScore = (passingPercentage / 100) * maxPoints;
	return score >= requiredScore ? "Passed" : "Failed";
}
