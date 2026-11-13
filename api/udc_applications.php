<?php
require 'config.php';
require_login(['udc', 'admin']);

$uid = $_SESSION['user']['id'];

$s = $pdo->prepare(
    "SELECT id, farmer_code, full_name, nid, district, union_name, land_bigha, primary_crop,
            status, created_at, (registered_by = ?) AS mine
     FROM farmers
     WHERE registered_by = ? OR (status = 'pending' AND registered_by IS NULL)
     ORDER BY id DESC LIMIT 100"
);
$s->execute([$uid, $uid]);
$rows = $s->fetchAll();

foreach ($rows as &$r) {
    $r['nid'] = $r['nid'] ? '********' . substr($r['nid'], -4) : null;
}
unset($r);

out(['applications' => $rows]);