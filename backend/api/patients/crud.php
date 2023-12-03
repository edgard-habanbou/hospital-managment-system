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
    if (strtolower($gender_name) == 'male') {
        $gender_id = 1;
    } else {
        $gender_id = 2;
    }
    $phone_number = $data['data']['phone_number'];
    $query = $con->prepare('INSERT INTO tbl_patient (fname, lname, dob, gender_id, phone_number) VALUES (?, ?, ?, ?, ?)');
    $query->bind_param('sssii', $fname, $lname, $dob, $gender_id, $phone_number);
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
    if ($gender_name == 'Male') {
        $gender_id = 1;
    } else {
        $gender_id = 2;
    }
    $phone_number = $data['data']['phone_number'];
    $patient_id = $data['data']['patient_id'];
    $query = $con->prepare('UPDATE tbl_patient SET  fname = ?, lname = ?, dob = ?, gender_id = ?, phone_number = ? WHERE patient_id = ?');
    $query->bind_param('sssiii', $fname, $lname, $dob, $gender_id, $phone_number, $patient_id);
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
    $query = $con->prepare('SELECT pat.patient_id, pat.gender_id, pat.fname, pat.lname, pat.dob, pat.phone_number, gender.gender_name FROM `tbl_patient` pat JOIN `tbl_gender` gender ON pat.`gender_id` = gender.`gender_id`');
    $query->execute();
    $result = $query->get_result();
    $patients = [];
    while ($row = $result->fetch_assoc()) {
        array_push($patients, $row);
    }
    $response['status'] = true;
    $response['message'] = 'Patients fetched successfully';
    $response['header_data'] = ["First Name", "Last Name", "Date Of Birth", "Phone Number", "Gender"];
    $response['patients'] = $patients;
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
