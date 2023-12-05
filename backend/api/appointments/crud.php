<?php

include_once('../jwt_auth/auth.php');
include('../../config/connection.php');
require_once('../../../vendor/autoload.php');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$jwt = null;
$headers = apache_request_headers();
if (isset($headers['Authorization'])) {
    $matches = [];
    if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
        $jwt = $matches[1];
    }
}
$decoded = JWT::decode($jwt, new key($secret_Key, 'HS512'));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response = [];
    $response['status'] = false;
    $response['message'] = 'Invalid Request';
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

if ($data["action"] == "create") {
    if ($decoded->role_id != 2) {
        http_response_code(401);
        echo json_encode(array("message" => "Unauthorized Access"));
        exit;
    }

    $patient_id = $data['data']['patient_id'];
    $user_id = $data['data']['user_id'];
    $start_date = $data['data']['start_date'];
    $end_date = $data['data']['end_date'];

    $query = $con->prepare('INSERT INTO tbl_appointments (patient_id, user_id, start_date, end_date) VALUES (?, ?, ?, ?)');
    $query->bind_param('iiss', $patient_id, $user_id, $start_date, $end_date);
    $query->execute();

    $response = [];
    if ($query->error) {
        $response['status'] = false;
        $response['message'] = 'Error updating user: ' . $query->error;
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        $response['status'] = true;
        $response['message'] = 'Appointment created successfully';
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
if ($data['action'] == "getAllAppointments") {
    $query = $con->prepare('SELECT app.start_date, app.end_date, pat.fname patient_fname, pat.lname patient_lname, user.fname user_fname, user.lname user_lname FROM tbl_appointments app JOIN tbl_patient pat ON app.patient_id = pat.patient_id JOIN tbl_users user ON app.user_id = user.user_id');
    $query->execute();
    $result = $query->get_result();

    $response = [];
    $num_rows = $result->num_rows;
    if ($num_rows == 0) {
        $response['status']  = 'No Appointments Found';
        echo json_encode($response);
    } else {
        $response = [];
        while ($row = $result->fetch_assoc()) {
            $response[] = $row;
        }
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
