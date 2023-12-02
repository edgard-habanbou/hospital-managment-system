<?php


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
include('../../config/connection.php');
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

$user_email = $data['user_email'];
$user_password = $data['user_password'];

$query = $con->prepare('SELECT user_id , fname, lname, user_password, role_id  FROM tbl_users WHERE user_email = ?');
$query->bind_param('s', $user_email);
$query->execute();
$query->store_result();
$num_rows = $query->num_rows;
$query->bind_result($user_id, $fname, $lname, $hashed_password, $role_id);
$query->fetch();

$response = [];
if ($num_rows == 0) {
    $response['status']  = 'User Not Found';
    echo json_encode($response);
} else {

    if (password_verify($user_password, $hashed_password)) {
        session_start();
        $_SESSION['user_id'] = $user_id;
        $_SESSION['fname'] = $fname;
        $_SESSION['lname'] = $lname;
        $_SESSION['role_id'] = $role_id;


        $response['status']  = 'Login Success';
        $response['role_id'] = $role_id;
        $response['fname'] = $fname;
        $response['lname'] = $lname;
        $response['user_id'] = $user_id;

        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        $response['status']  = 'Wrong Credentials';
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
