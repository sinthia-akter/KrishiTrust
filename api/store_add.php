<?php
require 'config.php';
require_login(['admin', 'government', 'store']);

$role = $_SESSION['user']['role'];
$uid  = $_SESSION['user']['id'];

$districts = ['Sylhet','Dhaka','Chattogram','Rangpur','Mymensingh','Rajshahi','Comilla'];
$types     = ['Agricultural Inputs','Seeds & Fertilizers','Seeds & Pesticides','Fertilizer & Seeds','Farm Equipment'];

$name     = trim($_POST['name'] ?? '');
$district = $_POST['district'] ?? '';
$area     = trim($_POST['area'] ?? '');
$type     = $_POST['products'] ?? '';

if ($name === '' || mb_strlen($name) > 120)        out(['error' => 'Store name is required (up to 120 characters)'], 400);
if (!in_array($district, $districts, true))        out(['error' => 'Choose a valid district'], 400);
if (!in_array($type, $types, true))                out(['error' => 'Choose a valid store type'], 400);
if (mb_strlen($area) > 100)                        out(['error' => 'Area is too long'], 400);

$d = $pdo->prepare("SELECT id FROM stores WHERE name = ? AND district = ?");
$d->execute([$name, $district]);
if ($d->fetch()) out(['error' => 'A store with this name already exists in this district'], 409);

$status = 'verified';
$owner  = null;
if ($role === 'store') {
    $c = $pdo->prepare("SELECT COUNT(*) FROM stores WHERE owner_id = ?");
    $c->execute([$uid]);
    if ((int)$c->fetchColumn() >= 5) out(['error' => 'You can register up to 5 stores'], 409);
    $status = 'pending';
    $owner  = $uid;
}

$pdo->prepare(
    "INSERT INTO stores (name, district, area, products, status, owner_id) VALUES (?, ?, ?, ?, ?, ?)"
)->execute([$name, $district, $area === '' ? null : $area, $type, $status, $owner]);

out(['ok' => true, 'status' => $status]);