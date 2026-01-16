<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">পোস্টস</h1>
        <a href="/admin/posts/create" class="btn btn-primary">
            <i data-lucide="plus" class="mr-2 h-4 w-4"></i> নতুন পোস্ট
        </a>
    </div>

    <!-- Filters -->
    <div class="card p-4">
        <form action="" method="GET" class="flex flex-col gap-4 md:flex-row md:items-end">
            <div class="flex-1 space-y-2">
                <label for="search" class="text-sm font-medium">অনুসন্ধান</label>
                <input type="text" name="search" id="search" value="<?php echo htmlspecialchars($search); ?>" placeholder="শিরোনাম খুঁজুন..." class="input">
            </div>

            <div class="w-full md:w-48 space-y-2">
                <label for="category" class="text-sm font-medium">ক্যাটেগরি</label>
                <select name="category_id" id="category" class="input">
                    <option value="">সকল ক্যাটেগরি</option>
                    <?php foreach ($categories as $category): ?>
                        <option value="<?php echo $category['id']; ?>" <?php echo $categoryId === $category['id'] ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($category['name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="w-full md:w-48 space-y-2">
                <label for="status" class="text-sm font-medium">স্ট্যাটাস</label>
                <select name="status" id="status" class="input">
                    <option value="">সকল স্ট্যাটাস</option>
                    <option value="PUBLISHED" <?php echo $status === 'PUBLISHED' ? 'selected' : ''; ?>>প্রকাশিত</option>
                    <option value="DRAFT" <?php echo $status === 'DRAFT' ? 'selected' : ''; ?>>ড্রাফট</option>
                </select>
            </div>

            <button type="submit" class="btn btn-secondary">ফিল্টার</button>
            <?php if (!empty($search) || !empty($categoryId) || !empty($status)): ?>
                <a href="/admin/posts" class="btn btn-ghost text-red-500">রিসেট</a>
            <?php endif; ?>
        </form>
    </div>

    <!-- Posts Table -->
    <div class="card">
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>শিরোনাম</th>
                        <th>ক্যাটেগরি</th>
                        <th>স্ট্যাটাস</th>
                        <th>লেখক</th>
                        <th>তারিখ</th>
                        <th class="text-right">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($posts['data'])): ?>
                        <tr>
                            <td colspan="6" class="text-center py-8 text-muted-foreground">কোনো পোস্ট পাওয়া যায়নি</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($posts['data'] as $post): ?>
                            <tr>
                                <td class="font-medium">
                                    <div class="flex items-center gap-3">
                                        <?php if (!empty($post['featured_image'])): ?>
                                            <img src="<?php echo htmlspecialchars($post['featured_image']); ?>" class="h-10 w-10 rounded object-cover" alt="">
                                        <?php endif; ?>
                                        <span><?php echo htmlspecialchars($post['title']); ?></span>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-secondary"><?php echo htmlspecialchars($post['category_name'] ?? 'Uncategorized'); ?></span>
                                </td>
                                <td>
                                    <?php if ($post['status'] === 'PUBLISHED'): ?>
                                        <span class="badge bg-green-100 text-green-700">প্রকাশিত</span>
                                    <?php else: ?>
                                        <span class="badge bg-yellow-100 text-yellow-700">ড্রাফট</span>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo htmlspecialchars($post['author_name'] ?? 'Unknown'); ?></td>
                                <td><?php echo \App\Helpers\DateHelper::format($post['created_at']); ?></td>
                                <td class="text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="/admin/posts/edit/<?php echo $post['id']; ?>" class="btn btn-ghost btn-icon">
                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                        </a>
                                        <form action="/admin/posts/delete/<?php echo $post['id']; ?>" method="POST" onsubmit="return confirm('আপনি কি নিশ্চিত যে আপনি এই পোস্টটি মুছে ফেলতে চান?');">
                                            <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">
                                            <button type="submit" class="btn btn-ghost btn-icon text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <i data-lucide="trash-2" class="h-4 w-4"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <?php
        $page = $posts['current_page'];
        $totalPages = $posts['last_page'];
        $baseUrl = '/admin/posts';
        $queryParams = array_filter([
            'search' => $search,
            'category_id' => $categoryId,
            'status' => $status
        ]);

        include __DIR__ . '/../../components/pagination.php';
        ?>
    </div>
</div>
