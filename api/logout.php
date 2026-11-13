<?php
require 'config.php';
session_destroy();
out(['ok' => true]);