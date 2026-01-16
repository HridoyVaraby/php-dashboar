<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">বিজ্ঞাপন</h1>
        <a href="/admin/ads/create" class="btn btn-primary">
            <i data-lucide="plus" class="mr-2 h-4 w-4"></i> নতুন বিজ্ঞাপন
        </a>
    </div>

    <!-- Ads List -->
    <div class="card">
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th class="w-[150px]">প্রিভিউ</th>
                        <th>শিরোনাম</th>
                        <th>লিঙ্ক</th>
                        <th>লোকেশন</th>
                        <th>স্ট্যাটাস</th>
                        <th class="text-right">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($ads['data'])): ?>
                        <tr>
                            <td colspan="6" class="text-center py-8 text-muted-foreground">কোনো বিজ্ঞাপন পাওয়া যায়নি</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($ads['data'] as $ad): ?>
                            <tr>
                                <td>
                                    <?php if (!empty($ad['image_url'])): ?>
                                        <img src="<?php echo htmlspecialchars($ad['image_url']); ?>" class="h-16 w-auto rounded object-contain bg-gray-100" alt="">
                                    <?php else: ?>
                                        <div class="h-16 w-24 rounded bg-gray-100 flex items-center justify-center">
                                            <i data-lucide="image" class="h-6 w-6 text-gray-400"></i>
                                        </div>
                                    <?php endif; ?>
                                </td>
                                <td class="font-medium"><?php echo htmlspecialchars($ad['title']); ?></td>
                                <td class="max-w-[150px] truncate">
                                    <a href="<?php echo htmlspecialchars($ad['link_url']); ?>" target="_blank" class="text-blue-600 hover:underline flex items-center gap-1">
                                        <i data-lucide="external-link" class="h-3 w-3"></i> লিঙ্ক
                                    </a>
                                </td>
                                <td>
                                    <span class="badge badge-secondary"><?php echo htmlspecialchars($ad['location']); ?></span>
                                </td>
                                <td>
                                    <?php if ($ad['is_active']): ?>
                                        <span class="badge bg-green-100 text-green-800">অ্যাক্টিভ</span>
                                    <?php else: ?>
                                        <span class="badge bg-gray-100 text-gray-800">নিষ্ক্রিয়</span>
                                    <?php endif; ?>
                                </td>
                                <td class="text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="/admin/ads/edit/<?php echo $ad['id']; ?>" class="btn btn-ghost btn-icon">
                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                        </a>
                                        <form action="/admin/ads/delete/<?php echo $ad['id']; ?>" method="POST" onsubmit="return confirm('আপনি কি নিশ্চিত?');">
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
        $page = $ads['current_page'];
        $totalPages = $ads['last_page'];
        $baseUrl = '/admin/ads';
        include __DIR__ . '/../../components/pagination.php';
        ?>
    </div>
</div>
