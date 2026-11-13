<?php
require 'config.php';
require_login(['farmer']);

$f = $pdo->prepare("SELECT id, status FROM farmers WHERE user_id = ?");
$f->execute([$_SESSION['user']['id']]);
$farmer = $f->fetch();
if (!$farmer) out(['error' => 'Farmer profile not found'], 404);

$s = $pdo->prepare(
    "SELECT r.id, r.crop_name, r.quantity, r.unit, r.budget, r.deadline, r.quality, r.region,
            COALESCE(b.company_name, u.name) AS buyer,
            EXISTS(SELECT 1 FROM requirement_offers o WHERE o.requirement_id = r.id AND o.farmer_id = ?) AS mine
     FROM requirements r
     JOIN users u ON u.id = r.buyer_id
     LEFT JOIN buyers b ON b.user_id = r.buyer_id
     WHERE r.status = 'open' AND r.deadline >= CURDATE()
     ORDER BY r.id DESC LIMIT 20"
);
$s->execute([$farmer['id']]);

out(['verified' => $farmer['status'] === 'verified', 'requirements' => $s->fetchAll()]);