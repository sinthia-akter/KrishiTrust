<?php
require 'config.php';
require_login(['admin']);

$t0 = microtime(true);
$pdo->query("SELECT 1");
$dbMs = round((microtime(true) - $t0) * 1000, 1);

function status($pdo, $name) {
    $r = $pdo->query("SHOW GLOBAL STATUS LIKE '$name'")->fetch();
    return $r ? (int)$r['Value'] : 0;
}

$size = $pdo->query(
    "SELECT ROUND(COALESCE(SUM(data_length + index_length), 0) / 1024 / 1024, 2)
     FROM information_schema.tables WHERE table_schema = DATABASE()"
)->fetchColumn();

$names = ['users','farmers','buyers','crops','negotiations','negotiation_messages',
          'orders','bulk_orders','requirements','requirement_offers','stores'];
$tables = [];
foreach ($names as $n) {
    try {
        $tables[] = ['name' => $n, 'rows' => (int)$pdo->query("SELECT COUNT(*) FROM `$n`")->fetchColumn()];
    } catch (PDOException $e) {
        $tables[] = ['name' => $n, 'rows' => null];   
    }
}

function count24($pdo, $sql) {
    try { return (int)$pdo->query($sql)->fetchColumn(); } catch (PDOException $e) { return 0; }
}

out([
    'db_ms'    => $dbMs,
    'uptime'   => status($pdo, 'Uptime'),
    'threads'  => status($pdo, 'Threads_connected'),
    'size_mb'  => (float)$size,
    'mysql'    => $pdo->query("SELECT VERSION()")->fetchColumn(),
    'php'      => PHP_VERSION,
    'time'     => date('Y-m-d H:i:s'),
    'tables'   => $tables,
    'live'     => count24($pdo, "SELECT COUNT(*) FROM crops WHERE status='live' AND quantity > 0"),
    'stores'   => count24($pdo, "SELECT COUNT(*) FROM stores WHERE status='verified'"),
    'day' => [
        'users'    => count24($pdo, "SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL 1 DAY"),
        'orders'   => count24($pdo, "SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL 1 DAY"),
        'messages' => count24($pdo, "SELECT COUNT(*) FROM negotiation_messages WHERE created_at >= NOW() - INTERVAL 1 DAY"),
    ],
]);