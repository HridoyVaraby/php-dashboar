<?php
namespace App\Controllers;

use App\Models\SiteSettings;
use App\Helpers\FlashMessage;
use App\Helpers\Sanitizer;
use App\Helpers\FileUpload;
use App\Helpers\CSRF;

class SettingsController {
    public function index(): void
    {
        $settingsModel = new SiteSettings();
        $settings = $settingsModel->getSettings();

        $pageTitle = 'Site Settings';

        ob_start();
        include __DIR__ . '/../../views/admin/settings/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }

    public function update(): void
    {
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/settings');
            exit;
        }

        $settingsModel = new SiteSettings();
        $settings = $settingsModel->getSettings();
        $id = $settings['id'];

        $data = [
            'site_name' => Sanitizer::clean($_POST['site_name'] ?? ''),
            'site_description' => Sanitizer::clean($_POST['site_description'] ?? ''),
            'site_url' => Sanitizer::url($_POST['site_url'] ?? ''),
            'contact_email' => Sanitizer::email($_POST['contact_email'] ?? ''),
            'social_facebook' => Sanitizer::url($_POST['social_facebook'] ?? ''),
            'social_twitter' => Sanitizer::url($_POST['social_twitter'] ?? ''),
            'social_youtube' => Sanitizer::url($_POST['social_youtube'] ?? ''),
            'posts_per_page' => (int)($_POST['posts_per_page'] ?? 10),
            'enable_comments' => isset($_POST['enable_comments']) ? 1 : 0,
            'enable_newsletter' => isset($_POST['enable_newsletter']) ? 1 : 0,
            'enable_ads' => isset($_POST['enable_ads']) ? 1 : 0,
            'maintenance_mode' => isset($_POST['maintenance_mode']) ? 1 : 0,
        ];

        // Logo upload
        if (isset($_FILES['logo']) && $_FILES['logo']['size'] > 0) {
            $imagePath = FileUpload::uploadImage($_FILES['logo'], 'settings');
            if ($imagePath) {
                $data['logo_url'] = $imagePath;
            }
        }

        // Favicon upload
        if (isset($_FILES['favicon']) && $_FILES['favicon']['size'] > 0) {
            $imagePath = FileUpload::uploadImage($_FILES['favicon'], 'settings');
            if ($imagePath) {
                $data['favicon_url'] = $imagePath;
            }
        }

        $settingsModel->update($id, $data);

        FlashMessage::success('Settings updated successfully.');
        header('Location: /admin/settings');
        exit;
    }
}
