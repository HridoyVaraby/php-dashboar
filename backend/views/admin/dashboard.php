<div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <!-- Posts -->
        <div class="card p-6">
            <div class="flex items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium text-muted-foreground">মোট পোস্ট</h3>
                <i data-lucide="file-text" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="text-2xl font-bold"><?php echo $stats['posts']; ?></div>
            <p class="text-xs text-muted-foreground">+২০.১% গত মাসের থেকে</p>
        </div>

        <!-- Videos -->
        <div class="card p-6">
            <div class="flex items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium text-muted-foreground">মোট ভিডিও</h3>
                <i data-lucide="video" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="text-2xl font-bold"><?php echo $stats['videos']; ?></div>
            <p class="text-xs text-muted-foreground">+১৫% গত মাসের থেকে</p>
        </div>

        <!-- Opinions -->
        <div class="card p-6">
            <div class="flex items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium text-muted-foreground">মোট মতামত</h3>
                <i data-lucide="pen-tool" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="text-2xl font-bold"><?php echo $stats['opinions']; ?></div>
            <p class="text-xs text-muted-foreground">+৫% গত মাসের থেকে</p>
        </div>

        <!-- Comments -->
        <div class="card p-6">
            <div class="flex items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium text-muted-foreground">মোট মন্তব্য</h3>
                <i data-lucide="message-square" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="text-2xl font-bold"><?php echo $stats['comments']; ?></div>
            <p class="text-xs text-muted-foreground">+১০% গত মাসের থেকে</p>
        </div>

        <!-- Users -->
        <div class="card p-6">
            <div class="flex items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium text-muted-foreground">মোট ইউজার</h3>
                <i data-lucide="users" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="text-2xl font-bold"><?php echo $stats['users']; ?></div>
            <p class="text-xs text-muted-foreground">+২% গত মাসের থেকে</p>
        </div>

        <!-- Categories -->
        <div class="card p-6">
            <div class="flex items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium text-muted-foreground">ক্যাটেগরি</h3>
                <i data-lucide="tag" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="text-2xl font-bold"><?php echo $stats['categories']; ?></div>
            <p class="text-xs text-muted-foreground">৪টি সাবক্যাটেগরি</p>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <a href="/admin/posts/create" class="card p-4 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center gap-2">
            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <i data-lucide="plus-circle" class="h-6 w-6"></i>
            </div>
            <span class="font-medium">নতুন পোস্ট তৈরি করুন</span>
        </a>

        <a href="/admin/videos/create" class="card p-4 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center gap-2">
            <div class="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <i data-lucide="video" class="h-6 w-6"></i>
            </div>
            <span class="font-medium">নতুন ভিডিও যোগ করুন</span>
        </a>

        <a href="/admin/comments" class="card p-4 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center gap-2">
            <div class="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <i data-lucide="message-square" class="h-6 w-6"></i>
            </div>
            <span class="font-medium">মন্তব্য মডারেট করুন</span>
        </a>

        <a href="/admin/categories" class="card p-4 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center gap-2">
            <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <i data-lucide="tag" class="h-6 w-6"></i>
            </div>
            <span class="font-medium">ক্যাটেগরি ম্যানেজ করুন</span>
        </a>
    </div>

    <!-- Recent Activity -->
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">সাম্প্রতিক পোস্ট</h3>
            <p class="card-description">সর্বশেষ প্রকাশিত পোস্টগুলোর তালিকা</p>
        </div>
        <div class="card-content">
            <div class="relative w-full overflow-auto">
                <table class="table w-full caption-bottom text-sm">
                    <thead>
                        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">শিরোনাম</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ক্যাটেগরি</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">লেখক</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">তারিখ</th>
                        </tr>
                    </thead>
                    <tbody class="[&_tr:last-child]:border-0">
                        <?php if (empty($recentPosts)): ?>
                            <tr>
                                <td colspan="4" class="p-4 text-center text-muted-foreground">কোনো তথ্য পাওয়া যায়নি</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($recentPosts as $post): ?>
                                <tr class="border-b transition-colors hover:bg-muted/50">
                                    <td class="p-4 align-middle font-medium"><?php echo htmlspecialchars($post['title']); ?></td>
                                    <td class="p-4 align-middle">
                                        <span class="badge badge-secondary"><?php echo htmlspecialchars($post['category_name'] ?? 'N/A'); ?></span>
                                    </td>
                                    <td class="p-4 align-middle"><?php echo htmlspecialchars($post['author_name'] ?? 'Unknown'); ?></td>
                                    <td class="p-4 align-middle"><?php echo date('d M Y', strtotime($post['created_at'])); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
