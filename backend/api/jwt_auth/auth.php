<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
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
$secret_Key = 'Q2FuJ3Qgd2FpdCB0byBmaW5pc2ggdGhpcyBwcm9ncmFtLg==';
try {
    $decoded = JWT::decode($jwt, new key($secret_Key, 'HS512'));
    if (isset($decoded->exp) && $decoded->exp < time()) {
        http_response_code(401);
        echo json_encode(array("message" => "Unauthorized Access"));
        exit;
    }
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(array("message" => "Unauthorized Access"));
    exit;
}
// make a function 