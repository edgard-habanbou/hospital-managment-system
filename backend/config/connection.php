<?php
header("Access-Control-Allow-Origin: *");
require_once  '../../vendor/autoload.php';

$host = "localhost";
$db_user = "root";
$db_password = null;
$db_name = "hospitalms";
$con = new mysqli($host, $db_user, $db_password, $db_name);

if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}

use Firebase\JWT\JWT;

$tokenPayload = [
    "user_id" => 1,
    "role_id" => 2,
    "fname" => "fname",
    "lname" => "lname",

    "exp" => time() + (60 * 60 * 8),
];
include_once('../globals.php');
$secretKey = bin2hex(random_bytes(32));

$jwt = JWT::encode($tokenPayload, $secretKey, 'HS256');


try {
    $decoded = JWT::decode($jwt, $secretKey, array('HS256'));
    // Access user information from $decoded
    print_r($decoded);
} catch (Exception $e) {
    // Handle invalid or expired token
    echo $e;
}
