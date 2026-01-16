<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">ক্যাটেগরি</h1>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
        <!-- Create Category Form -->
        <div class="card p-6">
            <h2 class="text-xl font-semibold mb-4">নতুন ক্যাটেগরি</h2>
            <form action="/admin/categories" method="POST" class="space-y-4">
                <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">
                <div class="space-y-2">
                    <label for="name" class="label">নাম <span class="text-red-500">*</span></label>
                    <input type="text" id="name" name="name" required class="input" placeholder="ক্যাটেগরির নাম" onkeyup="generateSlug(this.value)">
                </div>

                <div class="space-y-2">
                    <label for="slug" class="label">স্লাগ <span class="text-red-500">*</span></label>
                    <input type="text" id="slug" name="slug" required class="input" placeholder="category-slug">
                </div>

                <button type="submit" class="btn btn-primary w-full">তৈরি করুন</button>
            </form>
        </div>

        <!-- Categories List -->
        <div class="md:col-span-2 card">
            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>নাম</th>
                            <th>স্লাগ</th>
                            <th>সাবক্যাটেগরি</th>
                            <th class="text-right">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($categories)): ?>
                            <tr>
                                <td colspan="4" class="text-center py-8 text-muted-foreground">কোনো ক্যাটেগরি পাওয়া যায়নি</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($categories as $category): ?>
                                <tr>
                                    <td class="font-medium"><?php echo htmlspecialchars($category['name']); ?></td>
                                    <td>
                                        <span class="badge badge-secondary"><?php echo htmlspecialchars($category['slug']); ?></span>
                                    </td>
                                    <td>
                                        <!-- Count subcategories if possible, or leave blank for now -->
                                        -
                                    </td>
                                    <td class="text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <a href="/admin/categories/edit/<?php echo $category['id']; ?>" class="btn btn-ghost btn-icon">
                                                <i data-lucide="edit" class="h-4 w-4"></i>
                                            </a>
                                            <form action="/admin/categories/delete/<?php echo $category['id']; ?>" method="POST" onsubmit="return confirm('আপনি কি নিশ্চিত যে আপনি এই ক্যাটেগরি মুছে ফেলতে চান? এটি সম্পর্কিত পোস্ট এবং সাবক্যাটেগরিগুলোকে প্রভাবিত করতে পারে।');">
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
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/--+/g, '-');    // Replace multiple - with single -
    slugInput.value = slug;
}
</script>
