<?php
namespace App\Controllers;

use App\Models\User;
use App\Helpers\FlashMessage;
use App\Helpers\Sanitizer;
use App\Helpers\FileUpload;
use App\Helpers\CSRF;

class ProfileController {
    public function index(): void
    {
        $userModel = new User();
        $user = $userModel->find($_SESSION['user']['id']);

        $pageTitle = 'My Profile';

        ob_start();
        include __DIR__ . '/../../views/admin/profile/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function update(): void
    {
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/profile');
            exit;
        }

        $userModel = new User();
        $user = $userModel->find($_SESSION['user']['id']);

        $fullName = Sanitizer::clean($_POST['full_name'] ?? '');
        $email = Sanitizer::email($_POST['email'] ?? '');

        if (empty($fullName) || empty($email)) {
            FlashMessage::error('Full Name and Email are required.');
            header('Location: /admin/profile');
            exit;
        }

        // Check if email already taken by another user
        if ($email !== $user['email']) {
            $existing = $userModel->findByEmail($email);
            if ($existing) {
                FlashMessage::error('Email is already taken.');
                header('Location: /admin/profile');
                exit;
            }
        }

        $data = [
            'full_name' => $fullName,
            'email' => $email,
        ];

        // Password update
        if (!empty($_POST['password'])) {
            if (strlen($_POST['password']) < 6) {
                FlashMessage::error('Password must be at least 6 characters.');
                header('Location: /admin/profile');
                exit;
            }
            $data['password'] = password_hash($_POST['password'], PASSWORD_DEFAULT);
        }

        // Avatar update
        if (isset($_FILES['avatar']) && $_FILES['avatar']['size'] > 0) {
            $imagePath = FileUpload::uploadImage($_FILES['avatar'], 'profiles');
            if ($imagePath) {
                if (!empty($user['avatar_url'])) {
                    // Maybe don't delete immediately if it's default, but for now strict
                    // Actually, placeholder is usually static, so only delete if starts with /uploads/
                    if (str_starts_with($user['avatar_url'], '/uploads/')) {
                        FileUpload::delete($user['avatar_url']);
                    }
                }
                $data['avatar_url'] = $imagePath;
                $_SESSION['user']['avatar'] = $imagePath; // Update session
            }
        }

        $userModel->update($user['id'], $data);

        // Update session data
        $_SESSION['user']['name'] = $fullName;
        $_SESSION['user']['email'] = $email;

        FlashMessage::success('Profile updated successfully.');
        header('Location: /admin/profile');
        exit;
    }
}
