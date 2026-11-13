<?php
require 'config.php';  

$rows = $pdo->query(
    "SELECT c.id, c.crop_name, c.quantity, c.unit, c.price, c.quality, c.location,
            c.harvest_date, f.full_name AS farmer_name, f.district
     FROM crops c JOIN farmers f ON f.id = c.farmer_id
     WHERE c.status = 'live' AND c.quantity > 0 AND f.status = 'verified'
     ORDER BY c.id DESC"
)->fetchAll();

out(['crops' => $rows]);