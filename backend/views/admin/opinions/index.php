<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">মতামত</h1>
        <a href="/admin/opinions/create" class="btn btn-primary">
            <i data-lucide="plus" class="mr-2 h-4 w-4"></i> নতুন মতামত
        </a>
    </div>

    <!-- Filters -->
    <div class="card p-4">
        <form action="" method="GET" class="flex flex-col gap-4 md:flex-row md:items-end">
            <div class="flex-1 space-y-2">
                <label for="search" class="text-sm font-medium">অনুসন্ধান</label>
                <input type="text" name="search" id="search" value="<?php echo htmlspecialchars($search); ?>" placeholder="শিরোনাম বা লেখকের নাম খুঁজুন..." class="input">
            </div>

            <button type="submit" class="btn btn-secondary">ফিল্টার</button>
            <?php if (!empty($search)): ?>
                <a href="/admin/opinions" class="btn btn-ghost text-red-500">রিসেট</a>
            <?php endif; ?>
        </form>
    </div>

    <!-- Opinions List -->
    <div class="card">
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th class="w-[80px]">ছবি</th>
                        <th>লেখক</th>
                        <th>শিরোনাম</th>
                        <th>তারিখ</th>
                        <th class="text-right">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($opinions['data'])): ?>
                        <tr>
                            <td colspan="5" class="text-center py-8 text-muted-foreground">কোনো মতামত পাওয়া যায়নি</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($opinions['data'] as $opinion): ?>
                            <tr>
                                <td>
                                    <?php if (!empty($opinion['author_image'])): ?>
                                        <img src="<?php echo htmlspecialchars($opinion['author_image']); ?>" class="h-10 w-10 rounded-full object-cover" alt="">
                                    <?php else: ?>
                                        <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <i data-lucide="user" class="h-5 w-5 text-gray-400"></i>
                                        </div>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <div class="font-medium"><?php echo htmlspecialchars($opinion['author_name']); ?></div>
                                    <div class="text-xs text-muted-foreground"><?php echo htmlspecialchars($opinion['author_role'] ?? ''); ?></div>
                                </td>
                                <td class="font-medium max-w-[300px] truncate"><?php echo htmlspecialchars($opinion['title']); ?></td>
                                <td><?php echo \App\Helpers\DateHelper::format($opinion['created_at']); ?></td>
                                <td class="text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="/admin/opinions/edit/<?php echo $opinion['id']; ?>" class="btn btn-ghost btn-icon">
                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                        </a>
                                        <form action="/admin/opinions/delete/<?php echo $opinion['id']; ?>" method="POST" onsubmit="return confirm('আপনি কি নিশ্চিত?');">
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
        $page = $opinions['current_page'];
        $totalPages = $opinions['last_page'];
        $baseUrl = '/admin/opinions';
        $queryParams = array_filter(['search' => $search]);
        include __DIR__ . '/../../components/pagination.php';
        ?>
    </div>
</div>
