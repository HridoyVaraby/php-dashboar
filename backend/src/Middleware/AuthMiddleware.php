<?php
namespace App\Middleware;

class AuthMiddleware {
    public static function handle(): bool
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['user'])) {
            header('Location: /auth');
            exit;
        }

        $role = $_SESSION['user']['role'] ?? '';
        if (!in_array($role, ['ADMIN', 'EDITOR'])) {
            header('Location: /auth');
            exit;
        }

        return true;
    }
}
