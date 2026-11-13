<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$pdo = new PDO(
    "mysql:host=localhost;dbname=krishitrust;charset=utf8mb4",
    "root",
    "",
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

function out($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function require_login(array $roles = []) {
    global $pdo;
    if (empty($_SESSION['user'])) {
        out(['error' => 'Please log in first'], 401);
    }

    $s = $pdo->prepare("SELECT status FROM users WHERE id = ?");
    $s->execute([$_SESSION['user']['id']]);
    if ($s->fetchColumn() !== 'active') {
        session_destroy();
        out(['error' => 'Your account is blocked'], 401);
    }

    if (!empty($_SESSION['user']['must_change']) && basename($_SERVER['SCRIPT_NAME']) !== 'password_change.php') {
        out(['error' => 'Please change your temporary password first'], 403);
    }

    if ($roles && !in_array($_SESSION['user']['role'], $roles)) {
        out(['error' => 'You are not allowed to do this'], 403);
    }
}