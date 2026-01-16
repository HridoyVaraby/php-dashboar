<?php
use App\Controllers\AuthController;
use App\Controllers\DashboardController;
// Other controllers to be added as they are created

// Public routes
$router->get('/auth', [AuthController::class, 'showLogin']);
$router->post('/auth', [AuthController::class, 'login']);
$router->get('/logout', [AuthController::class, 'logout']);

// Protected admin routes
$router->get('/admin', [DashboardController::class, 'index'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\PostController;
$router->get('/admin/posts', [PostController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
$router->get('/admin/posts/create', [PostController::class, 'create'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/posts/create', [PostController::class, 'store'], [App\Middleware\AuthMiddleware::class]);
$router->get('/admin/posts/edit/{id}', [PostController::class, 'edit'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/posts/edit/{id}', [PostController::class, 'update'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/posts/delete/{id}', [PostController::class, 'destroy'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\CategoryController;
$router->get('/admin/categories', [CategoryController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/categories', [CategoryController::class, 'store'], [App\Middleware\AuthMiddleware::class]);
$router->get('/admin/categories/edit/{id}', [CategoryController::class, 'edit'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/categories/edit/{id}', [CategoryController::class, 'update'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/categories/delete/{id}', [CategoryController::class, 'destroy'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\SubcategoryController;
$router->get('/admin/subcategories', [SubcategoryController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/subcategories', [SubcategoryController::class, 'store'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/subcategories/delete/{id}', [SubcategoryController::class, 'destroy'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\TagController;
$router->get('/admin/tags', [TagController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/tags', [TagController::class, 'store'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/tags/delete/{id}', [TagController::class, 'destroy'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\UserController;
$router->get('/admin/users', [UserController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/users/update/{id}', [UserController::class, 'update'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/users/delete/{id}', [UserController::class, 'destroy'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\CommentController;
$router->get('/admin/comments', [CommentController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/comments/approve/{id}', [CommentController::class, 'approve'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/comments/delete/{id}', [CommentController::class, 'destroy'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\VideoController;
$router->get('/admin/videos', [VideoController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
$router->get('/admin/videos/create', [VideoController::class, 'create'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/videos/create', [VideoController::class, 'store'], [App\Middleware\AuthMiddleware::class]);
$router->get('/admin/videos/edit/{id}', [VideoController::class, 'edit'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/videos/edit/{id}', [VideoController::class, 'update'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/videos/delete/{id}', [VideoController::class, 'destroy'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\OpinionController;
$router->get('/admin/opinions', [OpinionController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
$router->get('/admin/opinions/create', [OpinionController::class, 'create'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/opinions/create', [OpinionController::class, 'store'], [App\Middleware\AuthMiddleware::class]);
$router->get('/admin/opinions/edit/{id}', [OpinionController::class, 'edit'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/opinions/edit/{id}', [OpinionController::class, 'update'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/opinions/delete/{id}', [OpinionController::class, 'destroy'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\NewsletterController;
$router->get('/admin/newsletter', [NewsletterController::class, 'index'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\AdController;
$router->get('/admin/ads', [AdController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
$router->get('/admin/ads/create', [AdController::class, 'create'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/ads/create', [AdController::class, 'store'], [App\Middleware\AuthMiddleware::class]);
$router->get('/admin/ads/edit/{id}', [AdController::class, 'edit'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/ads/edit/{id}', [AdController::class, 'update'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/ads/delete/{id}', [AdController::class, 'destroy'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\ProfileController;
$router->get('/admin/profile', [ProfileController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/profile', [ProfileController::class, 'update'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\SettingsController;
$router->get('/admin/settings', [SettingsController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
$router->post('/admin/settings', [SettingsController::class, 'update'], [App\Middleware\AuthMiddleware::class]);

use App\Controllers\MediaController;
$router->post('/admin/upload/image', [MediaController::class, 'uploadImage'], [App\Middleware\AuthMiddleware::class]);
