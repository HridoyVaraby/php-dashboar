<?php
use App\Helpers\Env;

return [
    'app_name' => Env::get('APP_NAME', 'NewsViewBD Admin'),
    'base_url' => Env::get('APP_URL', 'http://localhost:8000'),
    'base_path' => '', // Set if installed in subdirectory
    'env' => Env::get('APP_ENV', 'production'),
];
