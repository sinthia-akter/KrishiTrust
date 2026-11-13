<?php
require 'config.php';
require_login(['admin']);

$name  = trim($_POST['name'] ?? '');
$email = strtolower(trim($_POST['email'] ?? ''));
$pass  = $_POST['password'] ?? '';
$role  = $_POST['role'] ?? '';

if (!in_array($role, ['udc', 'bank', 'government', 'store'], true)) {
    out(['error' => 'Choose a valid role'], 400);
}
if ($name === '' || mb_strlen($name) > 100) {
    out(['error' => 'Name is required (up to 100 characters)'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 150) {
    out(['error' => 'Enter a valid email address'], 400);
}
if (strlen($pass) < 12 || strlen($pass) > 72) {
    out(['error' => 'Password must be 12 to 72 characters'], 400);
}

$c = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$c->execute([$email]);
if ($c->fetch()) out(['error' => 'This email is already registered'], 409);

$pdo->prepare(
    "INSERT INTO users (name, email, password, role, status, must_change_password)
     VALUES (?, ?, ?, ?, 'active', 1)"
)->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT), $role]);

out(['ok' => true]);