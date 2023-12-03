<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response = [];
    $response['status'] = false;
    $response['message'] = 'Invalid Request';
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
include('../../config/connection.php');
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);


if ($data['action'] == "create") {
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
    $fname = $data['data']['fname'];
    $lname =  $data['data']['lname'];
    $dob = $data['data']['dob'];
    $gender_id = $data['data']['gender_id'];
    $gender_name = $data['data']['gender_name'];
    $patient_room = $data['data']['patient_room'];
    if ($gender_name == 'Male') {
        $gender_id = 1;
    } else {
        $gender_id = 2;
    }
    $phone_number = $data['data']['phone_number'];
    $patient_id = $data['data']['patient_id'];
    $query = $con->prepare('UPDATE tbl_patient SET  fname = ?, lname = ?, dob = ?, gender_id = ?, phone_number = ?, patient_room = ? WHERE patient_id = ?');
    $query->bind_param('sssiiis', $fname, $lname, $dob, $gender_id, $phone_number, $patient_room,  $patient_id);
    $query->execute();
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
    $query = $con->prepare('SELECT pat.patient_id, pat.gender_id, pat.need_emergency, pat.fname, pat.lname, pat.dob, pat.phone_number,pat.patient_room, gender.gender_name FROM `tbl_patient` pat JOIN `tbl_gender` gender ON pat.`gender_id` = gender.`gender_id`');
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
        $query = $con->prepare('UPDATE tbl_patient SET need_emergency = 0, in_emergency_room = 1 WHERE patient_id = ?');
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
