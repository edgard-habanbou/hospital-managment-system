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
// if (isset($_SESSION) && $_SESSION['role_id'] == 1) {


if ($data['action'] == "create") {
    $username = $data['data']['username'];
    $fname = $data['data']['fname'];
    $lname =  $data['data']['lname'];
    $role_id = $data['data']['role_id'];
    $user_email = $data['data']['user_email'];
    $gender_id = $data['data']['gender_id'];
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
    $username = $data['data']['username'];
    $fname = $data['data']['fname'];
    $lname =  $data['data']['lname'];
    $role_id = $data['data']['role_id'];
    $user_email = $data['data']['user_email'];
    $gender_id = $data['data']['gender_id'];
    $gender_name = $data['data']['gender_name'];
    if ($gender_name == 'Male') {
        $gender_id = 1;
    } else {
        $gender_id = 2;
    }
    $user_password = $data['data']['user_password'];
    $user_id = $data['data']['user_id'];

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
if ($data['action'] == 'delete') {
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
    $query = $con->prepare('SELECT  user.`user_id`, role.`role_id`, gender.`gender_id`, user.`user_password`, user.`username`, user.`fname`, user.`lname`, user.`user_email`, role.`role_name`, gender.`gender_name` FROM tbl_users user JOIN tbl_roles role ON user.`role_id` = role.`role_id` JOIN tbl_gender gender ON user.`gender_id` = gender.`gender_id`;');
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
        $response['header_data'] = ["Username", "First Name", "Last Name", "Email", "Role", "Gender"];
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
// } else {
//     $response['status'] = false;
//     $response['message'] = 'You are not authorized to perform this action';
//     header('Content-Type: application/json');
//     echo json_encode($response);
// }
