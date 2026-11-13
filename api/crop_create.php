<?php
require 'config.php';
require_login(['farmer']);

$f = $pdo->prepare("SELECT id, status FROM farmers WHERE user_id = ?");
$f->execute([$_SESSION['user']['id']]);
$farmer = $f->fetch();
if (!$farmer || $farmer['status'] !== 'verified') {
    out(['error' => 'Your account must be verified before you can sell crops'], 403);
}

$allowedCrops = ['Aman Rice','Boro Rice','Wheat','Potato','Jute','Mustard','Lentils'];
$crop = $_POST['crop'] ?? '';
if (!in_array($crop, $allowedCrops, true)) {
    out(['error' => 'Choose a valid crop'], 400);
}


if (!preg_match('/^\s*(\d[\d,]*(?:\.\d+)?)\s*(.*)$/u', $_POST['quantity'] ?? '', $m)) {
    out(['error' => 'Quantity must start with a number, e.g. 120 Bags'], 400);
}
$qty  = (float)str_replace(',', '', $m[1]);
$unit = mb_substr(trim($m[2]) ?: 'Bags', 0, 20);


$price = (float)preg_replace('/[^\d.]/', '', $_POST['price'] ?? '');

if ($qty <= 0)   out(['error' => 'Quantity must be more than zero'], 400);
if ($price <= 0) out(['error' => 'Enter a valid price'], 400);

$grade = trim(explode('–', $_POST['quality'] ?? '')[0]);  
if (!in_array($grade, ['Grade A','Grade B','Grade C'], true)) {
    out(['error' => 'Choose a valid quality grade'], 400);
}

$date = trim($_POST['harvest_date'] ?? '');
if ($date !== '' && !DateTime::createFromFormat('Y-m-d', $date)) {
    out(['error' => 'Invalid harvest date'], 400);
}

$pdo->prepare(
    "INSERT INTO crops (farmer_id, crop_name, quantity, unit, price, quality, harvest_date, location, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
)->execute([
    $farmer['id'], $crop, $qty, $unit, $price, $grade,
    $date === '' ? null : $date,
    mb_substr(trim($_POST['location'] ?? ''), 0, 100),
    trim($_POST['notes'] ?? ''),
]);

$id = (int)$pdo->lastInsertId();
out(['ok' => true, 'listing_code' => 'KT-CRP-' . str_pad($id, 5, '0', STR_PAD_LEFT)]);