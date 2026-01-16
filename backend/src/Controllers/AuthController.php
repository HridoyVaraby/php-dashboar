<?php
namespace App\Controllers;

use App\Models\User;
use App\Helpers\CSRF;
use App\Helpers\Sanitizer;

class AuthController {
    public function showLogin(): void
    {
        // If already logged in, redirect to admin
        if (isset($_SESSION['user'])) {
            header('Location: /admin');
            exit;
        }

        $csrfToken = CSRF::generate();
        include __DIR__ . '/../../views/auth/login.php';
    }

    public function login(): void
    {
        // Verify CSRF
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            $_SESSION['error'] = 'Invalid security token. Please try again.';
            header('Location: /auth');
            exit;
        }

        $email = Sanitizer::email($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            $_SESSION['error'] = 'Email and password are required.';
            header('Location: /auth');
            exit;
        }

        $userModel = new User();
        $user = $userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            $_SESSION['error'] = 'Invalid email or password.';
            header('Location: /auth');
            exit;
        }

        if ($user['is_suspended']) {
            $_SESSION['error'] = 'Your account has been suspended.';
            header('Location: /auth');
            exit;
        }

        if (!in_array($user['role'], ['ADMIN', 'EDITOR'])) {
            $_SESSION['error'] = 'You do not have permission to access the admin panel.';
            header('Location: /auth');
            exit;
        }

        // Regenerate session ID to prevent fixation
        session_regenerate_id(true);

        // Store user in session
        $_SESSION['user'] = [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['full_name'],
            'role' => $user['role'],
            'avatar' => $user['avatar_url'],
        ];

        header('Location: /admin');
        exit;
    }

    public function logout(): void
    {
        session_destroy();
        header('Location: /auth');
        exit;
    }
}
