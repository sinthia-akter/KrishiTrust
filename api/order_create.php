<?php
require 'config.php';
require_login(['buyer']);

$uid    = $_SESSION['user']['id'];
$cropId = (int)($_POST['crop_id'] ?? 0);
$negId  = (int)($_POST['negotiation_id'] ?? 0);
$qty    = (float)preg_replace('/[^\d.]/', '', $_POST['quantity'] ?? '');

function fail($pdo, $msg, $code = 400) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    out(['error' => $msg], $code);
}

if ($qty <= 0) out(['error' => 'Enter a valid quantity'], 400);

try {
    $pdo->beginTransaction();

  
    $c = $pdo->prepare(
        "SELECT c.*, f.status AS fstatus FROM crops c
         JOIN farmers f ON f.id = c.farmer_id WHERE c.id = ? FOR UPDATE"
    );
    $c->execute([$cropId]);
    $crop = $c->fetch();

    if (!$crop || $crop['status'] !== 'live' || $crop['fstatus'] !== 'verified') {
        fail($pdo, 'This crop is not available', 404);
    }
    if ($qty > (float)$crop['quantity']) {
        fail($pdo, 'Only ' . (float)$crop['quantity'] . ' ' . $crop['unit'] . ' available', 409);
    }

    $price = (float)$crop['price'];
    if ($negId) {
        $n = $pdo->prepare(
            "SELECT current_offer FROM negotiations
             WHERE id = ? AND buyer_id = ? AND crop_id = ? AND status = 'accepted'"
        );
        $n->execute([$negId, $uid, $cropId]);
        $neg = $n->fetch();
        if (!$neg) fail($pdo, 'No accepted negotiation found for this crop', 403);
        $price = (float)$neg['current_offer'];
    }

    $ins = $pdo->prepare(
        "INSERT INTO orders (buyer_id, farmer_id, crop_id, negotiation_id, crop_name, quantity, unit, unit_price, total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $ins->execute([
        $uid, $crop['farmer_id'], $cropId, $negId ?: null,
        $crop['crop_name'], $qty, $crop['unit'], $price, round($qty * $price, 2),
    ]);
    $id   = (int)$pdo->lastInsertId();
    $code = 'KT-ORD-' . date('Y') . '-' . str_pad($id, 4, '0', STR_PAD_LEFT);
    $pdo->prepare("UPDATE orders SET order_code = ? WHERE id = ?")->execute([$code, $id]);

  
    $left = (float)$crop['quantity'] - $qty;
    $pdo->prepare("UPDATE crops SET quantity = ?, status = ? WHERE id = ?")
        ->execute([$left, $left <= 0 ? 'sold' : 'live', $cropId]);

    $pdo->commit();
} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    if ($e->getCode() === '23000') out(['error' => 'An order was already placed for this negotiation'], 409);
    out(['error' => 'Could not place the order. Try again.'], 500);
}

out(['ok' => true, 'order_code' => $code, 'total' => $qty * $price]);