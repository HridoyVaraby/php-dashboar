<?php
namespace App\Controllers;

use App\Models\NewsletterSubscriber;
use App\Helpers\Sanitizer;

class NewsletterController {
    public function index(): void
    {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $search = isset($_GET['search']) ? Sanitizer::clean($_GET['search']) : '';

        $subscriberModel = new NewsletterSubscriber();
        $subscribers = $subscriberModel->paginate($page, 20, $search);

        $pageTitle = 'Newsletter Subscribers';

        ob_start();
        include __DIR__ . '/../../views/admin/newsletter/index.php';
        $content = ob_get_clean();

        include __DIR__ . '/../../views/layouts/admin_layout.php';
    }
}
