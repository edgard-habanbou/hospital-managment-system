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
function hashPasswordIfNeeded($password)
{
    if (substr($password, 0, 4) === '$2y$') {
        return $password;
    } else {
        // Password is not hashed, so hash it
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        return $hashedPassword;
    }
}
if ($data['action'] == "checkIfAdmin") {
    if ($decoded->role_id != 1) {
        http_response_code(401);
        echo json_encode(array("message" => "Unauthorized Access"));
        exit;
    }
    $response = [];
    $response['status'] = true;
    $response['message'] = 'User is admin';
    header('Content-Type: application/json');
    echo json_encode($response);
}
if ($data['action'] == "create") {
    if ($decoded->role_id != 1) {
        http_response_code(401);
        echo json_encode(array("message" => "Unauthorized Access"));
        exit;
    }
    $username = $data['data']['username'];
    $fname = $data['data']['fname'];
    $lname =  $data['data']['lname'];
    $role_id = $data['data']['role_id'];
    $role_name = $data['data']['role_name'];
    if (strtolower($role_name) == 'admin') {
        $role_id = 1;
    } else {
        $role_id = 2;
    }
    $user_email = $data['data']['user_email'];
    $gender_name = $data['data']['gender_name'];
    if ($gender_name == 'Male') {
        $gender_id = 1;
    } else {
        $gender_id = 2;
    }
    $user_password = $data['data']['user_password'];
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
if ($data['action'] == 'update') {
    if ($decoded->role_id != 1) {
        http_response_code(401);
        echo json_encode(array("message" => "Unauthorized Access"));
        exit;
    }
    $username = $data['data']['username'];
    $fname = $data['data']['fname'];
    $lname =  $data['data']['lname'];
    $role_name = $data['data']['role_name'];
    if (strtolower($role_name) == 'admin') {
        $role_id = 1;
    } else {
        $role_id = 2;
    }
    $user_email = $data['data']['user_email'];
    $gender_id = $data['data']['gender_id'];
    $gender_name = $data['data']['gender_name'];
    if ($gender_name == 'Male') {
        $gender_id = 1;
    } else {
        $gender_id = 2;
    }
    $user_id = $data['data']['user_id'];

    $query = $con->prepare('UPDATE tbl_users SET username = ?, fname = ?, lname = ?, role_id = ?, user_email = ?,  gender_id = ? WHERE user_id = ?');
    $query->bind_param('sssisii', $username, $fname, $lname, $role_id, $user_email,  $gender_id, $user_id);

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
if ($data['action'] == 'delete') {
    if ($decoded->role_id != 1) {
        http_response_code(401);
        echo json_encode(array("message" => "Unauthorized Access"));
        exit;
    }
    $user_id = $data['user_id'];
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
if ($data['action'] == 'getAllUsers') {

    $query = $con->prepare('SELECT user.`user_id`, role.`role_id`, gender.`gender_id`, user.`username`, user.`fname`, user.`lname`, user.`user_email`, role.`role_name`, gender.`gender_name` FROM tbl_users user JOIN tbl_roles role ON user.`role_id` = role.`role_id` JOIN tbl_gender gender ON user.`gender_id` = gender.`gender_id`;');
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
        $response['header_data'] = ["Password", "Username", "First Name", "Last Name", "Email", "Role", "Gender"];
        $response['users'] = $users;
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
if ($data['action'] == 'getUserById') {
    $user_id = $data['user_id'];
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
        $response['header_data'] = ["Username", "First Name", "Last Name", "Email", "Role", "Gender"];
        $response['user'] = $user;
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
