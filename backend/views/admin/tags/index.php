<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">ট্যাগস</h1>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
        <!-- Create Tag Form -->
        <div class="card p-6">
            <h2 class="text-xl font-semibold mb-4">নতুন ট্যাগ</h2>
            <form action="/admin/tags" method="POST" class="space-y-4">
                <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">
                <div class="space-y-2">
                    <label for="name" class="label">নাম <span class="text-red-500">*</span></label>
                    <input type="text" id="name" name="name" required class="input" placeholder="ট্যাগের নাম" onkeyup="generateSlug(this.value)">
                </div>

                <div class="space-y-2">
                    <label for="slug" class="label">স্লাগ <span class="text-red-500">*</span></label>
                    <input type="text" id="slug" name="slug" required class="input" placeholder="tag-slug">
                </div>

                <button type="submit" class="btn btn-primary w-full">তৈরি করুন</button>
            </form>
        </div>

        <!-- Tags List -->
        <div class="md:col-span-2 card">
            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>নাম</th>
                            <th>স্লাগ</th>
                            <th class="text-right">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($tags)): ?>
                            <tr>
                                <td colspan="3" class="text-center py-8 text-muted-foreground">কোনো ট্যাগ পাওয়া যায়নি</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($tags as $tag): ?>
                                <tr>
                                    <td class="font-medium"><?php echo htmlspecialchars($tag['name']); ?></td>
                                    <td>
                                        <span class="badge badge-secondary"><?php echo htmlspecialchars($tag['slug']); ?></span>
                                    </td>
                                    <td class="text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <form action="/admin/tags/delete/<?php echo $tag['id']; ?>" method="POST" onsubmit="return confirm('আপনি কি নিশ্চিত?');">
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
        </div>
    </div>
</div>

<script>
function generateSlug(text) {
    const slugInput = document.getElementById('slug');
    const slug = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
    slugInput.value = slug;
}
</script>
