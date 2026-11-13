<?php
require 'config.php';
require_login(['admin']);

$id     = (int)($_POST['id'] ?? 0);
$action = $_POST['action'] ?? '';

if (!in_array($action, ['block', 'unblock'], true)) out(['error' => 'Invalid action'], 400);
if ($id === (int)$_SESSION['user']['id'])           out(['error' => 'You cannot block your own account'], 409);

$u = $pdo->prepare("SELECT id, role FROM users WHERE id = ?");
$u->execute([$id]);
$target = $u->fetch();
if (!$target)                     out(['error' => 'User not found'], 404);
if ($target['role'] === 'admin')  out(['error' => 'Admin accounts cannot be blocked here'], 403);

$pdo->prepare("UPDATE users SET status = ? WHERE id = ?")
    ->execute([$action === 'block' ? 'blocked' : 'active', $id]);

out(['ok' => true]);