<?php
namespace App\Controllers;

use App\Models\Comment;
use App\Models\Model;
use App\Helpers\FlashMessage;

class CommentController {
    public function index(): void
    {
        $commentModel = new Comment();

        // Fetch comments with post title and user name
        $pdo = Model::getConnection();
        $stmt = $pdo->prepare("
            SELECT c.*, p.title as post_title, u.full_name as author_name, u.avatar_url
            FROM comments c
            JOIN posts p ON c.post_id = p.id
            JOIN profiles u ON c.user_id = u.id
            ORDER BY c.created_at DESC
        ");
        $stmt->execute();
        $comments = $stmt->fetchAll();

        $pageTitle = 'Comments Moderation';

        ob_start();
        include __DIR__ . '/../../views/admin/comments/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function approve(string $id): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/comments');
            exit;
        }

        $commentModel = new Comment();
        $commentModel->update($id, ['is_approved' => 1]);

        FlashMessage::success('Comment approved successfully.');
        header('Location: /admin/comments');
        exit;
    }

    public function destroy(string $id): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/comments');
            exit;
        }

        $commentModel = new Comment();
        $commentModel->delete($id);

        FlashMessage::success('Comment deleted successfully.');
        header('Location: /admin/comments');
        exit;
    }
}
