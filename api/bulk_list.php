<?php
require 'config.php';
require_login(['buyer']);

$s = $pdo->prepare(
    "SELECT b.id AS bid, b.bulk_code, b.crop_name, b.created_at,
            o.id AS oid, o.order_code, o.quantity, o.unit, o.unit_price, o.total, o.status,
            f.full_name, f.district, f.phone
     FROM bulk_orders b
     JOIN orders o ON o.bulk_id = b.id
     JOIN farmers f ON f.id = o.farmer_id
     WHERE b.buyer_id = ?
     ORDER BY b.id DESC, o.id"
);
$s->execute([$_SESSION['user']['id']]);

$bulks = [];
foreach ($s->fetchAll() as $r) {
    $b = $r['bid'];
    if (!isset($bulks[$b])) {
        $bulks[$b] = ['id' => $b, 'bulk_code' => $r['bulk_code'], 'crop_name' => $r['crop_name'],
                      'created_at' => $r['created_at'], 'parts' => []];
    }
    $bulks[$b]['parts'][] = [
        'order_code' => $r['order_code'], 'quantity' => $r['quantity'], 'unit' => $r['unit'],
        'unit_price' => $r['unit_price'], 'total' => $r['total'], 'status' => $r['status'],
        'farmer' => $r['full_name'], 'district' => $r['district'], 'phone' => $r['phone'],
    ];
}

out(['bulks' => array_values($bulks)]);