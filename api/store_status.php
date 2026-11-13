<?php
require 'config.php';
require_login(['admin', 'government']);

$id     = (int)($_POST['id'] ?? 0);
$action = $_POST['action'] ?? '';
$map    = ['verify' => 'verified', 'flag' => 'suspended'];

if (!isset($map[$action])) out(['error' => 'Invalid action'], 400);

$u = $pdo->prepare("UPDATE stores SET status = ? WHERE id = ? AND status <> ?");
$u->execute([$map[$action], $id, $map[$action]]);

if ($u->rowCount() === 0) out(['error' => 'Store not found or already in that status'], 404);
out(['ok' => true]);