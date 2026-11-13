<?php
require 'config.php';
require_login(['buyer', 'farmer']);

$uid    = $_SESSION['user']['id'];
$role   = $_SESSION['user']['role'];
$id     = (int)($_POST['id'] ?? 0);
$action = $_POST['action'] ?? '';

$rules = [
    'confirm' => ['farmer', 'placed',     'confirmed'],
    'reject'  => ['farmer', 'placed',     'cancelled'],
    'ship'    => ['farmer', 'confirmed',  'in_transit'],
    'cancel'  => ['buyer',  'placed',     'cancelled'],
    'receive' => ['buyer',  'in_transit', 'delivered'],
];
if (!isset($rules[$action])) out(['error' => 'Invalid action'], 400);
[$who, $from, $to] = $rules[$action];
if ($role !== $who) out(['error' => 'You are not allowed to do this'], 403);

try {
    $pdo->beginTransaction();

    $s = $pdo->prepare(
        "SELECT o.*, f.user_id AS farmer_user FROM orders o
         JOIN farmers f ON f.id = o.farmer_id WHERE o.id = ? FOR UPDATE"
    );
    $s->execute([$id]);
    $o = $s->fetch();

    $mine = $o && ($role === 'buyer' ? (int)$o['buyer_id'] === $uid : (int)$o['farmer_user'] === $uid);
    if (!$mine) { $pdo->rollBack(); out(['error' => 'Order not found'], 404); }
    if ($o['status'] !== $from) { $pdo->rollBack(); out(['error' => 'This order is now "' . $o['status'] . '"'], 409); }

    $date = ($action === 'confirm') ? date('Y-m-d', strtotime('+7 days')) : $o['expected_delivery'];
    $pdo->prepare("UPDATE orders SET status = ?, expected_delivery = ? WHERE id = ?")
        ->execute([$to, $date, $id]);

    if ($to === 'cancelled') {
        $pdo->prepare(
            "UPDATE crops SET quantity = quantity + ?, status = IF(status = 'sold', 'live', status) WHERE id = ?"
        )->execute([$o['quantity'], $o['crop_id']]);
    }

    $pdo->commit();
} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    out(['error' => 'Could not update the order'], 500);
}

out(['ok' => true]);