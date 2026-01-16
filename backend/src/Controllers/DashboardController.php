<?php
namespace App\Controllers;

use App\Models\Model;
use PDO;

class DashboardController {
    public function index(): void
    {
        $pdo = Model::getConnection();

        // Fetch stats
        $stats = [
            'posts' => $pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn(),
            'videos' => $pdo->query("SELECT COUNT(*) FROM videos")->fetchColumn(),
            'opinions' => $pdo->query("SELECT COUNT(*) FROM opinions")->fetchColumn(),
            'comments' => $pdo->query("SELECT COUNT(*) FROM comments")->fetchColumn(),
            'users' => $pdo->query("SELECT COUNT(*) FROM profiles")->fetchColumn(),
            'categories' => $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn(),
        ];

        // Fetch recent activity (union of posts, comments, videos)
        // This is a simplified version. For a real activity feed, we might want a dedicated table or a more complex query.
        // For now, let's just show recent posts.
        $recentPosts = $pdo->query("
            SELECT p.*, c.name as category_name, u.full_name as author_name
            FROM posts p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN profiles u ON p.author_id = u.id
            ORDER BY p.created_at DESC
            LIMIT 5
        ")->fetchAll();

        $pageTitle = 'Dashboard';

        ob_start();
        include __DIR__ . '/../../views/admin/dashboard.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }
}
