<?php
require 'config.php';
require_login(['farmer']);

$f = $pdo->prepare("SELECT id FROM farmers WHERE user_id = ?");
$f->execute([$_SESSION['user']['id']]);
$fid = (int)$f->fetchColumn();
if (!$fid) out(['error' => 'Farmer profile not found'], 404);

$s = $pdo->prepare(
    "SELECT o.id, o.bulk_id, bo.bulk_code, o.order_code, o.crop_name, o.quantity, o.unit,
            o.unit_price, o.total, o.status,
            COALESCE(b.company_name, u.name) AS buyer
     FROM orders o
     JOIN bulk_orders bo ON bo.id = o.bulk_id
     JOIN users u ON u.id = o.buyer_id
     LEFT JOIN buyers b ON b.user_id = o.buyer_id
     WHERE o.farmer_id = ?
     ORDER BY o.id DESC LIMIT 30"
);
$s->execute([$fid]);
$mine = $s->fetchAll();

$ids = array_values(array_unique(array_map(fn($r) => (int)$r['bulk_id'], $mine)));
$parts = [];
if ($ids) {
    $in = implode(',', array_fill(0, count($ids), '?'));
    $p = $pdo->prepare(
        "SELECT o.bulk_id, o.farmer_id, f.full_name, o.quantity, o.unit, o.status
         FROM orders o JOIN farmers f ON f.id = o.farmer_id
         WHERE o.bulk_id IN ($in) ORDER BY o.id"
    );
    $p->execute($ids);
    foreach ($p->fetchAll() as $r) {
        $parts[$r['bulk_id']][] = [
            'name'     => (int)$r['farmer_id'] === $fid ? 'You' : $r['full_name'],
            'quantity' => $r['quantity'],
            'unit'     => $r['unit'],
            'status'   => $r['status'],
        ];
    }
}

$active = ['placed', 'confirmed', 'in_transit'];
$stats = ['open' => 0, 'supply' => 0, 'value' => 0, 'delivered' => 0];
$bulks = [];
$openSeen = [];
foreach ($mine as $r) {
    if (in_array($r['status'], $active)) {
        $stats['supply'] += (float)$r['quantity'];
        $stats['value']  += (float)$r['total'];
        $openSeen[$r['bulk_id']] = true;
    }
    if ($r['status'] === 'delivered') $stats['delivered']++;
    $r['parts'] = $parts[$r['bulk_id']] ?? [];
    $bulks[] = $r;
}
$stats['open'] = count($openSeen);

out(['stats' => $stats, 'bulks' => $bulks]);