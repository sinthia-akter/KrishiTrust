<?php
require 'config.php';
require_login(['farmer']);

$f = $pdo->prepare("SELECT id, status FROM farmers WHERE user_id = ?");
$f->execute([$_SESSION['user']['id']]);
$farmer = $f->fetch();
if (!$farmer || $farmer['status'] !== 'verified') {
    out(['error' => 'Your account must be verified before you can make offers'], 403);
}

$rid = (int)($_POST['id'] ?? 0);
$r = $pdo->prepare("SELECT id FROM requirements WHERE id = ? AND status = 'open' AND deadline >= CURDATE()");
$r->execute([$rid]);
if (!$r->fetch()) out(['error' => 'This requirement is closed or expired'], 404);

$ins = $pdo->prepare("INSERT IGNORE INTO requirement_offers (requirement_id, farmer_id) VALUES (?, ?)");
$ins->execute([$rid, $farmer['id']]);
if ($ins->rowCount() === 0) out(['error' => 'You already offered to supply this'], 409);

out(['ok' => true]);