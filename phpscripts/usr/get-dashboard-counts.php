<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Query to get total students
    $studentsQuery = "SELECT COUNT(*) AS totalStudents FROM user_data";
    $studentsResult = mysqli_query($con, $studentsQuery);

    // Query to get total quizzes
    $quizzesQuery = "SELECT COUNT(*) AS totalQuizzes FROM quiz"; // Assuming quizzes table exists
    $quizzesResult = mysqli_query($con, $quizzesQuery);

    // Query to get total activities
    $activitiesQuery = "SELECT COUNT(*) AS totalActivities FROM activities"; // Assuming activities table exists
    $activitiesResult = mysqli_query($con, $activitiesQuery);

    // Query to get count of students who have taken activities per lesson
    $activitiesTakenQuery = "
        SELECT rl.lesson_title, COUNT(DISTINCT aa.user_id) AS studentsTakenActivity
        FROM readings_lessons rl
        LEFT JOIN activities a ON rl.reading_id = a.reading_id
        LEFT JOIN activity_attempts aa ON a.activity_id = aa.activity_id
        GROUP BY rl.reading_id";
    $activitiesTakenResult = mysqli_query($con, $activitiesTakenQuery);

    // Query to get quiz performance (Passed, Failed, Pending, Not Attempted)
    $quizPerformanceQuery = "SELECT 
                                SUM(CASE WHEN score_percentage >= 50 THEN 1 ELSE 0 END) AS passed,
                                SUM(CASE WHEN score_percentage < 50 THEN 1 ELSE 0 END) AS failed,
                                SUM(CASE WHEN score_percentage IS NULL THEN 1 ELSE 0 END) AS pending
                             FROM user_scores WHERE task_type = 'quiz'";
    $quizPerformanceResult = mysqli_query($con, $quizPerformanceQuery);

    if ($studentsResult && $quizzesResult && $activitiesResult && $activitiesTakenResult && $quizPerformanceResult) {
        // Fetch results
        $totalStudents = mysqli_fetch_assoc($studentsResult)['totalStudents'];
        $totalQuizzes = mysqli_fetch_assoc($quizzesResult)['totalQuizzes'];
        $totalActivities = mysqli_fetch_assoc($activitiesResult)['totalActivities'];

        // Get activities completed per lesson (count of students who took the activity)
        $activitiesCompletedPerLesson = [];
        while ($row = mysqli_fetch_assoc($activitiesTakenResult)) {
            $activitiesCompletedPerLesson[$row['lesson_title']] = $row['studentsTakenActivity'];
        }

        $quizPerformance = mysqli_fetch_assoc($quizPerformanceResult);

        // Prepare success response
        $data['status'] = "success";
        $data['totalStudents'] = $totalStudents;
        $data['totalQuizzes'] = $totalQuizzes;
        $data['totalActivities'] = $totalActivities;
        $data['activitiesCompletedPerLesson'] = $activitiesCompletedPerLesson;
        $data['quizPerformance'] = [
            'Passed' => $quizPerformance['passed'],
            'Failed' => $quizPerformance['failed'],
            'Pending' => $quizPerformance['pending'],
            'Not Attempted' => $totalQuizzes - $quizPerformance['passed'] - $quizPerformance['failed'] - $quizPerformance['pending'],
        ];
    } else {
        $data['status'] = "error";
        $data['message'] = "Error executing database queries.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method. Use GET.";
}

echo json_encode($data);
?>