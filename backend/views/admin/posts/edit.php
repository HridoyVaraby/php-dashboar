<div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">পোস্ট এডিট করুন</h1>
        <a href="/admin/posts" class="btn btn-ghost">
            <i data-lucide="arrow-left" class="mr-2 h-4 w-4"></i> ফিরে যান
        </a>
    </div>

    <form action="/admin/posts/edit/<?php echo $post['id']; ?>" method="POST" enctype="multipart/form-data" class="space-y-8">
        <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">
        <div class="grid gap-6 md:grid-cols-3">
            <!-- Main Content -->
            <div class="md:col-span-2 space-y-6">
                <div class="card p-6 space-y-4">
                    <div class="space-y-2">
                        <label for="title" class="label">শিরোনাম <span class="text-red-500">*</span></label>
                        <input type="text" id="title" name="title" value="<?php echo htmlspecialchars($post['title']); ?>" required class="input text-lg">
                    </div>

                    <div class="space-y-2">
                        <label for="excerpt" class="label">সারাংশ</label>
                        <textarea id="excerpt" name="excerpt" rows="3" class="input"><?php echo htmlspecialchars($post['excerpt'] ?? ''); ?></textarea>
                    </div>

                    <div class="space-y-2">
                        <label for="content" class="label">বিস্তারিত বিষয়বস্তু</label>
                        <textarea id="content" name="content" class="rich-editor"><?php echo htmlspecialchars($post['content']); ?></textarea>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Publish Options -->
                <div class="card p-6 space-y-4">
                    <h3 class="font-semibold text-lg">পাবলিশ অপশন</h3>

                    <div class="space-y-2">
                        <label for="status" class="label">স্ট্যাটাস</label>
                        <select id="status" name="status" class="input">
                            <option value="DRAFT" <?php echo $post['status'] === 'DRAFT' ? 'selected' : ''; ?>>ড্রাফট</option>
                            <option value="PUBLISHED" <?php echo $post['status'] === 'PUBLISHED' ? 'selected' : ''; ?>>প্রকাশিত</option>
                        </select>
                    </div>

                    <div class="pt-4">
                        <button type="submit" class="btn btn-primary w-full">আপডেট করুন</button>
                    </div>
                </div>

                <!-- Organization -->
                <div class="card p-6 space-y-4">
                    <h3 class="font-semibold text-lg">অর্গানাইজেশন</h3>

                    <div class="space-y-2">
                        <label for="category_id" class="label">ক্যাটেগরি <span class="text-red-500">*</span></label>
                        <select id="category_id" name="category_id" required class="input">
                            <option value="">ক্যাটেগরি নির্বাচন করুন</option>
                            <?php foreach ($categories as $category): ?>
                                <option value="<?php echo $category['id']; ?>" <?php echo $post['category_id'] === $category['id'] ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($category['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <!-- Featured Image -->
                <div class="card p-6 space-y-4">
                    <h3 class="font-semibold text-lg">ফিচারড ইমেজ</h3>
                    <?php if (!empty($post['featured_image'])): ?>
                        <div class="aspect-video w-full rounded-md overflow-hidden bg-gray-100 mb-2">
                            <img src="<?php echo htmlspecialchars($post['featured_image']); ?>" class="w-full h-full object-cover">
                        </div>
                    <?php endif; ?>
                    <div class="space-y-2">
                        <input type="file" id="featured_image" name="featured_image" accept="image/*" class="input py-1.5">
                        <p class="text-xs text-muted-foreground">নতুন ছবি আপলোড করলে আগেরটি প্রতিস্থাপিত হবে</p>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
