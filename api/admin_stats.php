<?php
require 'config.php';
require_login(['admin']);

function val($pdo, $sql) {
    return $pdo->query($sql)->fetchColumn();
}

$month = "created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')";

$stats = [
    'users'        => (int)val($pdo, "SELECT COUNT(*) FROM users"),
    'farmers'      => (int)val($pdo, "SELECT COUNT(*) FROM users WHERE role = 'farmer'"),
    'buyers'       => (int)val($pdo, "SELECT COUNT(*) FROM users WHERE role = 'buyer'"),
    'blocked'      => (int)val($pdo, "SELECT COUNT(*) FROM users WHERE status = 'blocked'"),

    'orders_month' => (int)val($pdo, "SELECT COUNT(*) FROM orders WHERE status <> 'cancelled' AND $month"),
    'volume_month' => (float)val($pdo, "SELECT COALESCE(SUM(total), 0) FROM orders WHERE status <> 'cancelled' AND $month"),

    'pending_farmers' => (int)val($pdo, "SELECT COUNT(*) FROM farmers WHERE status = 'pending'"),
    'verified_farmers'=> (int)val($pdo, "SELECT COUNT(*) FROM farmers WHERE status = 'verified'"),
    'total_farmers'   => (int)val($pdo, "SELECT COUNT(*) FROM farmers"),

    'waiting_orders'  => (int)val($pdo, "SELECT COUNT(*) FROM orders WHERE status = 'placed' AND created_at < (NOW() - INTERVAL 2 DAY)"),
    'live_listings'   => (int)val($pdo, "SELECT COUNT(*) FROM crops WHERE status = 'live' AND quantity > 0"),
    'stores'          => (int)val($pdo, "SELECT COUNT(*) FROM stores WHERE status = 'verified'"),

    'negotiations'    => (int)val($pdo, "SELECT COUNT(*) FROM negotiations"),
    'accepted_negs'   => (int)val($pdo, "SELECT COUNT(*) FROM negotiations WHERE status = 'accepted'"),
    'orders_total'    => (int)val($pdo, "SELECT COUNT(*) FROM orders WHERE status <> 'cancelled'"),
    'orders_delivered'=> (int)val($pdo, "SELECT COUNT(*) FROM orders WHERE status = 'delivered'"),
];

$users = $pdo->query(
    "SELECT u.id, u.name, u.role, u.status, u.created_at,
            COALESCE(f.district, b.district, '-') AS district
     FROM users u
     LEFT JOIN farmers f ON f.user_id = u.id
     LEFT JOIN buyers  b ON b.user_id = u.id
     ORDER BY u.id DESC LIMIT 8"
)->fetchAll();

out(['stats' => $stats, 'users' => $users]);