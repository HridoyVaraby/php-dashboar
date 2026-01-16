<?php
namespace App\Controllers;

use App\Models\Video;
use App\Helpers\FlashMessage;
use App\Helpers\Sanitizer;
use App\Helpers\FileUpload;
use App\Helpers\CSRF;

class VideoController {
    public function index(): void
    {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $search = isset($_GET['search']) ? Sanitizer::clean($_GET['search']) : '';

        $videoModel = new Video();
        $videos = $videoModel->paginate($page, 10, $search);

        $pageTitle = 'Videos Management';

        ob_start();
        include __DIR__ . '/../../views/admin/videos/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function create(): void
    {
        $pageTitle = 'Add New Video';

        ob_start();
        include __DIR__ . '/../../views/admin/videos/create.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function store(): void
    {
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/videos/create');
            exit;
        }

        $title = Sanitizer::clean($_POST['title'] ?? '');
        $videoUrl = Sanitizer::url($_POST['video_url'] ?? '');

        if (empty($title) || empty($videoUrl)) {
            FlashMessage::error('Title and Video URL are required.');
            header('Location: /admin/videos/create');
            exit;
        }

        $data = [
            'title' => $title,
            'video_url' => $videoUrl,
            'description' => Sanitizer::clean($_POST['description'] ?? ''),
            'author_id' => $_SESSION['user']['id'],
        ];

        if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['size'] > 0) {
            $imagePath = FileUpload::uploadImage($_FILES['thumbnail'], 'videos');
            if ($imagePath) {
                $data['thumbnail'] = $imagePath;
            } else {
                FlashMessage::error('Failed to upload thumbnail.');
                header('Location: /admin/videos/create');
                exit;
            }
        }

        $videoModel = new Video();
        $videoModel->create($data);

        FlashMessage::success('Video added successfully.');
        header('Location: /admin/videos');
        exit;
    }

    public function edit(string $id): void
    {
        $videoModel = new Video();
        $video = $videoModel->find($id);

        if (!$video) {
            FlashMessage::error('Video not found.');
            header('Location: /admin/videos');
            exit;
        }

        $pageTitle = 'Edit Video';

        ob_start();
        include __DIR__ . '/../../views/admin/videos/edit.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function update(string $id): void
    {
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/videos/edit/' . $id);
            exit;
        }

        $videoModel = new Video();
        $video = $videoModel->find($id);

        if (!$video) {
            FlashMessage::error('Video not found.');
            header('Location: /admin/videos');
            exit;
        }

        $title = Sanitizer::clean($_POST['title'] ?? '');
        $videoUrl = Sanitizer::url($_POST['video_url'] ?? '');

        if (empty($title) || empty($videoUrl)) {
            FlashMessage::error('Title and Video URL are required.');
            header('Location: /admin/videos/edit/' . $id);
            exit;
        }

        $data = [
            'title' => $title,
            'video_url' => $videoUrl,
            'description' => Sanitizer::clean($_POST['description'] ?? ''),
        ];

        if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['size'] > 0) {
            $imagePath = FileUpload::uploadImage($_FILES['thumbnail'], 'videos');
            if ($imagePath) {
                if (!empty($video['thumbnail'])) {
                    FileUpload::delete($video['thumbnail']);
                }
                $data['thumbnail'] = $imagePath;
            }
        }

        $videoModel->update($id, $data);

        FlashMessage::success('Video updated successfully.');
        header('Location: /admin/videos');
        exit;
    }

    public function destroy(string $id): void
    {
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/videos');
            exit;
        }

        $videoModel = new Video();
        $video = $videoModel->find($id);

        if ($video) {
            if (!empty($video['thumbnail'])) {
                FileUpload::delete($video['thumbnail']);
            }
            $videoModel->delete($id);
            FlashMessage::success('Video deleted successfully.');
        } else {
            FlashMessage::error('Video not found.');
        }

        header('Location: /admin/videos');
        exit;
    }
}
