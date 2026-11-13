<?php
require 'config.php';
require_login(['admin', 'government']);

function one($pdo, $sql) { return $pdo->query($sql)->fetchColumn(); }

$monthly = $pdo->query(
    "SELECT DATE_FORMAT(created_at, '%Y-%m') AS m, ROUND(SUM(total)) AS value, COUNT(*) AS orders
     FROM orders
     WHERE status <> 'cancelled' AND created_at >= DATE_FORMAT(NOW() - INTERVAL 11 MONTH, '%Y-%m-01')
     GROUP BY m ORDER BY m"
)->fetchAll();

$peak = null;
foreach ($monthly as $r) {
    if ($peak === null || (float)$r['value'] > (float)$peak['value']) $peak = $r;
}

$thisMonth = (float)one($pdo,
    "SELECT COALESCE(SUM(total), 0) FROM orders
     WHERE status <> 'cancelled' AND created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')");

$listed  = (int)one($pdo, "SELECT COUNT(*) FROM crops");
$ordered = (int)one($pdo, "SELECT COUNT(DISTINCT crop_id) FROM orders WHERE status <> 'cancelled'");

$ordersAll  = (int)one($pdo, "SELECT COUNT(*) FROM orders WHERE status <> 'cancelled'");
$delivered  = (int)one($pdo, "SELECT COUNT(*) FROM orders WHERE status = 'delivered'");

$crops = $pdo->query(
    "SELECT crop_name, ROUND(SUM(total)) AS value, COUNT(*) AS orders
     FROM orders WHERE status <> 'cancelled'
     GROUP BY crop_name ORDER BY SUM(total) DESC LIMIT 5"
)->fetchAll();

$roles = $pdo->query("SELECT role, COUNT(*) AS n FROM users GROUP BY role ORDER BY n DESC")->fetchAll();

out([
    'this_month' => $thisMonth,
    'peak'       => $peak,
    'conversion' => ['listed' => $listed, 'ordered' => $ordered],
    'completion' => ['orders' => $ordersAll, 'delivered' => $delivered],
    'monthly'    => $monthly,
    'crops'      => $crops,
    'roles'      => $roles,
]);