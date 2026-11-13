<?php
require 'config.php';
require_login(['admin', 'government', 'store']);

$role = $_SESSION['user']['role'];
$where = '';
$params = [];
if ($role === 'store') {           
    $where = 'WHERE owner_id = ?';
    $params = [$_SESSION['user']['id']];
}

$s = $pdo->prepare(
    "SELECT id, name, district, area, products, status, created_at
     FROM stores $where
     ORDER BY (status = 'pending') DESC, id DESC LIMIT 200"
);
$s->execute($params);

$t = $pdo->prepare(
    "SELECT COUNT(*) AS total,
            COALESCE(SUM(status = 'pending'), 0)   AS pending,
            COALESCE(SUM(status = 'suspended'), 0) AS flagged
     FROM stores $where"
);
$t->execute($params);

out(['role' => $role, 'stores' => $s->fetchAll(), 'stats' => $t->fetch()]);