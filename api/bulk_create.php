<?php
require 'config.php';
require_login(['buyer']);

$uid = $_SESSION['user']['id'];

$items = [];
foreach (explode(',', trim($_POST['items'] ?? '')) as $part) {
    if ($part === '') continue;
    $p = explode(':', $part);
    if (count($p) !== 2) out(['error' => 'Invalid order items'], 400);
    $cid = (int)$p[0];
    $q   = (float)$p[1];
    if ($cid <= 0 || $q <= 0) out(['error' => 'Enter a valid quantity for every farmer'], 400);
    if (isset($items[$cid])) out(['error' => 'The same listing was added twice'], 400);
    $items[$cid] = $q;
}

if (count($items) < 2) out(['error' => 'Choose at least 2 farmers for a bulk order'], 400);
if (count($items) > 3) out(['error' => 'You can take one product from at most 3 farmers in one order'], 400);

ksort($items);   

function fail($pdo, $msg, $code = 400) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    out(['error' => $msg], $code);
}

try {
    $pdo->beginTransaction();

    $rows = [];
    foreach ($items as $cid => $qty) {
        $c = $pdo->prepare(
            "SELECT c.*, f.status AS fstatus FROM crops c
             JOIN farmers f ON f.id = c.farmer_id WHERE c.id = ? FOR UPDATE"
        );
        $c->execute([$cid]);
        $crop = $c->fetch();

        if (!$crop || $crop['status'] !== 'live' || $crop['fstatus'] !== 'verified') {
            fail($pdo, 'One of the listings is no longer available', 404);
        }
        if ($qty > (float)$crop['quantity']) {
            fail($pdo, 'Only ' . (float)$crop['quantity'] . ' ' . $crop['unit'] . ' left from one of the farmers', 409);
        }
        $rows[] = ['crop' => $crop, 'qty' => $qty];
    }

    $name = $rows[0]['crop']['crop_name'];
    $unit = $rows[0]['crop']['unit'];
    $farmers = [];
    foreach ($rows as $r) {
        if ($r['crop']['crop_name'] !== $name) fail($pdo, 'A bulk order can only contain one product');
        if ($r['crop']['unit'] !== $unit)      fail($pdo, 'These listings use different units. Choose farmers with the same unit');
        $farmers[$r['crop']['farmer_id']] = true;
    }
    if (count($farmers) > 3) fail($pdo, 'You can take one product from at most 3 farmers in one order');

    $pdo->prepare("INSERT INTO bulk_orders (buyer_id, crop_name) VALUES (?, ?)")->execute([$uid, $name]);
    $bulkId   = (int)$pdo->lastInsertId();
    $bulkCode = 'KT-BULK-' . date('Y') . '-' . str_pad($bulkId, 4, '0', STR_PAD_LEFT);
    $pdo->prepare("UPDATE bulk_orders SET bulk_code = ? WHERE id = ?")->execute([$bulkCode, $bulkId]);

    $grand = 0;
    foreach ($rows as $r) {
        $crop  = $r['crop'];
        $qty   = $r['qty'];
        $price = (float)$crop['price'];
        $total = round($qty * $price, 2);
        $grand += $total;

        $pdo->prepare(
            "INSERT INTO orders (buyer_id, farmer_id, crop_id, bulk_id, crop_name, quantity, unit, unit_price, total)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )->execute([$uid, $crop['farmer_id'], $crop['id'], $bulkId, $crop['crop_name'], $qty, $crop['unit'], $price, $total]);
        $oid = (int)$pdo->lastInsertId();
        $pdo->prepare("UPDATE orders SET order_code = ? WHERE id = ?")
            ->execute(['KT-ORD-' . date('Y') . '-' . str_pad($oid, 4, '0', STR_PAD_LEFT), $oid]);

        $left = (float)$crop['quantity'] - $qty;
        $pdo->prepare("UPDATE crops SET quantity = ?, status = ? WHERE id = ?")
            ->execute([$left, $left <= 0 ? 'sold' : 'live', $crop['id']]);
    }

    $pdo->commit();
} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    out(['error' => 'Could not place the bulk order. Try again.'], 500);
}

out(['ok' => true, 'bulk_code' => $bulkCode, 'total' => $grand, 'farmers' => count($farmers)]);