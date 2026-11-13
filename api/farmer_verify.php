<?php
require 'config.php';
require_login(['udc', 'admin']);   

$id     = (int)($_POST['id'] ?? 0);
$action = $_POST['action'] ?? '';
$nid    = trim($_POST['nid'] ?? '');

$f = $pdo->prepare("SELECT id, nid FROM farmers WHERE id = ?");
$f->execute([$id]);
$farmer = $f->fetch();
if (!$farmer) out(['error' => 'Farmer not found'], 404);

if ($action === 'reject') {
    $pdo->prepare("UPDATE farmers SET status = 'rejected' WHERE id = ?")->execute([$id]);
    out(['ok' => true]);
}

if ($action !== 'verify') out(['error' => 'Invalid action'], 400);


if (empty($farmer['nid'])) {
    if (!preg_match('/^\d{10}$|^\d{13}$|^\d{17}$/', $nid)) {
        out(['error' => 'Enter a valid NID (10, 13 or 17 digits)'], 400);
    }
    $dup = $pdo->prepare("SELECT id FROM farmers WHERE nid = ? AND id <> ?");
    $dup->execute([$nid, $id]);
    if ($dup->fetch()) out(['error' => 'This NID belongs to another farmer'], 409);

    $pdo->prepare("UPDATE farmers SET nid = ?, status = 'verified' WHERE id = ?")->execute([$nid, $id]);
} else {
    $pdo->prepare("UPDATE farmers SET status = 'verified' WHERE id = ?")->execute([$id]);
}

out(['ok' => true]);