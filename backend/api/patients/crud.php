<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response = [];
    $response['status'] = false;
    $response['message'] = 'Invalid Request';
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

header('Access-Control-Allow-Origin: *');
include('../../config/connection.php');

if (isset($_SESSION) && $_SESSION['role_id'] == 1) {

    if ($_POST['action'] == "create") {
        $fname = $_POST['fname'];
        $lname =  $_POST['lname'];
        $dob = $_POST['dob'];
        $gender_id = $_POST['gender_id'];
        $phone_number = $_POST['phone_number'];
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
    if ($_POST['action'] == 'update') {
        $fname = $_POST['fname'];
        $lname =  $_POST['lname'];
        $dob = $_POST['dob'];
        $gender_id = $_POST['gender_id'];
        $phone_number = $_POST['phone_number'];
        $patient_id = $_POST['patient_id'];
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
    if ($_POST['action'] == 'delete') {
        $patient_id = $_POST['patient_id'];
        $query = $con->prepare('DELETE FROM tbl_patient WHERE patient_id = ?');
        $query->bind_param('i', $patient_id);
        $query->execute();

        $response['status'] = true;
        $response['message'] = 'Patient deleted successfully';
        header('Content-Type: application/json');
        echo json_encode($response);
    }
    if ($_POST['action'] == 'getAllPatients') {
        $query = $con->prepare('SELECT * FROM tbl_patient');
        $query->execute();
        $result = $query->get_result();
        $patients = [];
        while ($row = $result->fetch_assoc()) {
            array_push($patients, $row);
        }
        $response['status'] = true;
        $response['message'] = 'Patients fetched successfully';
        $response['data'] = $patients;
        header('Content-Type: application/json');
        echo json_encode($response);
    }
    if ($_POST['action'] == 'getPatientById') {
        $patient_id = $_POST['patient_id'];
        $query = $con->prepare('SELECT * FROM tbl_patient WHERE patient_id = ?');
        $query->bind_param('i', $patient_id);
        $query->execute();
        $result = $query->get_result();
        $patient = $result->fetch_assoc();
        $response['status'] = true;
        $response['message'] = 'Patient fetched successfully';
        $response['data'] = $patient;
        header('Content-Type: application/json');
        echo json_encode($response);
    }
} else {
    $response['status'] = false;
    $response['message'] = 'You are not authorized to perform this action';
    header('Content-Type: application/json');
    echo json_encode($response);
}
