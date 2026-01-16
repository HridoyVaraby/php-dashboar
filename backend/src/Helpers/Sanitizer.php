<?php
namespace App\Helpers;

class Sanitizer {
    public static function clean(string $input): string
    {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }

    public static function email(string $input): string
    {
        return filter_var(trim($input), FILTER_SANITIZE_EMAIL);
    }

    public static function url(string $input): string
    {
        return filter_var(trim($input), FILTER_SANITIZE_URL);
    }
}
