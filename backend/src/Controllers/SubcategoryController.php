<?php
namespace App\Controllers;

use App\Models\Category;
use App\Models\Subcategory;
use App\Helpers\FlashMessage;
use App\Helpers\Sanitizer;
use App\Models\Model; // For raw queries if needed

class SubcategoryController {
    public function index(): void
    {
        $subcategoryModel = new Subcategory();
        // Fetch subcategories with parent category name
        // We'll need a custom query or method in model for joining
        // For now, let's fetch all and manually join or use a raw query

        $pdo = Model::getConnection();
        $stmt = $pdo->prepare("
            SELECT s.*, c.name as parent_name
            FROM subcategories s
            JOIN categories c ON s.parent_category_id = c.id
            ORDER BY c.name ASC, s.name ASC
        ");
        $stmt->execute();
        $subcategories = $stmt->fetchAll();

        $categoryModel = new Category();
        $categories = $categoryModel->all([], 0, 0, 'name ASC');

        $pageTitle = 'Subcategories Management';

        ob_start();
        include __DIR__ . '/../../views/admin/subcategories/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function store(): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/subcategories');
            exit;
        }

        $name = Sanitizer::clean($_POST['name'] ?? '');
        $slug = Sanitizer::clean($_POST['slug'] ?? '');
        $parentId = Sanitizer::clean($_POST['parent_category_id'] ?? '');

        if (empty($name) || empty($slug) || empty($parentId)) {
            FlashMessage::error('Name, Slug and Parent Category are required.');
            header('Location: /admin/subcategories');
            exit;
        }

        $subcategoryModel = new Subcategory();
        $existing = $subcategoryModel->all(['slug' => $slug]);
        if (!empty($existing)) {
            FlashMessage::error('Slug already exists.');
            header('Location: /admin/subcategories');
            exit;
        }

        $subcategoryModel->create([
            'name' => $name,
            'slug' => $slug,
            'parent_category_id' => $parentId
        ]);

        FlashMessage::success('Subcategory created successfully.');
        header('Location: /admin/subcategories');
        exit;
    }

    public function destroy(string $id): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/subcategories');
            exit;
        }

        $subcategoryModel = new Subcategory();
        $subcategoryModel->delete($id);

        FlashMessage::success('Subcategory deleted successfully.');
        header('Location: /admin/subcategories');
        exit;
    }
}
