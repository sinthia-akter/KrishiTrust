<?php
require 'config.php';
require_login(['udc', 'admin']);

$name     = trim($_POST['full_name'] ?? '');
$nid      = trim($_POST['nid'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$district = trim($_POST['district'] ?? '');
$land     = (float)($_POST['land_bigha'] ?? 0);
$crop     = trim($_POST['primary_crop'] ?? '');
$union    = trim($_POST['union_name'] ?? '');

if ($name === '' || $district === '') {
    out(['error' => 'Name and district are required'], 400);
}
if (!preg_match('/^\d{10}$|^\d{13}$|^\d{17}$/', $nid)) {
    out(['error' => 'NID must be 10, 13 or 17 digits'], 400);
}
if (!preg_match('/^01\d{9}$/', $phone)) {
    out(['error' => 'Mobile number must look like 01XXXXXXXXX'], 400);
}
if ($land < 0) {
    out(['error' => 'Land area cannot be negative'], 400);
}

$c1 = $pdo->prepare("SELECT id FROM farmers WHERE nid = ?");
$c1->execute([$nid]);
if ($c1->fetch()) {
    out(['error' => 'A farmer with this NID is already registered'], 409);
}

$c2 = $pdo->prepare("SELECT id FROM users WHERE phone = ?");
$c2->execute([$phone]);
if ($c2->fetch()) {
    out(['error' => 'This mobile number is already registered'], 409);
}

$temp = (string)random_int(100000, 999999);   

try {
    $pdo->beginTransaction();

    
    $pdo->prepare(
        "INSERT INTO users (name, phone, password, role, status, must_change_password)
         VALUES (?, ?, ?, 'farmer', 'active', 1)"
    )->execute([$name, $phone, password_hash($temp, PASSWORD_DEFAULT)]);
    $userId = (int)$pdo->lastInsertId();

   
    $pdo->prepare(
        "INSERT INTO farmers (full_name, nid, phone, district, land_bigha, primary_crop,
                              union_name, status, registered_by, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'verified', ?, ?)"
    )->execute([$name, $nid, $phone, $district, $land, $crop, $union,
                $_SESSION['user']['id'], $userId]);

    $id   = (int)$pdo->lastInsertId();
    $code = 'KT-FRM-' . str_pad($id, 5, '0', STR_PAD_LEFT);
    $pdo->prepare("UPDATE farmers SET farmer_code = ? WHERE id = ?")->execute([$code, $id]);

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    out(['error' => 'Could not register the farmer. Try again.'], 500);
}

out(['ok' => true, 'farmer_code' => $code, 'temp_password' => $temp]);