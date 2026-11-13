<?php
require 'config.php';

$login = trim($_POST['login'] ?? '');
$pass  = $_POST['password'] ?? '';

$byEmail = strpos($login, '@') !== false;

$stmt = $pdo->prepare(
    $byEmail ? "SELECT * FROM users WHERE email = ?" : "SELECT * FROM users WHERE phone = ?"
);
$stmt->execute([$login]);
$u = $stmt->fetch();

if (!$u || !password_verify($pass, $u['password'])) {
    out(['error' => 'Wrong login or password'], 401);
}

$phoneRoles = ['farmer', 'buyer'];
$isPhoneRole = in_array($u['role'], $phoneRoles);
if ($byEmail === $isPhoneRole) {
    out(['error' => $isPhoneRole
        ? 'Farmers and buyers must log in with their mobile number'
        : 'Staff accounts must log in with their email'], 403);
}

if ($u['status'] === 'blocked') {
    out(['error' => 'Your account is blocked'], 403);
}

session_regenerate_id(true);
$_SESSION['user'] = [
    'id'          => $u['id'],
    'name'        => $u['name'],
    'role'        => $u['role'],
    'must_change' => (int)$u['must_change_password'],
];

out(['ok' => true, 'role' => $u['role'], 'must_change' => (int)$u['must_change_password']]);