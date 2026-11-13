<?php
require 'config.php';
require_login(['udc', 'admin']);

$stmt = $pdo->prepare(
    "SELECT COUNT(*) AS served,
            SUM(created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')) AS this_month
     FROM farmers WHERE registered_by = ?"
);
$stmt->execute([$_SESSION['user']['id']]);
$row = $stmt->fetch();

out(['served' => (int)$row['served'], 'this_month' => (int)$row['this_month']]);