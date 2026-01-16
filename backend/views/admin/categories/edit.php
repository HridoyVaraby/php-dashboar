<div class="max-w-md mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">ক্যাটেগরি এডিট</h1>
        <a href="/admin/categories" class="btn btn-ghost">
            <i data-lucide="arrow-left" class="mr-2 h-4 w-4"></i> ফিরে যান
        </a>
    </div>

    <div class="card p-6">
        <form action="/admin/categories/edit/<?php echo $category['id']; ?>" method="POST" class="space-y-4">
            <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">
            <div class="space-y-2">
                <label for="name" class="label">নাম <span class="text-red-500">*</span></label>
                <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($category['name']); ?>" required class="input" onkeyup="generateSlug(this.value)">
            </div>

            <div class="space-y-2">
                <label for="slug" class="label">স্লাগ <span class="text-red-500">*</span></label>
                <input type="text" id="slug" name="slug" value="<?php echo htmlspecialchars($category['slug']); ?>" required class="input">
            </div>

            <button type="submit" class="btn btn-primary w-full">আপডেট করুন</button>
        </form>
    </div>
</div>

<script>
function generateSlug(text) {
    // Only auto-generate if user hasn't manually edited slug (optional logic, simplified here)
    // const slugInput = document.getElementById('slug');
    // ...
}
</script>
