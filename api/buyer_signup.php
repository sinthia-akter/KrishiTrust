<?php
require 'config.php';

$company  = trim($_POST['company_name'] ?? '');
$contact  = trim($_POST['contact_name'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$email    = trim($_POST['email'] ?? '');
$pass     = $_POST['password'] ?? '';
$district = trim($_POST['district'] ?? '');
$type     = trim($_POST['business_type'] ?? '');

$types = ['Retail Buyer', 'Processing Company', 'Food Company', 'Exporter'];

if ($company === '' || $contact === '' || $district === '') {
    out(['error' => 'Company name, contact name and district are required'], 400);
}
if (!preg_match('/^01\d{9}$/', $phone)) {
    out(['error' => 'Mobile number must look like 01XXXXXXXXX'], 400);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    out(['error' => 'Email address is not valid'], 400);
}
if (!in_array($type, $types, true)) {
    out(['error' => 'Choose a valid business type'], 400);
}
if (strlen($pass) < 12 || strlen($pass) > 72) {
    out(['error' => 'Password must be 12 to 72 characters'], 400);
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
         VALUES (?, ?, ?, 'buyer', 'active')"
    )->execute([$contact, $phone, password_hash($pass, PASSWORD_DEFAULT)]);
    $userId = (int)$pdo->lastInsertId();

    $pdo->prepare(
        "INSERT INTO buyers (user_id, company_name, contact_name, phone, email, district, business_type)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    )->execute([$userId, $company, $contact, $phone, $email === '' ? null : $email, $district, $type]);

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    out(['error' => 'Could not create the account. Try again.'], 500);
}

out(['ok' => true]);