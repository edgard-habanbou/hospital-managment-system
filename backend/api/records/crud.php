<?php
include_once('../jwt_auth/auth.php');
include('../../config/connection.php');

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



if ($data['action'] == "create") {
    $patient_id  = $data["data"]["patient_id"];
    $doctor_id = $data["data"]["doctor_id"];
    $diagnosis = $data["data"]["diagnosis"];
    $treatment = $data["data"]["treatment"];
    $record_date = date("Y-m-d");

    $query = $con->prepare('INSERT INTO tbl_records (patient_id, doctor_id, diagnosis, treatment, record_date) VALUES (?, ?, ?, ?, ?)');
    $query->bind_param('iisss', $patient_id, $doctor_id, $diagnosis, $treatment, $record_date);
    $query->execute();

    if ($query->error) {
        $response['status'] = false;
        $response['message'] = 'Error Adding Record: ' . $query->error;
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        $response['status'] = true;
        $response['message'] = 'Record added successfully';
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
if ($data['action'] == 'getRecordsbyPatientID') {
    $patient_id = $data["patient_id"];
    $query = $con->prepare("SELECT rec.diagnosis,rec.treatment,rec.record_date, user.fname user_fname, user.lname  user_lname, pat.fname patient_fname, pat.lname patient_lname FROM tbl_records rec JOIN tbl_users user ON rec.doctor_id = user.user_id JOIN tbl_patient pat ON rec.patient_id = pat.patient_id WHERE rec.patient_id = ?");
    $query->bind_param("i", $patient_id);
    $query->execute();
    $result = $query->get_result();
    $records = [];
    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }
    if ($query->error) {
        $response["status"] = false;
        $response["message"] = "Error: " . $query->error;
        header("Content-Type: application/json");
        echo json_encode($response);
    } else {
        $response["status"] = true;
        $response["message"] = "Records Fetched";
        $response["records"] = $records;
        header("Content-Type: application/json");
        echo json_encode($response);
    }
}
