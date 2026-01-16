<?php
$currentUri = $_SERVER['REQUEST_URI'];
$menuItems = [
    [
        'title' => 'ড্যাশবোর্ড',
        'icon' => 'layout-dashboard',
        'href' => '/admin',
    ],
    [
        'title' => 'পোস্টস',
        'icon' => 'file-text',
        'href' => '/admin/posts',
    ],
    [
        'title' => 'ক্যাটেগরি',
        'icon' => 'tag',
        'href' => '/admin/categories',
    ],
    [
        'title' => 'সাবক্যাটেগরি',
        'icon' => 'folder-tree',
        'href' => '/admin/subcategories',
    ],
    [
        'title' => 'ট্যাগস',
        'icon' => 'tags',
        'href' => '/admin/tags',
    ],
    [
        'title' => 'মন্তব্য',
        'icon' => 'message-square',
        'href' => '/admin/comments',
    ],
    [
        'title' => 'ভিডিও',
        'icon' => 'video',
        'href' => '/admin/videos',
    ],
    [
        'title' => 'মতামত',
        'icon' => 'pen-tool',
        'href' => '/admin/opinions',
    ],
    [
        'title' => 'ইউজার',
        'icon' => 'users',
        'href' => '/admin/users',
    ],
    [
        'title' => 'নিউজলেটার',
        'icon' => 'mail',
        'href' => '/admin/newsletter',
    ],
    [
        'title' => 'বিজ্ঞাপন',
        'icon' => 'bar-chart-big',
        'href' => '/admin/ads',
    ],
    [
        'title' => 'প্রোফাইল',
        'icon' => 'user',
        'href' => '/admin/profile',
    ],
    [
        'title' => 'সেটিংস',
        'icon' => 'settings',
        'href' => '/admin/settings',
    ],
];
?>

<nav class="space-y-1">
    <?php foreach ($menuItems as $item): ?>
        <?php
        $isActive = $currentUri === $item['href'] || (strlen($item['href']) > 7 && str_starts_with($currentUri, $item['href']));
        ?>
        <a href="<?php echo $item['href']; ?>"
           class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors <?php echo $isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'; ?>">
            <i data-lucide="<?php echo $item['icon']; ?>" class="h-4 w-4"></i>
            <?php echo $item['title']; ?>
        </a>
    <?php endforeach; ?>
</nav>
