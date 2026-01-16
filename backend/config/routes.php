<?php
use App\Controllers\AuthController;
use App\Controllers\DashboardController;
// Other controllers to be added as they are created

// Public routes
$router->get('/auth', [AuthController::class, 'showLogin']);
$router->post('/auth', [AuthController::class, 'login']);
$router->get('/logout', [AuthController::class, 'logout']);

// Protected admin routes will be added here
// $router->get('/admin', [DashboardController::class, 'index'], [App\Middleware\AuthMiddleware::class]);
