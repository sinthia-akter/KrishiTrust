<?php
require 'config.php';
require_login(['farmer']);

$stmt = $pdo->prepare(
    "SELECT c.id, c.crop_name, c.quantity, c.unit, c.price, c.quality, c.location
     FROM crops c JOIN farmers f ON f.id = c.farmer_id
     WHERE f.user_id = ? AND c.status = 'live'
     ORDER BY c.id DESC LIMIT 20"
);
$stmt->execute([$_SESSION['user']['id']]);
out(['crops' => $stmt->fetchAll()]);