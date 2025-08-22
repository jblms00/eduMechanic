<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch recent tasks (activities and quizzes)
    $taskSql = "
    SELECT us.score_id, us.user_id, us.task_type, us.datetime_added AS datetime_attempted,
           CASE
               WHEN us.task_type = 'activity' THEN a.activity_title
               WHEN us.task_type = 'quiz' THEN q.quiz_title
           END AS task_title,
           us.score,
           -- Get total items for activities
           COALESCE(ai.total_items, 0) AS total_items_activity,
           -- Get total items for quizzes
           COALESCE(qi.total_items_quiz, 0) AS total_items_quiz,
           ud.user_first_name, ud.user_last_name,
           -- Get passing percentage for activities and quizzes
           CASE
               WHEN us.task_type = 'activity' THEN a.passing_percentage
               WHEN us.task_type = 'quiz' THEN q.passing_percentage
           END AS passing_percentage
    FROM user_scores us
    LEFT JOIN activities a ON us.task_id = a.activity_id AND us.task_type = 'activity'
    LEFT JOIN quiz q ON us.task_id = q.quiz_id AND us.task_type = 'quiz'
    JOIN user_data ud ON us.user_id = ud.user_id
    LEFT JOIN (
        SELECT activity_id, COUNT(*) AS total_items
        FROM activity_items
        GROUP BY activity_id
    ) ai ON us.task_id = ai.activity_id AND us.task_type = 'activity'
    LEFT JOIN (
        SELECT quiz_id, COUNT(*) AS total_items_quiz
        FROM quiz_questionnaire
        GROUP BY quiz_id
    ) qi ON us.task_id = qi.quiz_id AND us.task_type = 'quiz'
    ORDER BY us.datetime_added DESC LIMIT 10";

    $taskResult = mysqli_query($con, $taskSql);

    if ($taskResult) {
        $recentTasks = [];
        while ($row = mysqli_fetch_assoc($taskResult)) {
            // Determine the correct total items based on task type
            $totalItems = 0;
            if ($row['task_type'] == 'quiz') {
                $totalItems = $row['total_items_quiz'];
            } elseif ($row['task_type'] == 'activity') {
                $totalItems = $row['total_items_activity'];
            }

            // Get passing percentage for the task
            $passingPercentage = $row['passing_percentage'] ? $row['passing_percentage'] : 75; // Default to 75% if not set

            // Get passing status based on score
            $passingStatus = getPassingStatus($row['score'], $passingPercentage, $totalItems);

            $recentTasks[] = [
                'student' => $row['user_first_name'] . ' ' . $row['user_last_name'],
                'task_type' => ucfirst($row['task_type']),
                'task_title' => $row['task_title'],
                'score' => $row['score'] . '/' . ($totalItems * 2), // Actual score/Total items
                'passing_percentage' => $passingPercentage . '%', // Display passing percentage
                'passing_status' => $passingStatus, // Include passing status
                'date' => $row['datetime_attempted']
            ];
        }
        $data['status'] = "success";
        $data['recentTasks'] = $recentTasks;

    } else {
        $data['status'] = "error";
        $data['message'] = "Database query error: " . mysqli_error($con);
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method. Use GET.";
}

echo json_encode($data);

// Function to determine passing status based on score and passing percentage
function getPassingStatus($activityScore, $passingPercentage, $totalItems)
{
    $pointsPerItem = 2; // Assuming each item is worth 2 points
    $maxPoints = $totalItems * $pointsPerItem;
    $requiredScore = ($passingPercentage / 100) * $maxPoints;

    return $activityScore >= $requiredScore ? 'Passed' : 'Failed';
}
?>