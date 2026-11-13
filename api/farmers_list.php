<?php
require 'config.php';
require_login(['bank', 'udc', 'admin']);

$rows = $pdo->query(
    "SELECT id, full_name, nid, district, land_bigha, status
     FROM farmers
     ORDER BY (status = 'pending') DESC, id DESC
     LIMIT 200"
)->fetchAll();

foreach ($rows as &$r) {
    $r['has_nid'] = $r['nid'] !== null && $r['nid'] !== '';
    $r['nid'] = $r['has_nid'] ? '********' . substr($r['nid'], -4) : null;
}
unset($r);

$stats = $pdo->query(
    "SELECT COUNT(*) AS total,
            SUM(status = 'verified') AS verified,
            SUM(status = 'pending')  AS pending,
            SUM(nid IS NOT NULL AND land_bigha > 0) AS complete
     FROM farmers"
)->fetch();

out(['farmers' => $rows, 'stats' => $stats]);