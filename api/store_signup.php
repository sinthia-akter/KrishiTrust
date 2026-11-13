<?php
require 'config.php';   // public: a new store owner has no account yet

$name     = trim($_POST['name'] ?? '');
$email    = strtolower(trim($_POST['email'] ?? ''));
$pass     = $_POST['password'] ?? '';
$district = $_POST['district'] ?? '';
$store    = trim($_POST['store_name'] ?? '');
$area     = trim($_POST['area'] ?? '');
$type     = $_POST['products'] ?? '';

$districts = ['Sylhet','Dhaka','Chattogram','Rangpur','Mymensingh','Rajshahi','Comilla'];
$types     = ['Agricultural Inputs','Seeds & Fertilizers','Seeds & Pesticides','Fertilizer & Seeds','Farm Equipment'];

if ($name === '' || mb_strlen($name) > 100)  out(['error' => 'Your name is required (up to 100 characters)'], 400);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 150) out(['error' => 'Enter a valid email address'], 400);
if (strlen($pass) < 12 || strlen($pass) > 72) out(['error' => 'Password must be 12 to 72 characters'], 400);
if (!in_array($district, $districts, true))  out(['error' => 'Choose a valid district'], 400);
if ($store === '' || mb_strlen($store) > 120) out(['error' => 'Store name is required (up to 120 characters)'], 400);
if (mb_strlen($area) > 100)                  out(['error' => 'Area is too long'], 400);
if (!in_array($type, $types, true))          out(['error' => 'Choose a valid store type'], 400);

$c = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$c->execute([$email]);
if ($c->fetch()) out(['error' => 'This email is already registered'], 409);

$d = $pdo->prepare("SELECT id FROM stores WHERE name = ? AND district = ?");
$d->execute([$store, $district]);
if ($d->fetch()) out(['error' => 'A store with this name already exists in this district'], 409);

try {
    $pdo->beginTransaction();

    $pdo->prepare(
        "INSERT INTO users (name, email, password, role, status)
         VALUES (?, ?, ?, 'store', 'active')"
    )->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT)]);
    $userId = (int)$pdo->lastInsertId();

    $pdo->prepare(
        "INSERT INTO stores (name, district, area, products, status, owner_id)
         VALUES (?, ?, ?, ?, 'pending', ?)"
    )->execute([$store, $district, $area === '' ? null : $area, $type, $userId]);

    $pdo->commit();
} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    if ($e->getCode() === '23000') out(['error' => 'This email is already registered'], 409);
    out(['error' => 'Could not create the account. Try again.'], 500);
}

out(['ok' => true]);