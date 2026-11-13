<?php
require 'config.php';
require_login(['buyer']);

$cropId = (int)($_POST['crop_id'] ?? 0);
$uid    = $_SESSION['user']['id'];

$c = $pdo->prepare(
    "SELECT c.id, c.price, c.farmer_id
     FROM crops c JOIN farmers f ON f.id = c.farmer_id
     WHERE c.id = ? AND c.status = 'live' AND c.quantity > 0 AND f.status = 'verified'"
);
$c->execute([$cropId]);
$crop = $c->fetch();
if (!$crop) out(['error' => 'This crop is not available'], 404);

$ins = $pdo->prepare(
    "INSERT IGNORE INTO negotiations (crop_id, buyer_id, farmer_id, current_offer, offered_by)
     VALUES (?, ?, ?, ?, 'farmer')"
);
$ins->execute([$crop['id'], $uid, $crop['farmer_id'], $crop['price']]);
$isNew = $ins->rowCount() === 1;

$s = $pdo->prepare("SELECT id FROM negotiations WHERE crop_id = ? AND buyer_id = ?");
$s->execute([$crop['id'], $uid]);
$id = (int)$s->fetchColumn();

if ($isNew) {
    $pdo->prepare(
        "INSERT INTO negotiation_messages (negotiation_id, sender_role, kind, amount, body)
         VALUES (?, 'farmer', 'offer', ?, 'Listed price')"
    )->execute([$id, $crop['price']]);
}

out(['ok' => true, 'id' => $id]);