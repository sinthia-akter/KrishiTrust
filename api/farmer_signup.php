<?php
require 'config.php';

$name     = trim($_POST['full_name'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$pass     = $_POST['password'] ?? '';
$district = trim($_POST['district'] ?? '');
$land     = (float)($_POST['land_area'] ?? 0);
$crop     = trim($_POST['primary_crop'] ?? '');

if ($name === '' || $district === '') {
    out(['error' => 'Name and district are required'], 400);
}
if (!preg_match('/^01\d{9}$/', $phone)) {
    out(['error' => 'Mobile number must look like 01XXXXXXXXX'], 400);
}
if (strlen($pass) < 12 || strlen($pass) > 72) {
    out(['error' => 'Password must be 12 to 72 characters'], 400);
}
if ($land < 0) {
    out(['error' => 'Land area cannot be negative'], 400);
}

$c = $pdo->prepare("SELECT id FROM users WHERE phone = ?");
$c->execute([$phone]);
if ($c->fetch()) {
    out(['error' => 'This mobile number is already registered'], 409);
}

try {
    $pdo->beginTransaction();

    $pdo->prepare(
        "INSERT INTO users (name, phone, password, role, status)
         VALUES (?, ?, ?, 'farmer', 'active')"
    )->execute([$name, $phone, password_hash($pass, PASSWORD_DEFAULT)]);
    $userId = (int)$pdo->lastInsertId();


    $pdo->prepare(
        "INSERT INTO farmers (full_name, phone, district, land_bigha, primary_crop, status, user_id)
         VALUES (?, ?, ?, ?, ?, 'pending', ?)"
    )->execute([$name, $phone, $district, $land, $crop, $userId]);

    $id   = (int)$pdo->lastInsertId();
    $code = 'KT-FRM-' . str_pad($id, 5, '0', STR_PAD_LEFT);
    $pdo->prepare("UPDATE farmers SET farmer_code = ? WHERE id = ?")->execute([$code, $id]);

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    out(['error' => 'Could not create the account. Try again.'], 500);
}

out(['ok' => true, 'farmer_code' => $code]);