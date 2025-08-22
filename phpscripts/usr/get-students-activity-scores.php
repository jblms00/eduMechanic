<?php
session_start();
include("../database-connection.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['activityId']) && !empty(trim($_GET['activityId']))) {
        $activityId = mysqli_real_escape_string($con, trim($_GET['activityId']));

        $sql = "
            SELECT us.*, ud.user_first_name, ud.user_last_name, a.passing_percentage,
                (SELECT COUNT(*) FROM activity_items ai WHERE ai.activity_id = '$activityId') AS total_items,
                aa.activity_attempt_id, aa.datetime_attempted
            FROM user_scores us
            JOIN user_data ud ON us.user_id = ud.user_id
            JOIN activities a ON us.task_id = a.activity_id
            LEFT JOIN activity_attempts aa ON aa.user_id = us.user_id AND aa.activity_id = a.activity_id
            WHERE us.task_id = '$activityId' AND us.task_type = 'activity'
        ";
        $result = mysqli_query($con, $sql);

        if ($result) {
            if (mysqli_num_rows($result) > 0) {
                $scores = [];
                while ($row = mysqli_fetch_assoc($result)) {
                    $scores[] = $row;
                }
                $data['status'] = "success";
                $data['scores'] = $scores;
            } else {
                $data['status'] = "error";
                $data['message'] = "Currently, no students have taken the activity.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Database query error: " . mysqli_error($con);
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Missing or invalid activity ID.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method. Use GET.";
}

echo json_encode($data);
?>