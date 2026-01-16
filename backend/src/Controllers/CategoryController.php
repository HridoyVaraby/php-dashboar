<?php
namespace App\Controllers;

use App\Models\Category;
use App\Models\Subcategory;
use App\Helpers\FlashMessage;
use App\Helpers\Sanitizer;

class CategoryController {
    public function index(): void
    {
        $categoryModel = new Category();
        $categories = $categoryModel->all([], 0, 0, 'name ASC');

        $pageTitle = 'Categories Management';

        ob_start();
        include __DIR__ . '/../../views/admin/categories/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function store(): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/categories');
            exit;
        }

        $name = Sanitizer::clean($_POST['name'] ?? '');
        $slug = Sanitizer::clean($_POST['slug'] ?? '');

        if (empty($name) || empty($slug)) {
            FlashMessage::error('Name and Slug are required.');
            header('Location: /admin/categories');
            exit;
        }

        $categoryModel = new Category();

        // Check if slug exists
        // (Assuming we might add a findBySlug method later or use raw query, for now let's hope it's unique or DB throws error)
        // Better to check properly:
        $existing = $categoryModel->all(['slug' => $slug]);
        if (!empty($existing)) {
            FlashMessage::error('Slug already exists.');
            header('Location: /admin/categories');
            exit;
        }

        $categoryModel->create([
            'name' => $name,
            'slug' => $slug
        ]);

        FlashMessage::success('Category created successfully.');
        header('Location: /admin/categories');
        exit;
    }

    public function edit(string $id): void
    {
        $categoryModel = new Category();
        $category = $categoryModel->find($id);

        if (!$category) {
            FlashMessage::error('Category not found.');
            header('Location: /admin/categories');
            exit;
        }

        $pageTitle = 'Edit Category';

        ob_start();
        include __DIR__ . '/../../views/admin/categories/edit.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function update(string $id): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/categories/edit/' . $id);
            exit;
        }

        $name = Sanitizer::clean($_POST['name'] ?? '');
        $slug = Sanitizer::clean($_POST['slug'] ?? '');

        if (empty($name) || empty($slug)) {
            FlashMessage::error('Name and Slug are required.');
            header('Location: /admin/categories/edit/' . $id);
            exit;
        }

        $categoryModel = new Category();
        $categoryModel->update($id, [
            'name' => $name,
            'slug' => $slug
        ]);

        FlashMessage::success('Category updated successfully.');
        header('Location: /admin/categories');
        exit;
    }

    public function destroy(string $id): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/categories');
            exit;
        }

        $categoryModel = new Category();
        // Check if has posts or subcategories if needed (DB constraint might handle it)
        $categoryModel->delete($id);

        FlashMessage::success('Category deleted successfully.');
        header('Location: /admin/categories');
        exit;
    }
}
