<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">সাবক্যাটেগরি</h1>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
        <!-- Create Subcategory Form -->
        <div class="card p-6">
            <h2 class="text-xl font-semibold mb-4">নতুন সাবক্যাটেগরি</h2>
            <form action="/admin/subcategories" method="POST" class="space-y-4">
                <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">
                <div class="space-y-2">
                    <label for="parent_category_id" class="label">মূল ক্যাটেগরি <span class="text-red-500">*</span></label>
                    <select id="parent_category_id" name="parent_category_id" required class="input">
                        <option value="">নির্বাচন করুন</option>
                        <?php foreach ($categories as $category): ?>
                            <option value="<?php echo $category['id']; ?>">
                                <?php echo htmlspecialchars($category['name']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="space-y-2">
                    <label for="name" class="label">নাম <span class="text-red-500">*</span></label>
                    <input type="text" id="name" name="name" required class="input" placeholder="সাবক্যাটেগরির নাম" onkeyup="generateSlug(this.value)">
                </div>

                <div class="space-y-2">
                    <label for="slug" class="label">স্লাগ <span class="text-red-500">*</span></label>
                    <input type="text" id="slug" name="slug" required class="input" placeholder="subcategory-slug">
                </div>

                <button type="submit" class="btn btn-primary w-full">তৈরি করুন</button>
            </form>
        </div>

        <!-- Subcategories List -->
        <div class="md:col-span-2 card">
            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>নাম</th>
                            <th>মূল ক্যাটেগরি</th>
                            <th>স্লাগ</th>
                            <th class="text-right">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($subcategories)): ?>
                            <tr>
                                <td colspan="4" class="text-center py-8 text-muted-foreground">কোনো সাবক্যাটেগরি পাওয়া যায়নি</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($subcategories as $subcategory): ?>
                                <tr>
                                    <td class="font-medium"><?php echo htmlspecialchars($subcategory['name']); ?></td>
                                    <td>
                                        <span class="badge badge-secondary"><?php echo htmlspecialchars($subcategory['parent_name']); ?></span>
                                    </td>
                                    <td><?php echo htmlspecialchars($subcategory['slug']); ?></td>
                                    <td class="text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <!-- Edit not implemented yet for simplicity in this pass, can add if critical -->
                                            <form action="/admin/subcategories/delete/<?php echo $subcategory['id']; ?>" method="POST" onsubmit="return confirm('আপনি কি নিশ্চিত?');">
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
