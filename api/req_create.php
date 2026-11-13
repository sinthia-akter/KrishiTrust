<?php
require 'config.php';
require_login(['buyer']);

$uid = $_SESSION['user']['id'];

$crops   = ['Aman Rice','Boro Rice','Wheat','Potato','Jute','Mustard','Lentils'];
$regions = ['Any District','Sylhet','Dhaka','Rangpur','Rajshahi','Mymensingh'];

$crop = $_POST['crop'] ?? '';
if (!in_array($crop, $crops, true)) out(['error' => 'Choose a valid crop'], 400);


if (!preg_match('/^\s*(\d[\d,]*(?:\.\d+)?)\s*(.*)$/u', $_POST['quantity'] ?? '', $m)) {
    out(['error' => 'Quantity must start with a number, e.g. 500 Bags'], 400);
}
$qty  = (float)str_replace(',', '', $m[1]);
$unit = mb_substr(trim($m[2]) ?: 'Bags', 0, 20);
if ($qty <= 0) out(['error' => 'Quantity must be more than zero'], 400);

$budget = (float)preg_replace('/[^\d.]/', '', $_POST['budget'] ?? '');
if ($budget <= 0) out(['error' => 'Enter a valid budget'], 400);

$deadline = trim($_POST['deadline'] ?? '');
$d = DateTime::createFromFormat('Y-m-d', $deadline);
if (!$d || $d->format('Y-m-d') !== $deadline) out(['error' => 'Choose a delivery deadline'], 400);
if ($deadline < date('Y-m-d')) out(['error' => 'The deadline cannot be in the past'], 400);

$grade = trim(explode('–', $_POST['quality'] ?? '')[0]);
if (!in_array($grade, ['Grade A','Grade B','Grade C'], true)) out(['error' => 'Choose a valid quality grade'], 400);

$region = $_POST['region'] ?? '';
if (!in_array($region, $regions, true)) out(['error' => 'Choose a valid region'], 400);

$open = $pdo->prepare("SELECT COUNT(*) FROM requirements WHERE buyer_id = ? AND status = 'open' AND deadline >= CURDATE()");
$open->execute([$uid]);
if ((int)$open->fetchColumn() >= 20) out(['error' => 'You already have 20 open requirements. Close some first'], 409);

$pdo->prepare(
    "INSERT INTO requirements (buyer_id, crop_name, quantity, unit, budget, deadline, quality, region, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
)->execute([$uid, $crop, $qty, $unit, $budget, $deadline, $grade, $region, mb_substr(trim($_POST['notes'] ?? ''), 0, 1000)]);

$id   = (int)$pdo->lastInsertId();
$code = 'KT-REQ-' . date('Y') . '-' . str_pad($id, 4, '0', STR_PAD_LEFT);
$pdo->prepare("UPDATE requirements SET req_code = ? WHERE id = ?")->execute([$code, $id]);

out(['ok' => true, 'req_code' => $code]);