<?php
require 'config.php';
require_login(['buyer']);

$s = $pdo->prepare(
    "SELECT r.id, r.req_code, r.crop_name, r.quantity, r.unit, r.budget, r.deadline,
            r.quality, r.region, r.status,
            COUNT(o.id) AS offers,
            GROUP_CONCAT(f.full_name ORDER BY o.id SEPARATOR ', ') AS farmers
     FROM requirements r
     LEFT JOIN requirement_offers o ON o.requirement_id = r.id
     LEFT JOIN farmers f ON f.id = o.farmer_id
     WHERE r.buyer_id = ?
     GROUP BY r.id
     ORDER BY r.id DESC LIMIT 30"
);
$s->execute([$_SESSION['user']['id']]);

out(['requirements' => $s->fetchAll(), 'today' => date('Y-m-d')]);