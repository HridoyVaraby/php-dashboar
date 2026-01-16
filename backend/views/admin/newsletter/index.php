<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">নিউজলেটার সাবস্ক্রাইবার</h1>
        <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground">মোট সাবস্ক্রাইবার: <?php echo $subscribers['total']; ?></span>
            <button class="btn btn-outline" onclick="window.print()">
                <i data-lucide="printer" class="mr-2 h-4 w-4"></i> প্রিন্ট
            </button>
        </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
        <form action="" method="GET" class="flex flex-col gap-4 md:flex-row md:items-end">
            <div class="flex-1 space-y-2">
                <label for="search" class="text-sm font-medium">অনুসন্ধান</label>
                <input type="text" name="search" id="search" value="<?php echo htmlspecialchars($search); ?>" placeholder="ইমেইল খুঁজুন..." class="input">
            </div>

            <button type="submit" class="btn btn-secondary">ফিল্টার</button>
            <?php if (!empty($search)): ?>
                <a href="/admin/newsletter" class="btn btn-ghost text-red-500">রিসেট</a>
            <?php endif; ?>
        </form>
    </div>

    <!-- Subscribers List -->
    <div class="card">
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>ইমেইল</th>
                        <th>সাবস্ক্রিপশন তারিখ</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($subscribers['data'])): ?>
                        <tr>
                            <td colspan="2" class="text-center py-8 text-muted-foreground">কোনো সাবস্ক্রাইবার পাওয়া যায়নি</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($subscribers['data'] as $subscriber): ?>
                            <tr>
                                <td class="font-medium"><?php echo htmlspecialchars($subscriber['email']); ?></td>
                                <td><?php echo \App\Helpers\DateHelper::format($subscriber['created_at']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <?php
        $page = $subscribers['current_page'];
        $totalPages = $subscribers['last_page'];
        $baseUrl = '/admin/newsletter';
        $queryParams = array_filter(['search' => $search]);
        include __DIR__ . '/../../components/pagination.php';
        ?>
    </div>
</div>
