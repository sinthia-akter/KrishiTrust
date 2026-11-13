<?php
require 'config.php';
require_login(['buyer', 'farmer']);

$uid  = $_SESSION['user']['id'];
$role = $_SESSION['user']['role'];
$id   = (int)($_POST['id'] ?? 0);
$kind = $_POST['kind'] ?? '';

$s = $pdo->prepare(
    "SELECT n.*, f.user_id AS farmer_user, c.status AS crop_status, c.quantity
     FROM negotiations n
     JOIN farmers f ON f.id = n.farmer_id
     JOIN crops c ON c.id = n.crop_id
     WHERE n.id = ?"
);
$s->execute([$id]);
$n = $s->fetch();

$mine = $n && ($role === 'buyer' ? (int)$n['buyer_id'] === $uid : (int)$n['farmer_user'] === $uid);
if (!$mine) out(['error' => 'Negotiation not found'], 404);
if ($n['status'] !== 'open') out(['error' => 'This negotiation is already closed'], 409);

function add_message($pdo, $id, $role, $kind, $body, $amount) {
    $pdo->prepare(
        "INSERT INTO negotiation_messages (negotiation_id, sender_role, kind, body, amount)
         VALUES (?, ?, ?, ?, ?)"
    )->execute([$id, $role, $kind, $body, $amount]);
}

if ($kind === 'text') {
    $body = trim($_POST['body'] ?? '');
    if ($body === '' || mb_strlen($body) > 500) {
        out(['error' => 'Message must be 1 to 500 characters'], 400);
    }
    add_message($pdo, $id, $role, 'text', $body, null);

} elseif ($kind === 'offer') {
    $amount = (float)preg_replace('/[^\d.]/', '', $_POST['amount'] ?? '');
    if ($amount <= 0 || $amount > 10000000) out(['error' => 'Enter a valid price'], 400);

    $pdo->prepare(
        "UPDATE negotiations SET current_offer = ?, offered_by = ? WHERE id = ? AND status = 'open'"
    )->execute([$amount, $role, $id]);
    add_message($pdo, $id, $role, 'offer', null, $amount);

} elseif ($kind === 'accept') {
    if ($n['crop_status'] !== 'live' || (float)$n['quantity'] <= 0) {
        out(['error' => 'This crop is no longer available'], 409);
    }
    $u = $pdo->prepare(
        "UPDATE negotiations SET status = 'accepted'
         WHERE id = ? AND status = 'open' AND offered_by <> ?"
    );
    $u->execute([$id, $role]);
    if ($u->rowCount() === 0) out(['error' => 'You cannot accept your own offer'], 409);
    add_message($pdo, $id, $role, 'accept', null, $n['current_offer']);

} else {
    out(['error' => 'Invalid action'], 400);
}

out(['ok' => true]);