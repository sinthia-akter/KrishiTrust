<?php
require 'config.php';
require_login(['udc', 'admin']);

$uid = $_SESSION['user']['id'];

function one($pdo, $sql, $params) {
    $s = $pdo->prepare($sql);
    $s->execute($params);
    return (int)$s->fetchColumn();
}

$total = one($pdo, "SELECT COUNT(*) FROM farmers WHERE registered_by = ?", [$uid]);
$month = one($pdo,
    "SELECT COUNT(*) FROM farmers
     WHERE registered_by = ? AND created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')", [$uid]);
$active = one($pdo,
    "SELECT COUNT(DISTINCT f.id) FROM farmers f
     JOIN crops c ON c.farmer_id = f.id
     WHERE f.registered_by = ?", [$uid]);
$pending = (int)$pdo->query("SELECT COUNT(*) FROM farmers WHERE status = 'pending'")->fetchColumn();

$m = $pdo->prepare(
    "SELECT DATE_FORMAT(created_at, '%Y-%m') AS m, COUNT(*) AS n
     FROM farmers
     WHERE registered_by = ? AND created_at >= DATE_FORMAT(NOW() - INTERVAL 5 MONTH, '%Y-%m-01')
     GROUP BY m ORDER BY m"
);
$m->execute([$uid]);

$d = $pdo->prepare(
    "SELECT district, COUNT(*) AS n FROM farmers
     WHERE registered_by = ? GROUP BY district ORDER BY n DESC LIMIT 5"
);
$d->execute([$uid]);

out([
    'total'     => $total,
    'month'     => $month,
    'active'    => $active,
    'pending'   => $pending,
    'monthly'   => $m->fetchAll(),
    'districts' => $d->fetchAll(),
]);