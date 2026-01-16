<div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">নতুন পোস্ট তৈরি করুন</h1>
        <a href="/admin/posts" class="btn btn-ghost">
            <i data-lucide="arrow-left" class="mr-2 h-4 w-4"></i> ফিরে যান
        </a>
    </div>

    <form action="/admin/posts/create" method="POST" enctype="multipart/form-data" class="space-y-8">
        <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">
        <div class="grid gap-6 md:grid-cols-3">
            <!-- Main Content -->
            <div class="md:col-span-2 space-y-6">
                <div class="card p-6 space-y-4">
                    <div class="space-y-2">
                        <label for="title" class="label">শিরোনাম <span class="text-red-500">*</span></label>
                        <input type="text" id="title" name="title" required class="input text-lg" placeholder="পোস্টের শিরোনাম লিখুন">
                    </div>

                    <div class="space-y-2">
                        <label for="excerpt" class="label">সারাংশ</label>
                        <textarea id="excerpt" name="excerpt" rows="3" class="input" placeholder="ছোট বিবরণ..."></textarea>
                    </div>

                    <div class="space-y-2">
                        <label for="content" class="label">বিস্তারিত বিষয়বস্তু</label>
                        <textarea id="content" name="content" class="rich-editor"></textarea>
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
                            <option value="DRAFT">ড্রাফট</option>
                            <option value="PUBLISHED">প্রকাশিত</option>
                        </select>
                    </div>

                    <div class="pt-4">
                        <button type="submit" class="btn btn-primary w-full">সেভ করুন</button>
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
                                <option value="<?php echo $category['id']; ?>">
                                    <?php echo htmlspecialchars($category['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <!-- Featured Image -->
                <div class="card p-6 space-y-4">
                    <h3 class="font-semibold text-lg">ফিচারড ইমেজ</h3>
                    <div class="space-y-2">
                        <input type="file" id="featured_image" name="featured_image" accept="image/*" class="input py-1.5">
                        <p class="text-xs text-muted-foreground">Recommended size: 1200x630px</p>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
