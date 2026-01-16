<div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">মতামত এডিট করুন</h1>
        <a href="/admin/opinions" class="btn btn-ghost">
            <i data-lucide="arrow-left" class="mr-2 h-4 w-4"></i> ফিরে যান
        </a>
    </div>

    <form action="/admin/opinions/edit/<?php echo $opinion['id']; ?>" method="POST" enctype="multipart/form-data" class="space-y-6">
        <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">

        <div class="grid gap-6 md:grid-cols-3">
            <!-- Main Content -->
            <div class="md:col-span-2 space-y-6">
                <div class="card p-6 space-y-4">
                    <div class="space-y-2">
                        <label for="title" class="label">শিরোনাম <span class="text-red-500">*</span></label>
                        <input type="text" id="title" name="title" value="<?php echo htmlspecialchars($opinion['title']); ?>" required class="input">
                    </div>

                    <div class="space-y-2">
                        <label for="excerpt" class="label">সারাংশ</label>
                        <textarea id="excerpt" name="excerpt" rows="3" class="input"><?php echo htmlspecialchars($opinion['excerpt'] ?? ''); ?></textarea>
                    </div>

                    <div class="space-y-2">
                        <label for="content" class="label">বিস্তারিত বিষয়বস্তু</label>
                        <textarea id="content" name="content" class="rich-editor"><?php echo htmlspecialchars($opinion['content']); ?></textarea>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <div class="card p-6 space-y-4">
                    <h3 class="font-semibold text-lg">লেখকের তথ্য</h3>

                    <div class="space-y-2">
                        <label for="author_name" class="label">লেখকের নাম <span class="text-red-500">*</span></label>
                        <input type="text" id="author_name" name="author_name" value="<?php echo htmlspecialchars($opinion['author_name']); ?>" required class="input">
                    </div>

                    <div class="space-y-2">
                        <label for="author_role" class="label">পদবী/পরিচয়</label>
                        <input type="text" id="author_role" name="author_role" value="<?php echo htmlspecialchars($opinion['author_role'] ?? ''); ?>" class="input">
                    </div>

                    <div class="space-y-2">
                        <label for="author_image" class="label">লেখকের ছবি</label>
                        <?php if (!empty($opinion['author_image'])): ?>
                            <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-2">
                                <img src="<?php echo htmlspecialchars($opinion['author_image']); ?>" class="w-full h-full object-cover">
                            </div>
                        <?php endif; ?>
                        <input type="file" id="author_image" name="author_image" accept="image/*" class="input py-1.5">
                    </div>

                    <div class="pt-4">
                        <button type="submit" class="btn btn-primary w-full">আপডেট করুন</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
