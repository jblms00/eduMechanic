<?php
session_start();
include("../database-connection.php");

function getPassingStatus($activityScore, $passingPercentage, $totalItems)
{
    $pointsPerItem = 2;
    $maxPoints = $totalItems * $pointsPerItem;
    $requiredScore = ($passingPercentage / 100) * $maxPoints;
    return $activityScore >= $requiredScore ? 'Passed' : 'Failed';
}

function getActivityStatus($userId, $con)
{
    $activityQuery = "SELECT a.*, 
                      COUNT(ai.item_id) AS total_items
                      FROM activities a
                      LEFT JOIN activity_items ai ON a.activity_id = ai.activity_id
                      GROUP BY a.activity_id
    ";
    $activityResult = mysqli_query($con, $activityQuery);
    $activities = [];

    if ($activityResult && mysqli_num_rows($activityResult) > 0) {
        // Loop through the activities
        while ($activityRow = mysqli_fetch_assoc($activityResult)) {
            $activityId = $activityRow['activity_id'];

            $attemptQuery = "SELECT * FROM activity_attempts WHERE user_id = '$userId' AND activity_id = '$activityId'";
            $attemptResult = mysqli_query($con, $attemptQuery);

            // If user has attempted, set status to "Completed", otherwise "Incomplete"
            $status = (mysqli_num_rows($attemptResult) > 0) ? 'Completed' : 'Incomplete';
            $datetimeAttempted = null;
            $score = null;
            $passingStatus = 'Not Attempted';

            // If the user has attempted, get the datetime_attempted
            if ($status === 'Completed') {
                $attemptRow = mysqli_fetch_assoc($attemptResult);
                $datetimeAttempted = $attemptRow['datetime_attempted'];

                // Format the datetime_attempted to "Jan 23, 2024"
                if ($datetimeAttempted) {
                    $datetimeAttempted = date('M j, Y', strtotime($datetimeAttempted));
                }

                $scoreQuery = "SELECT score FROM user_scores WHERE user_id = '$userId' AND task_id = '$activityId' AND task_type = 'activity'";
                $scoreResult = mysqli_query($con, $scoreQuery);
                if ($scoreResult && mysqli_num_rows($scoreResult) > 0) {
                    $scoreRow = mysqli_fetch_assoc($scoreResult);
                    $score = $scoreRow['score'];

                    $passingStatus = getPassingStatus($score, $activityRow['passing_percentage'], $activityRow['total_items']);
                }
            }

            // Store the activity info with status, formatted datetime_attempted, and lesson title
            $activities[] = [
                'activity_title' => $activityRow['activity_title'],
                'activity_number' => $activityRow['activity_number'],
                'activity_passing_score' => $activityRow['passing_percentage'],
                'due_date' => date('M j, Y', strtotime($activityRow['activity_due_date'])),
                'status' => $status,
                'datetime_attempted' => $datetimeAttempted,
                'score' => $score * 10,
                'total_points' => $activityRow['total_items'] * 20,
                'passing_status' => $passingStatus,
            ];
        }

        return $activities;
    } else {
        return null;
    }
}

// Function to get quiz status for a user
function getQuizStatus($userId, $con)
{
    // Query to get quizzes
    $quizQuery = "SELECT * FROM quiz";

    $quizQuery = "SELECT q.*, 
                  COUNT(qq.questionnaire_id) AS total_items
                  FROM quiz q
                  LEFT JOIN quiz_questionnaire qq ON q.quiz_id = qq.quiz_id
                  GROUP BY q.quiz_id
    ";

    $quizResult = mysqli_query($con, $quizQuery);

    $quizzes = [];

    if ($quizResult && mysqli_num_rows($quizResult) > 0) {
        // Loop through the quizzes
        while ($quizRow = mysqli_fetch_assoc($quizResult)) {
            $quizId = $quizRow['quiz_id'];

            // Query to check if the user has attempted this quiz
            $attemptQuery = "SELECT * FROM quiz_attempts WHERE user_id = '$userId' AND quiz_id = '$quizId'";
            $attemptResult = mysqli_query($con, $attemptQuery);

            // If user has attempted, set status to "Completed", otherwise "Incomplete"
            $status = (mysqli_num_rows($attemptResult) > 0) ? 'Completed' : 'Incomplete';
            $datetimeAttempted = null;
            $score = null;
            $passingStatus = 'Not Attempted';

            // If the user has attempted, get the datetime_attempted
            if ($status === 'Completed') {
                $attemptRow = mysqli_fetch_assoc($attemptResult);
                $datetimeAttempted = $attemptRow['datetime_attempted'];

                // Format the datetime_attempted to "Jan 23, 2024"
                if ($datetimeAttempted) {
                    $datetimeAttempted = date('M j, Y', strtotime($datetimeAttempted));
                }

                $scoreQuery = "SELECT score FROM user_scores WHERE user_id = '$userId' AND task_id = '$quizId' AND task_type = 'quiz'";
                $scoreResult = mysqli_query($con, $scoreQuery);
                if ($scoreResult && mysqli_num_rows($scoreResult) > 0) {
                    $scoreRow = mysqli_fetch_assoc($scoreResult);
                    $score = $scoreRow['score'];

                    $passingStatus = getPassingStatus($score, $quizRow['passing_percentage'], $quizRow['total_items']);
                }
            }

            // Store the quiz info with status
            $quizzes[] = [
                'quiz_title' => $quizRow['quiz_title'],
                'quiz_number' => $quizRow['quiz_number'],
                'quiz_passing_score' => $quizRow['passing_percentage'],
                'due_date' => date('M j, Y', strtotime($quizRow['quiz_due_date'])),
                'status' => $status,
                'datetime_attempted' => $datetimeAttempted,
                'score' => $score,
                'total_points' => $quizRow['total_items'] * 2,
                'passing_status' => $passingStatus,
            ];
        }

        return $quizzes;
    } else {
        return null;
    }
}

$data = [];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['user_id']) && !empty($_GET['user_id'])) {
        $userId = mysqli_real_escape_string($con, $_GET['user_id']);

        // Get activities for the user
        $activities = getActivityStatus($userId, $con);

        // Get quizzes for the user
        $quizzes = getQuizStatus($userId, $con);

        // Prepare the response
        $data['status'] = "success";
        $data['activities'] = $activities ? $activities : [];
        $data['quizzes'] = $quizzes ? $quizzes : [];
    } else {
        $data['status'] = "error";
        $data['message'] = "Missing or invalid user ID.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>