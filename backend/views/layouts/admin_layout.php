<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle ?? 'Admin Panel'; ?> - NewsViewBD</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- TinyMCE -->
    <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
</head>
<body class="bg-gray-50 font-bangla">
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside class="hidden w-64 overflow-y-auto border-r bg-white md:block">
            <div class="flex h-16 items-center border-b px-6">
                <a href="/admin" class="flex items-center gap-2 font-bold text-xl">
                    <img src="/assets/logo.svg" alt="Logo" class="h-8 w-8">
                    <span>NewsViewBD</span>
                </a>
            </div>
            <div class="p-4">
                <?php include __DIR__ . '/../components/sidebar.php'; ?>
            </div>
            <div class="mt-auto border-t p-4">
                <div class="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <img src="<?php echo $_SESSION['user']['avatar'] ?? '/assets/avatar-placeholder.png'; ?>" alt="User" class="h-10 w-10 rounded-full">
                    <div class="flex flex-col">
                        <span class="text-sm font-medium"><?php echo htmlspecialchars($_SESSION['user']['name'] ?? 'User'); ?></span>
                        <span class="text-xs text-gray-500"><?php echo htmlspecialchars($_SESSION['user']['role'] ?? 'Role'); ?></span>
                    </div>
                </div>
                <a href="/logout" class="mt-2 flex w-full items-center justify-center gap-2 rounded-md border p-2 text-sm font-medium hover:bg-gray-50">
                    <i data-lucide="log-out" class="h-4 w-4"></i>
                    লগআউট
                </a>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex flex-1 flex-col overflow-hidden">
            <!-- Header -->
            <header class="flex h-16 items-center justify-between border-b bg-white px-6">
                <button class="md:hidden">
                    <i data-lucide="menu" class="h-6 w-6"></i>
                </button>
                <div class="flex items-center gap-4">
                    <a href="/" target="_blank" class="text-sm font-medium text-gray-600 hover:text-gray-900">
                        সাইট দেখুন
                        <i data-lucide="external-link" class="ml-1 inline h-3 w-3"></i>
                    </a>
                </div>
            </header>

            <!-- Page Content -->
            <main class="flex-1 overflow-y-auto p-6">
                <?php if (isset($content)) echo $content; ?>
            </main>
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
    <script src="/js/app.js"></script>
</body>
</html>
