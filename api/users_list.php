<?php
require 'config.php';
require_login(['admin']);

$users = $pdo->query(
    "SELECT u.id, u.name, u.role, u.status, u.created_at,
            COALESCE(u.email, u.phone) AS contact,
            COALESCE(f.district, b.district, '-') AS district
     FROM users u
     LEFT JOIN farmers f ON f.user_id = u.id
     LEFT JOIN buyers  b ON b.user_id = u.id
     ORDER BY u.id DESC LIMIT 200"
)->fetchAll();

$stats = $pdo->query(
    "SELECT COUNT(*) AS total,
            SUM(role = 'farmer') AS farmers,
            SUM(role = 'buyer')  AS buyers,
            SUM(status = 'active') AS active
     FROM users"
)->fetch();

out(['users' => $users, 'stats' => $stats, 'me' => $_SESSION['user']['id']]);