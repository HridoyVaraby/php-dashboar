<?php
namespace App\Controllers;

use App\Models\User;
use App\Helpers\FlashMessage;
use App\Helpers\Sanitizer;

class UserController {
    public function index(): void
    {
        $userModel = new User();
        $users = $userModel->all([], 0, 0, 'created_at DESC');

        $pageTitle = 'Users Management';

        ob_start();
        include __DIR__ . '/../../views/admin/users/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function update(string $id): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/users');
            exit;
        }

        $role = Sanitizer::clean($_POST['role'] ?? '');
        $isSuspended = isset($_POST['is_suspended']) ? 1 : 0;

        if (empty($role) || !in_array($role, ['ADMIN', 'EDITOR', 'READER'])) {
            FlashMessage::error('Invalid role.');
            header('Location: /admin/users');
            exit;
        }

        if ($id === $_SESSION['user']['id'] && $role !== 'ADMIN') {
             FlashMessage::error('You cannot change your own role.');
             header('Location: /admin/users');
             exit;
        }

        $userModel = new User();
        $userModel->update($id, [
            'role' => $role,
            'is_suspended' => $isSuspended
        ]);

        FlashMessage::success('User updated successfully.');
        header('Location: /admin/users');
        exit;
    }

    public function destroy(string $id): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/users');
            exit;
        }

        if ($id === $_SESSION['user']['id']) {
            FlashMessage::error('You cannot delete your own account.');
            header('Location: /admin/users');
            exit;
        }

        $userModel = new User();
        $userModel->delete($id);

        FlashMessage::success('User deleted successfully.');
        header('Location: /admin/users');
        exit;
    }
}
