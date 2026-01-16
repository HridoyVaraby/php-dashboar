<?php
declare(strict_types=1);

use App\Helpers\Env;

// Secure session configuration
session_start([
    'cookie_httponly' => true,
    'cookie_secure' => isset($_SERVER['HTTPS']),
    'cookie_samesite' => 'Strict',
    'use_strict_mode' => true,
]);

// Autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Load Environment
Env::load(__DIR__ . '/../.env');

// Error reporting
if (Env::get('APP_ENV') === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
}

// Load configuration
$config = require __DIR__ . '/../config/app.php';

// Initialize router
$router = new App\Router();

// Load routes
require_once __DIR__ . '/../config/routes.php';

// Get request details
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path if needed
$basePath = $config['base_path'] ?? '';
if ($basePath && str_starts_with($uri, $basePath)) {
    $uri = substr($uri, strlen($basePath));
}

// Dispatch request
$router->dispatch($method, $uri ?: '/');
