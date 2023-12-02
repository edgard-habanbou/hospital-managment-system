<?php


session_reset();
session_destroy();
$response['status']  = 'Logout Success';
header('Content-Type: application/json');
echo json_encode($response);
