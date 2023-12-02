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
        $username = $_POST['username'];
        $fname = $_POST['fname'];
        $lname =  $_POST['lname'];
        $role_id = $_POST['role_id'];
        $user_email = $_POST['user_email'];
        $gender_id = $_POST['gender_id'];
        $user_password = $_POST['user_password'];
        $hashed_password = password_hash($user_password, PASSWORD_DEFAULT);
        $query = $con->prepare('INSERT INTO tbl_users (username, fname, lname, role_id, user_email, gender_id, user_password) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $query->bind_param('sssisis', $username, $fname, $lname, $role_id, $user_email, $gender_id, $hashed_password);
        $query->execute();

        $response = [];
        if ($query->error) {
            $response['status'] = false;
            $response['message'] = 'Error updating user: ' . $query->error;
            header('Content-Type: application/json');
            echo json_encode($response);
        } else {
            $response['status'] = true;
            $response['message'] = 'User Created successfully';
            header('Content-Type: application/json');
            echo json_encode($response);
        }
    }
    if ($_POST['action'] == 'update') {
        $username = $_POST['username'];
        $fname = $_POST['fname'];
        $lname =  $_POST['lname'];
        $role_id = $_POST['role_id'];
        $user_email = $_POST['user_email'];
        $gender_id = $_POST['gender_id'];
        $user_password = $_POST['user_password'];
        $user_id = $_POST['user_id'];

        $hashed_password = password_hash($user_password, PASSWORD_DEFAULT);
        $query = $con->prepare('UPDATE tbl_users SET username = ?, fname = ?, lname = ?, role_id = ?, user_email = ?,  gender_id = ?, user_password = ? WHERE user_id = ?');
        $query->bind_param('sssisisi', $username, $fname, $lname, $role_id, $user_email,  $gender_id, $hashed_password, $user_id);
        $query->execute();
        if ($query->error) {
            $response['status'] = false;
            $response['message'] = 'Error updating user: ' . $query->error;
            header('Content-Type: application/json');
            echo json_encode($response);
        } else {
            $response['status'] = true;
            $response['message'] = 'User updated successfully';
            header('Content-Type: application/json');
            echo json_encode($response);
        }
    }
    if ($_POST['action'] == 'delete') {
        $user_id = $_POST['user_id'];
        $query = $con->prepare('DELETE FROM tbl_users WHERE user_id = ?');
        $query->bind_param('i', $user_id);
        $query->execute();


        if ($query->error) {
            $response['status'] = false;
            $response['message'] = 'Error updating user: ' . $query->error;
            header('Content-Type: application/json');
            echo json_encode($response);
        } else {
            $response['status'] = true;
            $response['message'] = 'User deleted successfully';
            header('Content-Type: application/json');
            echo json_encode($response);
        }
    }
    if ($_GET['action'] == 'getAllUsers') {
        $query = $con->prepare('SELECT * FROM tbl_users');
        $query->execute();

        if ($query->error) {
            $response['status'] = false;
            $response['message'] = 'Error updating user: ' . $query->error;
            header('Content-Type: application/json');
            echo json_encode($response);
        } else {
            $result = $query->get_result();
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            $response['status'] = true;
            $response['message'] = 'Users fetched successfully';
            $response['users'] = $users;
            header('Content-Type: application/json');
            echo json_encode($response);
        }
    }
    if ($_GET['action'] == 'getUserById') {
        $user_id = $_GET['user_id'];
        $query = $con->prepare('SELECT * FROM tbl_users WHERE user_id = ?');
        $query->bind_param('i', $user_id);
        $query->execute();

        if ($query->error) {
            $response['status'] = false;
            $response['message'] = 'Error updating user: ' . $query->error;
            header('Content-Type: application/json');
            echo json_encode($response);
        } else {
            $result = $query->get_result();
            $user = $result->fetch_assoc();

            $response['status'] = true;
            $response['message'] = 'User fetched successfully';
            $response['user'] = $user;

            header('Content-Type: application/json');
            echo json_encode($response);
        }
    }
} else {
    $response['status'] = false;
    $response['message'] = 'You are not authorized to perform this action';
    header('Content-Type: application/json');
    echo json_encode($response);
}
