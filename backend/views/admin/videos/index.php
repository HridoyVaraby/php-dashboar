<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">ভিডিও</h1>
        <a href="/admin/videos/create" class="btn btn-primary">
            <i data-lucide="plus" class="mr-2 h-4 w-4"></i> নতুন ভিডিও
        </a>
    </div>

    <!-- Filters -->
    <div class="card p-4">
        <form action="" method="GET" class="flex flex-col gap-4 md:flex-row md:items-end">
            <div class="flex-1 space-y-2">
                <label for="search" class="text-sm font-medium">অনুসন্ধান</label>
                <input type="text" name="search" id="search" value="<?php echo htmlspecialchars($search); ?>" placeholder="ভিডিও শিরোনাম খুঁজুন..." class="input">
            </div>

            <button type="submit" class="btn btn-secondary">ফিল্টার</button>
            <?php if (!empty($search)): ?>
                <a href="/admin/videos" class="btn btn-ghost text-red-500">রিসেট</a>
            <?php endif; ?>
        </form>
    </div>

    <!-- Videos List -->
    <div class="card">
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th class="w-[100px]">থাম্বনেইল</th>
                        <th>শিরোনাম</th>
                        <th>লিঙ্ক</th>
                        <th>লেখক</th>
                        <th>তারিখ</th>
                        <th class="text-right">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($videos['data'])): ?>
                        <tr>
                            <td colspan="6" class="text-center py-8 text-muted-foreground">কোনো ভিডিও পাওয়া যায়নি</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($videos['data'] as $video): ?>
                            <tr>
                                <td>
                                    <?php if (!empty($video['thumbnail'])): ?>
                                        <img src="<?php echo htmlspecialchars($video['thumbnail']); ?>" class="h-12 w-20 rounded object-cover" alt="">
                                    <?php else: ?>
                                        <div class="h-12 w-20 rounded bg-gray-100 flex items-center justify-center">
                                            <i data-lucide="video" class="h-6 w-6 text-gray-400"></i>
                                        </div>
                                    <?php endif; ?>
                                </td>
                                <td class="font-medium max-w-[200px] truncate"><?php echo htmlspecialchars($video['title']); ?></td>
                                <td class="max-w-[150px] truncate">
                                    <a href="<?php echo htmlspecialchars($video['video_url']); ?>" target="_blank" class="text-blue-600 hover:underline flex items-center gap-1">
                                        <i data-lucide="external-link" class="h-3 w-3"></i> লিঙ্ক
                                    </a>
                                </td>
                                <td><?php echo htmlspecialchars($video['author_name'] ?? 'Unknown'); ?></td>
                                <td><?php echo \App\Helpers\DateHelper::format($video['created_at']); ?></td>
                                <td class="text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="/admin/videos/edit/<?php echo $video['id']; ?>" class="btn btn-ghost btn-icon">
                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                        </a>
                                        <form action="/admin/videos/delete/<?php echo $video['id']; ?>" method="POST" onsubmit="return confirm('আপনি কি নিশ্চিত?');">
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
        $page = $videos['current_page'];
        $totalPages = $videos['last_page'];
        $baseUrl = '/admin/videos';
        $queryParams = array_filter(['search' => $search]);
        include __DIR__ . '/../../components/pagination.php';
        ?>
    </div>
</div>
