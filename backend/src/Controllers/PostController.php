    public function destroy(string $id): void
    {
        // CSRF check
        if (!\App\Helpers\CSRF::verify($_POST['csrf_token'] ?? '')) {
            FlashMessage::error('Invalid security token.');
            header('Location: /admin/posts');
            exit;
        }

        $postModel = new Post();
