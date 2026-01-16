<?php
namespace App\Controllers;

use App\Models\Opinion;
use App\Helpers\FlashMessage;
use App\Helpers\Sanitizer;
use App\Helpers\FileUpload;
use App\Helpers\CSRF;

class OpinionController {
    public function index(): void
    {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $search = isset($_GET['search']) ? Sanitizer::clean($_GET['search']) : '';

        $opinionModel = new Opinion();
        $opinions = $opinionModel->paginate($page, 10, $search);

        $pageTitle = 'Opinions Management';

        ob_start();
        include __DIR__ . '/../../views/admin/opinions/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function create(): void
    {
        $pageTitle = 'Add New Opinion';

        ob_start();
        include __DIR__ . '/../../views/admin/opinions/create.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function store(): void
    {
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/opinions/create');
            exit;
        }

        $title = Sanitizer::clean($_POST['title'] ?? '');
        $authorName = Sanitizer::clean($_POST['author_name'] ?? '');

        if (empty($title) || empty($authorName)) {
            FlashMessage::error('Title and Author Name are required.');
            header('Location: /admin/opinions/create');
            exit;
        }

        $data = [
            'title' => $title,
            'author_name' => $authorName,
            'author_role' => Sanitizer::clean($_POST['author_role'] ?? ''),
            'excerpt' => Sanitizer::clean($_POST['excerpt'] ?? ''),
            'content' => $_POST['content'] ?? '',
            'created_by' => $_SESSION['user']['id'],
        ];

        if (isset($_FILES['author_image']) && $_FILES['author_image']['size'] > 0) {
            $imagePath = FileUpload::uploadImage($_FILES['author_image'], 'opinions');
            if ($imagePath) {
                $data['author_image'] = $imagePath;
            } else {
                FlashMessage::error('Failed to upload author image.');
                header('Location: /admin/opinions/create');
                exit;
            }
        }

        $opinionModel = new Opinion();
        $opinionModel->create($data);

        FlashMessage::success('Opinion created successfully.');
        header('Location: /admin/opinions');
        exit;
    }

    public function edit(string $id): void
    {
        $opinionModel = new Opinion();
        $opinion = $opinionModel->find($id);

        if (!$opinion) {
            FlashMessage::error('Opinion not found.');
            header('Location: /admin/opinions');
            exit;
        }

        $pageTitle = 'Edit Opinion';

        ob_start();
        include __DIR__ . '/../../views/admin/opinions/edit.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function update(string $id): void
    {
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/opinions/edit/' . $id);
            exit;
        }

        $opinionModel = new Opinion();
        $opinion = $opinionModel->find($id);

        if (!$opinion) {
            FlashMessage::error('Opinion not found.');
            header('Location: /admin/opinions');
            exit;
        }

        $title = Sanitizer::clean($_POST['title'] ?? '');
        $authorName = Sanitizer::clean($_POST['author_name'] ?? '');

        if (empty($title) || empty($authorName)) {
            FlashMessage::error('Title and Author Name are required.');
            header('Location: /admin/opinions/edit/' . $id);
            exit;
        }

        $data = [
            'title' => $title,
            'author_name' => $authorName,
            'author_role' => Sanitizer::clean($_POST['author_role'] ?? ''),
            'excerpt' => Sanitizer::clean($_POST['excerpt'] ?? ''),
            'content' => $_POST['content'] ?? '',
        ];

        if (isset($_FILES['author_image']) && $_FILES['author_image']['size'] > 0) {
            $imagePath = FileUpload::uploadImage($_FILES['author_image'], 'opinions');
            if ($imagePath) {
                if (!empty($opinion['author_image'])) {
                    FileUpload::delete($opinion['author_image']);
                }
                $data['author_image'] = $imagePath;
            }
        }

        $opinionModel->update($id, $data);

        FlashMessage::success('Opinion updated successfully.');
        header('Location: /admin/opinions');
        exit;
    }

    public function destroy(string $id): void
    {
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/opinions');
            exit;
        }

        $opinionModel = new Opinion();
        $opinion = $opinionModel->find($id);

        if ($opinion) {
            if (!empty($opinion['author_image'])) {
                FileUpload::delete($opinion['author_image']);
            }
            $opinionModel->delete($id);
            FlashMessage::success('Opinion deleted successfully.');
        } else {
            FlashMessage::error('Opinion not found.');
        }

        header('Location: /admin/opinions');
        exit;
    }
}
