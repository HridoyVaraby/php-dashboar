<div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">বিজ্ঞাপন এডিট করুন</h1>
        <a href="/admin/ads" class="btn btn-ghost">
            <i data-lucide="arrow-left" class="mr-2 h-4 w-4"></i> ফিরে যান
        </a>
    </div>

    <form action="/admin/ads/edit/<?php echo $ad['id']; ?>" method="POST" enctype="multipart/form-data" class="space-y-6">
        <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">

        <div class="card p-6 space-y-4">
            <div class="space-y-2">
                <label for="title" class="label">শিরোনাম <span class="text-red-500">*</span></label>
                <input type="text" id="title" name="title" value="<?php echo htmlspecialchars($ad['title']); ?>" required class="input">
            </div>

            <div class="space-y-2">
                <label for="link_url" class="label">লিঙ্ক <span class="text-red-500">*</span></label>
                <input type="url" id="link_url" name="link_url" value="<?php echo htmlspecialchars($ad['link_url']); ?>" required class="input">
            </div>

            <div class="space-y-2">
                <label for="location" class="label">লোকেশন <span class="text-red-500">*</span></label>
                <select id="location" name="location" required class="input">
                    <option value="">নির্বাচন করুন</option>
                    <option value="HEADER" <?php echo $ad['location'] === 'HEADER' ? 'selected' : ''; ?>>হেডার (Header)</option>
                    <option value="SIDEBAR" <?php echo $ad['location'] === 'SIDEBAR' ? 'selected' : ''; ?>>সাইডবার (Sidebar)</option>
                    <option value="CONTENT_TOP" <?php echo $ad['location'] === 'CONTENT_TOP' ? 'selected' : ''; ?>>কন্টেন্ট এর উপরে (Content Top)</option>
                    <option value="CONTENT_BOTTOM" <?php echo $ad['location'] === 'CONTENT_BOTTOM' ? 'selected' : ''; ?>>কন্টেন্ট এর নিচে (Content Bottom)</option>
                    <option value="FOOTER" <?php echo $ad['location'] === 'FOOTER' ? 'selected' : ''; ?>>ফুটার (Footer)</option>
                </select>
            </div>

            <div class="space-y-2">
                <label for="image" class="label">ব্যানার ইমেজ</label>
                <?php if (!empty($ad['image_url'])): ?>
                    <div class="h-32 w-auto inline-block rounded overflow-hidden bg-gray-100 mb-2">
                        <img src="<?php echo htmlspecialchars($ad['image_url']); ?>" class="h-full w-auto object-contain">
                    </div>
                <?php endif; ?>
                <input type="file" id="image" name="image" accept="image/*" class="input py-1.5">
            </div>

            <div class="flex items-center gap-2 pt-2">
                <input type="checkbox" id="is_active" name="is_active" class="rounded border-gray-300" <?php echo $ad['is_active'] ? 'checked' : ''; ?>>
                <label for="is_active" class="text-sm font-medium">সক্রিয় (Active)</label>
            </div>

            <div class="pt-4">
                <button type="submit" class="btn btn-primary w-full md:w-auto">আপডেট করুন</button>
            </div>
        </div>
    </form>
</div>
