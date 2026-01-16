<?php
namespace App\Helpers;

class FileUpload {
    private static array $allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    private static int $maxSize = 5 * 1024 * 1024; // 5MB

    public static function uploadImage(array $file, string $directory = 'images'): ?string
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        if (!in_array($file['type'], self::$allowedImageTypes)) {
            return null;
        }

        if ($file['size'] > self::$maxSize) {
            return null;
        }

        $uploadDir = __DIR__ . '/../../public/uploads/' . $directory . '/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '_' . time() . '.' . $extension;
        $destination = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return '/uploads/' . $directory . '/' . $filename;
        }

        return null;
    }

    public static function delete(string $path): bool
    {
        $fullPath = __DIR__ . '/../../public' . $path;
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }
        return false;
    }
}
