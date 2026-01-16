<div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">ভিডিও এডিট করুন</h1>
        <a href="/admin/videos" class="btn btn-ghost">
            <i data-lucide="arrow-left" class="mr-2 h-4 w-4"></i> ফিরে যান
        </a>
    </div>

    <form action="/admin/videos/edit/<?php echo $video['id']; ?>" method="POST" enctype="multipart/form-data" class="space-y-6">
        <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">

        <div class="card p-6 space-y-4">
            <div class="space-y-2">
                <label for="title" class="label">শিরোনাম <span class="text-red-500">*</span></label>
                <input type="text" id="title" name="title" value="<?php echo htmlspecialchars($video['title']); ?>" required class="input">
            </div>

            <div class="space-y-2">
                <label for="video_url" class="label">ভিডিও লিঙ্ক <span class="text-red-500">*</span></label>
                <input type="url" id="video_url" name="video_url" value="<?php echo htmlspecialchars($video['video_url']); ?>" required class="input">
            </div>

            <div class="space-y-2">
                <label for="description" class="label">বিবরণ</label>
                <textarea id="description" name="description" rows="3" class="input"><?php echo htmlspecialchars($video['description'] ?? ''); ?></textarea>
            </div>

            <div class="space-y-2">
                <label for="thumbnail" class="label">থাম্বনেইল</label>
                <?php if (!empty($video['thumbnail'])): ?>
                    <div class="w-40 h-24 rounded overflow-hidden bg-gray-100 mb-2">
                        <img src="<?php echo htmlspecialchars($video['thumbnail']); ?>" class="w-full h-full object-cover">
                    </div>
                <?php endif; ?>
                <input type="file" id="thumbnail" name="thumbnail" accept="image/*" class="input py-1.5">
            </div>

            <div class="pt-4">
                <button type="submit" class="btn btn-primary w-full md:w-auto">আপডেট করুন</button>
            </div>
        </div>
    </form>
</div>
