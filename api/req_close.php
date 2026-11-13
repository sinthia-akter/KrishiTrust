<?php
require 'config.php';
require_login(['buyer']);

$u = $pdo->prepare("UPDATE requirements SET status = 'closed' WHERE id = ? AND buyer_id = ? AND status = 'open'");
$u->execute([(int)($_POST['id'] ?? 0), $_SESSION['user']['id']]);

if ($u->rowCount() === 0) out(['error' => 'Requirement not found or already closed'], 404);
out(['ok' => true]);