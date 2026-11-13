<?php
require 'config.php';
require_login(['farmer']);

$uid = $_SESSION['user']['id'];

$f = $pdo->prepare("SELECT id, status FROM farmers WHERE user_id = ?");
$f->execute([$uid]);
$farmer = $f->fetch();
if (!$farmer) out(['error' => 'Farmer profile not found'], 404);
$fid = (int)$farmer['id'];

function one($pdo, $sql, $fid) {
    $s = $pdo->prepare($sql);
    $s->execute([$fid]);
    return $s->fetchColumn();
}

$stats = [
    'status'    => $farmer['status'],
    'listings'  => (int)one($pdo, "SELECT COUNT(*) FROM crops WHERE farmer_id = ? AND status = 'live' AND quantity > 0", $fid),
    'earnings'  => (float)one($pdo, "SELECT COALESCE(SUM(total), 0) FROM orders WHERE farmer_id = ? AND status = 'delivered'", $fid),
    'bids'      => (int)one($pdo, "SELECT COUNT(*) FROM negotiations WHERE farmer_id = ? AND status = 'open' AND offered_by = 'buyer'", $fid),
    'new_orders'=> (int)one($pdo, "SELECT COUNT(*) FROM orders WHERE farmer_id = ? AND status = 'placed'", $fid),
];

$n = $pdo->prepare(
    "SELECT n.id, c.crop_name, n.current_offer, COALESCE(b.company_name, u.name) AS buyer
     FROM negotiations n
     JOIN crops c ON c.id = n.crop_id
     JOIN users u ON u.id = n.buyer_id
     LEFT JOIN buyers b ON b.user_id = n.buyer_id
     WHERE n.farmer_id = ? AND n.status = 'open' AND n.offered_by = 'buyer'
     ORDER BY n.id DESC LIMIT 5"
);
$n->execute([$fid]);


$o = $pdo->prepare(
    "SELECT o.order_code, o.crop_name, o.quantity, o.unit, o.status,
            COALESCE(b.company_name, u.name) AS buyer
     FROM orders o
     JOIN users u ON u.id = o.buyer_id
     LEFT JOIN buyers b ON b.user_id = o.buyer_id
     WHERE o.farmer_id = ?
     ORDER BY o.id DESC LIMIT 5"
);
$o->execute([$fid]);

$prices = $pdo->query(
    "SELECT crop_name, ROUND(AVG(price)) AS avg_price
     FROM crops WHERE status = 'live' AND quantity > 0
     GROUP BY crop_name ORDER BY crop_name"
)->fetchAll();

out([
    'stats'  => $stats,
    'offers' => $n->fetchAll(),
    'orders' => $o->fetchAll(),
    'prices' => $prices,
]);