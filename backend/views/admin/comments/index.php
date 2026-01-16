<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">মন্তব্য</h1>
    </div>

    <div class="card">
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th class="w-[300px]">মন্তব্য</th>
                        <th>পোস্ট</th>
                        <th>লেখক</th>
                        <th>তারিখ</th>
                        <th>স্ট্যাটাস</th>
                        <th class="text-right">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($comments)): ?>
                        <tr>
                            <td colspan="6" class="text-center py-8 text-muted-foreground">কোনো মন্তব্য পাওয়া যায়নি</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($comments as $comment): ?>
                            <tr>
                                <td class="align-top">
                                    <p class="line-clamp-2 text-sm"><?php echo htmlspecialchars($comment['content']); ?></p>
                                </td>
                                <td class="align-top">
                                    <span class="text-sm font-medium line-clamp-1"><?php echo htmlspecialchars($comment['post_title']); ?></span>
                                </td>
                                <td class="align-top">
                                    <div class="flex items-center gap-2">
                                        <img src="<?php echo !empty($comment['avatar_url']) ? htmlspecialchars($comment['avatar_url']) : '/assets/avatar-placeholder.png'; ?>" class="h-6 w-6 rounded-full" alt="">
                                        <span class="text-sm"><?php echo htmlspecialchars($comment['author_name']); ?></span>
                                    </div>
                                </td>
                                <td class="align-top text-sm text-muted-foreground">
                                    <?php echo \App\Helpers\DateHelper::timeAgo($comment['created_at']); ?>
                                </td>
                                <td class="align-top">
                                    <?php if ($comment['is_approved']): ?>
                                        <span class="badge bg-green-100 text-green-800">অনুমোদিত</span>
                                    <?php else: ?>
                                        <span class="badge bg-yellow-100 text-yellow-800">অপেক্ষমান</span>
                                    <?php endif; ?>
                                </td>
                                <td class="align-top text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <?php if (!$comment['is_approved']): ?>
                                            <form action="/admin/comments/approve/<?php echo $comment['id']; ?>" method="POST">
                                                <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">
                                                <button type="submit" class="btn btn-ghost btn-icon text-green-600 hover:text-green-800 hover:bg-green-50" title="অনুমোদন করুন">
                                                    <i data-lucide="check" class="h-4 w-4"></i>
                                                </button>
                                            </form>
                                        <?php endif; ?>

                                        <form action="/admin/comments/delete/<?php echo $comment['id']; ?>" method="POST" onsubmit="return confirm('আপনি কি নিশ্চিত?');">
                                            <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">
                                            <button type="submit" class="btn btn-ghost btn-icon text-red-500 hover:text-red-700 hover:bg-red-50" title="মুছে ফেলুন">
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
    </div>
</div>
