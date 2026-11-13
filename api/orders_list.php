<?php
require 'config.php';
require_login(['buyer', 'farmer']);

$uid  = $_SESSION['user']['id'];
$role = $_SESSION['user']['role'];

if ($role === 'buyer') {
    $s = $pdo->prepare(
        "SELECT o.id, o.order_code, o.crop_name, o.quantity, o.unit, o.unit_price, o.total,
                o.status, o.expected_delivery, o.created_at,
                f.full_name AS other, f.district, f.phone AS other_phone
         FROM orders o JOIN farmers f ON f.id = o.farmer_id
         WHERE o.buyer_id = ? ORDER BY o.id DESC LIMIT 100"
    );
} else {
    $s = $pdo->prepare(
        "SELECT o.id, o.order_code, o.crop_name, o.quantity, o.unit, o.unit_price, o.total,
                o.status, o.expected_delivery, o.created_at,
                COALESCE(b.company_name, u.name) AS other, '' AS district, NULL AS other_phone
         FROM orders o
         JOIN farmers f ON f.id = o.farmer_id
         JOIN users u ON u.id = o.buyer_id
         LEFT JOIN buyers b ON b.user_id = o.buyer_id
         WHERE f.user_id = ? ORDER BY o.id DESC LIMIT 100"
    );
}
$s->execute([$uid]);
$orders = $s->fetchAll();

$st = ['active' => 0, 'transit' => 0, 'delivered' => 0, 'value' => 0];
foreach ($orders as $o) {
    if (in_array($o['status'], ['placed', 'confirmed', 'in_transit'])) $st['active']++;
    if ($o['status'] === 'in_transit') $st['transit']++;
    if ($o['status'] === 'delivered') { $st['delivered']++; $st['value'] += (float)$o['total']; }
}

out(['role' => $role, 'orders' => $orders, 'stats' => $st]);