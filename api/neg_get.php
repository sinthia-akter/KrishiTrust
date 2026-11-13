<?php
require 'config.php';
require_login(['buyer', 'farmer']);

$uid  = $_SESSION['user']['id'];
$role = $_SESSION['user']['role'];
$id   = (int)($_GET['id'] ?? 0);

if ($role === 'buyer') {
    $l = $pdo->prepare(
        "SELECT n.id, n.status, c.crop_name, f.full_name AS other, f.district
         FROM negotiations n
         JOIN crops c ON c.id = n.crop_id
         JOIN farmers f ON f.id = n.farmer_id
         WHERE n.buyer_id = ? ORDER BY n.id DESC LIMIT 20"
    );
    $l->execute([$uid]);
} else {
    $l = $pdo->prepare(
        "SELECT n.id, n.status, c.crop_name,
                COALESCE(b.company_name, u.name) AS other, '' AS district
         FROM negotiations n
         JOIN crops c ON c.id = n.crop_id
         JOIN farmers f ON f.id = n.farmer_id
         JOIN users u ON u.id = n.buyer_id
         LEFT JOIN buyers b ON b.user_id = n.buyer_id
         WHERE f.user_id = ? ORDER BY n.id DESC LIMIT 20"
    );
    $l->execute([$uid]);
}
$list = $l->fetchAll();

if (!$id && $list) $id = (int)$list[0]['id'];
if (!$id) out(['me' => $role, 'negotiation' => null, 'messages' => [], 'list' => $list]);

$s = $pdo->prepare(
    "SELECT n.id, n.status, n.current_offer, n.offered_by, n.buyer_id, n.crop_id,
            c.crop_name, c.quantity, c.unit, c.price AS listed_price,
            f.full_name AS farmer_name, f.district, f.phone AS farmer_phone, f.user_id AS farmer_user,
            COALESCE(b.company_name, u.name) AS buyer_name
     FROM negotiations n
     JOIN crops c ON c.id = n.crop_id
     JOIN farmers f ON f.id = n.farmer_id
     JOIN users u ON u.id = n.buyer_id
     LEFT JOIN buyers b ON b.user_id = n.buyer_id
     WHERE n.id = ?"
);
$s->execute([$id]);
$n = $s->fetch();

$mine = $n && ($role === 'buyer' ? (int)$n['buyer_id'] === $uid : (int)$n['farmer_user'] === $uid);
if (!$mine) out(['error' => 'Negotiation not found'], 404);

$phone = ($role === 'buyer' && $n['status'] === 'accepted') ? $n['farmer_phone'] : null;
unset($n['farmer_phone'], $n['farmer_user'], $n['buyer_id']);
$n['phone'] = $phone;

$m = $pdo->prepare(
    "SELECT id, sender_role, kind, body, amount, created_at
     FROM negotiation_messages WHERE negotiation_id = ? ORDER BY id"
);
$m->execute([$id]);

out(['me' => $role, 'negotiation' => $n, 'messages' => $m->fetchAll(), 'list' => $list]);