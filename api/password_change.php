<?php
require 'config.php';
require_login();   

$uid = $_SESSION['user']['id'];
$old = $_POST['current_password'] ?? '';
$new = $_POST['new_password'] ?? '';

if (strlen($new) < 12 || strlen($new) > 72) {
    out(['error' => 'New password must be 12 to 72 characters'], 400);
}
if ($new === $old) {
    out(['error' => 'The new password must be different from the current one'], 400);
}

$s = $pdo->prepare("SELECT password FROM users WHERE id = ?");
$s->execute([$uid]);
if (!password_verify($old, (string)$s->fetchColumn())) {
    out(['error' => 'The current password is wrong'], 403);
}

$pdo->prepare("UPDATE users SET password = ?, must_change_password = 0 WHERE id = ?")
    ->execute([password_hash($new, PASSWORD_DEFAULT), $uid]);

$_SESSION['user']['must_change'] = 0;
session_regenerate_id(true);

out(['ok' => true, 'role' => $_SESSION['user']['role']]);