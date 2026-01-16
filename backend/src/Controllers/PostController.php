<?php
namespace App\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Helpers\FlashMessage;
use App\Helpers\Sanitizer;
use App\Helpers\FileUpload;
use App\Helpers\CSRF;

class PostController {
    public function index(): void
    {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $search = isset($_GET['search']) ? Sanitizer::clean($_GET['search']) : '';
        $categoryId = isset($_GET['category_id']) ? Sanitizer::clean($_GET['category_id']) : '';
        $status = isset($_GET['status']) ? Sanitizer::clean($_GET['status']) : '';

        $postModel = new Post();
        $categoryModel = new Category();

        $posts = $postModel->paginate($page, 10, [
            'search' => $search,
            'category_id' => $categoryId,
            'status' => $status
        ]);

        $categories = $categoryModel->all([], 0, 0, 'name ASC');

        $pageTitle = 'Posts Management';

        ob_start();
        include __DIR__ . '/../../views/admin/posts/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function create(): void
    {
        $categoryModel = new Category();
        $categories = $categoryModel->all([], 0, 0, 'name ASC');

        $pageTitle = 'Create New Post';

        ob_start();
        include __DIR__ . '/../../views/admin/posts/create.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function store(): void
    {
        // CSRF check
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/posts/create');
            exit;
        }

        $title = Sanitizer::clean($_POST['title'] ?? '');
        $categoryId = Sanitizer::clean($_POST['category_id'] ?? '');
        $status = Sanitizer::clean($_POST['status'] ?? 'DRAFT');
        $content = $_POST['content'] ?? ''; // Rich text

        if (empty($title) || empty($categoryId)) {
            FlashMessage::error('Title and Category are required.');
            header('Location: /admin/posts/create');
            exit;
        }

        $data = [
            'title' => $title,
            'category_id' => $categoryId,
            'status' => $status,
            'content' => $content,
            'author_id' => $_SESSION['user']['id'],
            'excerpt' => Sanitizer::clean($_POST['excerpt'] ?? ''),
        ];

        if (isset($_FILES['featured_image']) && $_FILES['featured_image']['size'] > 0) {
            $imagePath = FileUpload::uploadImage($_FILES['featured_image'], 'posts');
            if ($imagePath) {
                $data['featured_image'] = $imagePath;
            } else {
                FlashMessage::error('Failed to upload image. Please check file type and size.');
                header('Location: /admin/posts/create');
                exit;
            }
        }

        $postModel = new Post();
        $postModel->create($data);

        FlashMessage::success('Post created successfully.');
        header('Location: /admin/posts');
        exit;
    }

    public function edit(string $id): void
    {
        $postModel = new Post();
        $post = $postModel->find($id);

        if (!$post) {
            FlashMessage::error('Post not found.');
            header('Location: /admin/posts');
            exit;
        }

        $categoryModel = new Category();
        $categories = $categoryModel->all([], 0, 0, 'name ASC');

        $pageTitle = 'Edit Post';

        ob_start();
        include __DIR__ . '/../../views/admin/posts/edit.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function update(string $id): void
    {
        // CSRF check
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/posts/edit/' . $id);
            exit;
        }

        $postModel = new Post();
        $post = $postModel->find($id);

        if (!$post) {
            FlashMessage::error('Post not found.');
            header('Location: /admin/posts');
            exit;
        }

        $title = Sanitizer::clean($_POST['title'] ?? '');
        $categoryId = Sanitizer::clean($_POST['category_id'] ?? '');
        $status = Sanitizer::clean($_POST['status'] ?? 'DRAFT');
        $content = $_POST['content'] ?? '';

        if (empty($title) || empty($categoryId)) {
            FlashMessage::error('Title and Category are required.');
            header('Location: /admin/posts/edit/' . $id);
            exit;
        }

        $data = [
            'title' => $title,
            'category_id' => $categoryId,
            'status' => $status,
            'content' => $content,
            'excerpt' => Sanitizer::clean($_POST['excerpt'] ?? ''),
        ];

        if (isset($_FILES['featured_image']) && $_FILES['featured_image']['size'] > 0) {
            $imagePath = FileUpload::uploadImage($_FILES['featured_image'], 'posts');
            if ($imagePath) {
                // Delete old image
                if (!empty($post['featured_image'])) {
                    FileUpload::delete($post['featured_image']);
                }
                $data['featured_image'] = $imagePath;
            }
        }

        $postModel->update($id, $data);

        FlashMessage::success('Post updated successfully.');
        header('Location: /admin/posts');
        exit;
    }

    public function destroy(string $id): void
    {
        // CSRF check
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/posts');
            exit;
        }

        $postModel = new Post();
        $post = $postModel->find($id);

        if ($post) {
            if (!empty($post['featured_image'])) {
                FileUpload::delete($post['featured_image']);
            }
            $postModel->delete($id);
            FlashMessage::success('Post deleted successfully.');
        } else {
            FlashMessage::error('Post not found.');
        }

        header('Location: /admin/posts');
        exit;
    }
}
