<?php
namespace App\Controllers;

use App\Models\Advertisement;
use App\Helpers\FlashMessage;
use App\Helpers\Sanitizer;
use App\Helpers\FileUpload;
use App\Helpers\CSRF;

class AdController {
    public function index(): void
    {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;

        $adModel = new Advertisement();
        $ads = $adModel->paginate($page, 10);

        $pageTitle = 'Advertisements Management';

        ob_start();
        include __DIR__ . '/../../views/admin/ads/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function create(): void
    {
        $pageTitle = 'Add New Advertisement';

        ob_start();
        include __DIR__ . '/../../views/admin/ads/create.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function store(): void
    {
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/ads/create');
            exit;
        }

        $title = Sanitizer::clean($_POST['title'] ?? '');
        $linkUrl = Sanitizer::url($_POST['link_url'] ?? '');
        $location = Sanitizer::clean($_POST['location'] ?? '');

        if (empty($title) || empty($linkUrl) || empty($location)) {
            FlashMessage::error('Title, Link URL and Location are required.');
            header('Location: /admin/ads/create');
            exit;
        }

        $data = [
            'title' => $title,
            'link_url' => $linkUrl,
            'location' => $location,
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
        ];

        if (isset($_FILES['image']) && $_FILES['image']['size'] > 0) {
            $imagePath = FileUpload::uploadImage($_FILES['image'], 'ads');
            if ($imagePath) {
                $data['image_url'] = $imagePath;
            } else {
                FlashMessage::error('Failed to upload image.');
                header('Location: /admin/ads/create');
                exit;
            }
        } else {
            FlashMessage::error('Image is required.');
            header('Location: /admin/ads/create');
            exit;
        }

        $adModel = new Advertisement();
        $adModel->create($data);

        FlashMessage::success('Advertisement created successfully.');
        header('Location: /admin/ads');
        exit;
    }

    public function edit(string $id): void
    {
        $adModel = new Advertisement();
        $ad = $adModel->find($id);

        if (!$ad) {
            FlashMessage::error('Advertisement not found.');
            header('Location: /admin/ads');
            exit;
        }

        $pageTitle = 'Edit Advertisement';

        ob_start();
        include __DIR__ . '/../../views/admin/ads/edit.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function update(string $id): void
    {
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/ads/edit/' . $id);
            exit;
        }

        $adModel = new Advertisement();
        $ad = $adModel->find($id);

        if (!$ad) {
            FlashMessage::error('Advertisement not found.');
            header('Location: /admin/ads');
            exit;
        }

        $title = Sanitizer::clean($_POST['title'] ?? '');
        $linkUrl = Sanitizer::url($_POST['link_url'] ?? '');
        $location = Sanitizer::clean($_POST['location'] ?? '');

        if (empty($title) || empty($linkUrl) || empty($location)) {
            FlashMessage::error('Title, Link URL and Location are required.');
            header('Location: /admin/ads/edit/' . $id);
            exit;
        }

        $data = [
            'title' => $title,
            'link_url' => $linkUrl,
            'location' => $location,
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
        ];

        if (isset($_FILES['image']) && $_FILES['image']['size'] > 0) {
            $imagePath = FileUpload::uploadImage($_FILES['image'], 'ads');
            if ($imagePath) {
                if (!empty($ad['image_url'])) {
                    FileUpload::delete($ad['image_url']);
                }
                $data['image_url'] = $imagePath;
            }
        }

        $adModel->update($id, $data);

        FlashMessage::success('Advertisement updated successfully.');
        header('Location: /admin/ads');
        exit;
    }

    public function destroy(string $id): void
    {
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/ads');
            exit;
        }

        $adModel = new Advertisement();
        $ad = $adModel->find($id);

        if ($ad) {
            if (!empty($ad['image_url'])) {
                FileUpload::delete($ad['image_url']);
            }
            $adModel->delete($id);
            FlashMessage::success('Advertisement deleted successfully.');
        } else {
            FlashMessage::error('Advertisement not found.');
        }

        header('Location: /admin/ads');
        exit;
    }
}
