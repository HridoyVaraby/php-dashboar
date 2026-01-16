<div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">নতুন বিজ্ঞাপন যোগ করুন</h1>
        <a href="/admin/ads" class="btn btn-ghost">
            <i data-lucide="arrow-left" class="mr-2 h-4 w-4"></i> ফিরে যান
        </a>
    </div>

    <form action="/admin/ads/create" method="POST" enctype="multipart/form-data" class="space-y-6">
        <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">

        <div class="card p-6 space-y-4">
            <div class="space-y-2">
                <label for="title" class="label">শিরোনাম <span class="text-red-500">*</span></label>
                <input type="text" id="title" name="title" required class="input" placeholder="বিজ্ঞাপনের শিরোনাম">
            </div>

            <div class="space-y-2">
                <label for="link_url" class="label">লিঙ্ক <span class="text-red-500">*</span></label>
                <input type="url" id="link_url" name="link_url" required class="input" placeholder="https://example.com/...">
            </div>

            <div class="space-y-2">
                <label for="location" class="label">লোকেশন <span class="text-red-500">*</span></label>
                <select id="location" name="location" required class="input">
                    <option value="">নির্বাচন করুন</option>
                    <option value="HEADER">হেডার (Header)</option>
                    <option value="SIDEBAR">সাইডবার (Sidebar)</option>
                    <option value="CONTENT_TOP">কন্টেন্ট এর উপরে (Content Top)</option>
                    <option value="CONTENT_BOTTOM">কন্টেন্ট এর নিচে (Content Bottom)</option>
                    <option value="FOOTER">ফুটার (Footer)</option>
                </select>
            </div>

            <div class="space-y-2">
                <label for="image" class="label">ব্যানার ইমেজ <span class="text-red-500">*</span></label>
                <input type="file" id="image" name="image" accept="image/*" required class="input py-1.5">
            </div>

            <div class="flex items-center gap-2 pt-2">
                <input type="checkbox" id="is_active" name="is_active" class="rounded border-gray-300" checked>
                <label for="is_active" class="text-sm font-medium">সক্রিয় (Active)</label>
            </div>

            <div class="pt-4">
                <button type="submit" class="btn btn-primary w-full md:w-auto">সেভ করুন</button>
            </div>
        </div>
    </form>
</div>
