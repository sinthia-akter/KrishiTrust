<?php
require 'config.php';
require_login(['buyer']);

$uid = $_SESSION['user']['id'];

$s = $pdo->prepare(
    "SELECT COALESCE(SUM(status IN ('placed','confirmed','in_transit')), 0) AS active,
            COALESCE(SUM(status = 'placed'), 0) AS pending,
            COALESCE(SUM(IF(status = 'delivered', total, 0)), 0) AS purchased,
            COUNT(DISTINCT IF(status <> 'cancelled', farmer_id, NULL)) AS farmers
     FROM orders WHERE buyer_id = ?"
);
$s->execute([$uid]);
$stats = $s->fetch();

$v = $pdo->prepare(
    "SELECT COALESCE(SUM(GREATEST(c.price - o.unit_price, 0) * o.quantity), 0)
     FROM orders o JOIN crops c ON c.id = o.crop_id
     WHERE o.buyer_id = ? AND o.negotiation_id IS NOT NULL AND o.status <> 'cancelled'"
);
$v->execute([$uid]);
$stats['savings'] = (float)$v->fetchColumn();


$p = $pdo->prepare(
    "SELECT crop_name, unit,
            SUM(IF(status <> 'cancelled', quantity, 0)) AS ordered,
            SUM(IF(status = 'delivered', quantity, 0)) AS delivered
     FROM orders WHERE buyer_id = ?
     GROUP BY crop_name, unit
     HAVING ordered > 0
     ORDER BY ordered DESC LIMIT 3"
);
$p->execute([$uid]);


$w = $pdo->prepare(
    "SELECT COUNT(*) FROM negotiations
     WHERE buyer_id = ? AND status = 'open' AND offered_by = 'farmer'"
);
$w->execute([$uid]);

out(['stats' => $stats, 'crops' => $p->fetchAll(), 'waiting' => (int)$w->fetchColumn()]);