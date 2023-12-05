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

if ($data['action'] == "checkIfDoctor") {
    if ($decoded->role_id != 2) {
        http_response_code(401);
        echo json_encode(array("message" => "Unauthorized Access"));
        exit;
    }
    $response = [];
    $response['status'] = true;
    $response['message'] = 'User is Doctor';
    header('Content-Type: application/json');
    echo json_encode($response);
}
if ($data['action'] == "create") {
    if ($decoded->role_id != 1) {
        http_response_code(401);
        echo json_encode(array("message" => "Unauthorized Access"));
        exit;
    }
    $fname = $data['data']['fname'];
    $lname =  $data['data']['lname'];
    $dob = $data['data']['dob'];
    $gender_name = $data['data']['gender_name'];
    $patient_room = $data['data']['patient_room'];
    if (strtolower($gender_name) == 'male') {
        $gender_id = 1;
    } else {
        $gender_id = 2;
    }
    $phone_number = $data['data']['phone_number'];
    $query = $con->prepare('INSERT INTO tbl_patient (fname, lname, dob, gender_id, phone_number,patient_room ) VALUES (?, ?, ?, ?, ?, ?)');
    $query->bind_param('sssiii', $fname, $lname, $dob, $gender_id, $phone_number, $patient_room);
    $query->execute();
    if ($patient_room != 0) {
        $query_room = $con->prepare('UPDATE `tbl_rooms` SET `availability_status` = 0 WHERE `tbl_rooms`.`room_number` = ?;');
        $query_room->bind_param('i',  $patient_room);
        $query_room->execute();
    }

    $response = [];

    if ($query->error) {
        $response['status'] = false;
        $response['message'] = 'Error updating user: ' . $query->error;
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        $response['status'] = true;
        $response['message'] = 'Patient created successfully';
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
if ($data['action'] == 'update') {
    if ($decoded->role_id != 1) {
        http_response_code(401);
        echo json_encode(array("message" => "Unauthorized Access"));
        exit;
    }
    $fname = $data['data']['fname'];
    $lname =  $data['data']['lname'];
    $dob = $data['data']['dob'];
    $gender_id = $data['data']['gender_id'];
    $gender_name = $data['data']['gender_name'];
    echo  $patient_room = $data['data']['patient_room'];
    if ($gender_name == 'Male') {
        $gender_id = 1;
    } else {
        $gender_id = 2;
    }
    $phone_number = $data['data']['phone_number'];
    $patient_id = $data['data']['patient_id'];

    // Get room number
    $query = $con->prepare('SELECT patient_room  FROM tbl_patient WHERE patient_id = ?');
    $query->bind_param('i', $patient_id);
    $query->execute();
    $result = $query->get_result();
    $patient = $result->fetch_assoc();
    $patient_ex_room = $patient['patient_room'];

    // Update room availability
    if ($patient_ex_room != $patient_room) {
        $query_room = $con->prepare('UPDATE `tbl_rooms` SET `availability_status` = 1 WHERE `tbl_rooms`.`room_number` = ?;');
        $query_room->bind_param('i',  $patient_ex_room);
        $query_room->execute();
    }

    $query = $con->prepare('UPDATE tbl_patient SET  fname = ?, lname = ?, dob = ?, gender_id = ?, phone_number = ?, patient_room = ? WHERE patient_id = ?');
    $query->bind_param('sssiiis', $fname, $lname, $dob, $gender_id, $phone_number, $patient_room,  $patient_id);
    $query->execute();
    if ($patient_room != 0) {
        $query_room = $con->prepare('UPDATE `tbl_rooms` SET `availability_status` = 0 WHERE `tbl_rooms`.`room_number` = ?;');
        $query_room->bind_param('i',  $patient_room);
        $query_room->execute();
    }
    if ($query->error) {
        $response['status'] = false;
        $response['message'] = 'Error updating user: ' . $query->error;
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        $response['status'] = true;
        $response['message'] = 'Patient updated successfully';
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
if ($data['action'] == 'delete') {
    // Check if user is admin
    if ($decoded->role_id != 1) {
        http_response_code(401);
        echo json_encode(array("message" => "Unauthorized Access"));
        exit;
    }
    $patient_id = $data['patient_id'];
    $query = $con->prepare('DELETE FROM tbl_patient WHERE patient_id = ?');
    $query->bind_param('i', $patient_id);
    $query->execute();

    $response['status'] = true;
    $response['message'] = 'Patient deleted successfully';
    header('Content-Type: application/json');
    echo json_encode($response);
}
if ($data['action'] == 'getAllPatients') {
    $query = $con->prepare('SELECT pat.patient_id, pat.gender_id, pat.need_emergency, pat.in_emergency_room, pat.fname, pat.lname, pat.dob, pat.phone_number,pat.patient_room, gender.gender_name FROM `tbl_patient` pat JOIN `tbl_gender` gender ON pat.`gender_id` = gender.`gender_id`');
    $query_rooms = $con->prepare('SELECT * FROM tbl_rooms WHERE availability_status = 1');
    $query->execute();
    $result = $query->get_result();
    $query_rooms->execute();
    $result_rooms = $query_rooms->get_result();
    $patients = [];
    $rooms = [];
    while ($row = $result->fetch_assoc()) {
        $patients[] =  $row;
    }
    while ($row = $result_rooms->fetch_assoc()) {
        $rooms[] =  $row;
    }
    $response['status'] = true;
    $response['message'] = 'Patients fetched successfully';
    $response['header_data'] = ["First Name", "Last Name", "Date Of Birth", "Phone Number", "Room", "Gender"];
    $response['patients'] = $patients;
    $response['rooms'] = $rooms;
    header('Content-Type: application/json');
    echo json_encode($response);
}
if ($data['action'] == 'getPatientById') {
    $patient_id = $data['patient_id'];
    $query = $con->prepare('SELECT * FROM tbl_patient WHERE patient_id = ?');
    $query->bind_param('i', $patient_id);
    $query->execute();
    $result = $query->get_result();
    $patient = $result->fetch_assoc();
    $response['status'] = true;
    $response['message'] = 'Patient fetched successfully';
    header('Content-Type: application/json');
    echo json_encode($response);
}
if ($data['action'] == 'er_confirmation') {
    $patient_id = $data['patient_id'];
    if ($data['answer']) {

        // Ger room number
        $query = $con->prepare('SELECT patient_room  FROM tbl_patient WHERE patient_id = ?');
        $query->bind_param('i', $patient_id);
        $query->execute();
        $result = $query->get_result();
        $patient = $result->fetch_assoc();
        $room_number = $patient['patient_room'];

        // Update room availability
        $query = $con->prepare('update tbl_rooms set availability_status = 1 where room_number = ?');
        $query->bind_param('i', $room_number);
        $query->execute();

        // Update patient
        $query = $con->prepare('UPDATE tbl_patient SET need_emergency = 0, in_emergency_room = 1, patient_room = 0 WHERE patient_id = ?');
        $query->bind_param('i', $patient_id);
        $query->execute();
        $response['status'] = true;
        $response['message'] = 'Patient updated successfully';
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        $query = $con->prepare('UPDATE tbl_patient SET need_emergency = 0, in_emergency_room = 0 WHERE patient_id = ?');
        $query->bind_param('i', $patient_id);
        $query->execute();
        $response['status'] = true;
        $response['message'] = 'Patient updated successfully';
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
if ($data['action'] == 'need_er') {
    $patient_id = $data['patient_id'];
    $query = $con->prepare('UPDATE tbl_patient SET need_emergency = 1 WHERE patient_id = ?');
    $query->bind_param('i', $patient_id);
    $query->execute();
    $response['status'] = true;
    $response['message'] = 'Patient updated successfully';
    header('Content-Type: application/json');
    echo json_encode($response);
}
