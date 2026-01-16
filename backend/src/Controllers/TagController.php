<?php
namespace App\Controllers;

use App\Models\Tag;
use App\Helpers\FlashMessage;
use App\Helpers\Sanitizer;

class TagController {
    public function index(): void
    {
        $tagModel = new Tag();
        $tags = $tagModel->all([], 0, 0, 'name ASC');

        $pageTitle = 'Tags Management';

        ob_start();
        include __DIR__ . '/../../views/admin/tags/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function store(): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/tags');
            exit;
        }

        $name = Sanitizer::clean($_POST['name'] ?? '');
        $slug = Sanitizer::clean($_POST['slug'] ?? '');

        if (empty($name) || empty($slug)) {
            FlashMessage::error('Name and Slug are required.');
            header('Location: /admin/tags');
            exit;
        }

        $tagModel = new Tag();
        $existing = $tagModel->all(['slug' => $slug]);
        if (!empty($existing)) {
            FlashMessage::error('Slug already exists.');
            header('Location: /admin/tags');
            exit;
        }

        $tagModel->create([
            'name' => $name,
            'slug' => $slug
        ]);

        FlashMessage::success('Tag created successfully.');
        header('Location: /admin/tags');
        exit;
    }

    public function destroy(string $id): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/tags');
            exit;
        }

        $tagModel = new Tag();
        $tagModel->delete($id);

        FlashMessage::success('Tag deleted successfully.');
        header('Location: /admin/tags');
        exit;
    }
}
