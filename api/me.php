<?php
require 'config.php';
out(['user' => $_SESSION['user'] ?? null]);