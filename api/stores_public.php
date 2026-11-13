<?php
require 'config.php';  

$stores = $pdo->query(
    "SELECT id, name, district, area, products, rating
     FROM stores WHERE status = 'verified' ORDER BY name"
)->fetchAll();

$stats = $pdo->query(
    "SELECT COUNT(*) AS verified, ROUND(AVG(rating), 1) AS avg_rating
     FROM stores WHERE status = 'verified'"
)->fetch();

out(['stores' => $stores, 'stats' => $stats]);