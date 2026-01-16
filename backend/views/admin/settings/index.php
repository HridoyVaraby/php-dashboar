<div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">সাইট সেটিংস</h1>
    </div>

    <form action="/admin/settings" method="POST" enctype="multipart/form-data" class="space-y-6">
        <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">

        <div class="grid gap-6 md:grid-cols-2">
            <!-- General Settings -->
            <div class="card p-6 space-y-4">
                <h3 class="font-semibold text-lg border-b pb-2">সাধারণ তথ্য</h3>

                <div class="space-y-2">
                    <label for="site_name" class="label">সাইটের নাম</label>
                    <input type="text" id="site_name" name="site_name" value="<?php echo htmlspecialchars($settings['site_name']); ?>" required class="input">
                </div>

                <div class="space-y-2">
                    <label for="site_description" class="label">বিবরণ</label>
                    <textarea id="site_description" name="site_description" rows="3" class="input"><?php echo htmlspecialchars($settings['site_description']); ?></textarea>
                </div>

                <div class="space-y-2">
                    <label for="site_url" class="label">সাইট URL</label>
                    <input type="url" id="site_url" name="site_url" value="<?php echo htmlspecialchars($settings['site_url']); ?>" required class="input">
                </div>

                <div class="space-y-2">
                    <label for="contact_email" class="label">যোগাযোগের ইমেইল</label>
                    <input type="email" id="contact_email" name="contact_email" value="<?php echo htmlspecialchars($settings['contact_email']); ?>" required class="input">
                </div>
            </div>

            <!-- Media Settings -->
            <div class="card p-6 space-y-4">
                <h3 class="font-semibold text-lg border-b pb-2">লোগো এবং আইকন</h3>

                <div class="space-y-2">
                    <label class="label">বর্তমান লোগো</label>
                    <div class="p-4 border rounded bg-gray-50 flex items-center justify-center">
                        <img src="<?php echo htmlspecialchars($settings['logo_url']); ?>" class="h-12 w-auto object-contain">
                    </div>
                    <label for="logo" class="label">লোগো পরিবর্তন</label>
                    <input type="file" id="logo" name="logo" accept="image/*" class="input py-1.5">
                </div>

                <div class="space-y-2">
                    <label class="label">বর্তমান ফেভিকন</label>
                    <div class="p-4 border rounded bg-gray-50 flex items-center justify-center">
                        <img src="<?php echo htmlspecialchars($settings['favicon_url']); ?>" class="h-8 w-8 object-contain">
                    </div>
                    <label for="favicon" class="label">ফেভিকন পরিবর্তন</label>
                    <input type="file" id="favicon" name="favicon" accept="image/*" class="input py-1.5">
                </div>
            </div>

            <!-- Social Links -->
            <div class="card p-6 space-y-4">
                <h3 class="font-semibold text-lg border-b pb-2">সোশ্যাল মিডিয়া</h3>

                <div class="space-y-2">
                    <label for="social_facebook" class="label">Facebook Page URL</label>
                    <input type="url" id="social_facebook" name="social_facebook" value="<?php echo htmlspecialchars($settings['social_facebook']); ?>" class="input">
                </div>

                <div class="space-y-2">
                    <label for="social_twitter" class="label">Twitter/X Profile URL</label>
                    <input type="url" id="social_twitter" name="social_twitter" value="<?php echo htmlspecialchars($settings['social_twitter']); ?>" class="input">
                </div>

                <div class="space-y-2">
                    <label for="social_youtube" class="label">YouTube Channel URL</label>
                    <input type="url" id="social_youtube" name="social_youtube" value="<?php echo htmlspecialchars($settings['social_youtube']); ?>" class="input">
                </div>
            </div>

            <!-- Config & Features -->
            <div class="card p-6 space-y-4">
                <h3 class="font-semibold text-lg border-b pb-2">ফিচার ও কনফিগারেশন</h3>

                <div class="space-y-2">
                    <label for="posts_per_page" class="label">প্রতি পেজে পোস্ট সংখ্যা</label>
                    <input type="number" id="posts_per_page" name="posts_per_page" value="<?php echo (int)$settings['posts_per_page']; ?>" min="1" max="100" class="input">
                </div>

                <div class="space-y-4 pt-2">
                    <div class="flex items-center gap-2">
                        <input type="checkbox" id="enable_comments" name="enable_comments" class="rounded border-gray-300" <?php echo $settings['enable_comments'] ? 'checked' : ''; ?>>
                        <label for="enable_comments" class="text-sm font-medium">মন্তব্য চালু রাখুন</label>
                    </div>

                    <div class="flex items-center gap-2">
                        <input type="checkbox" id="enable_newsletter" name="enable_newsletter" class="rounded border-gray-300" <?php echo $settings['enable_newsletter'] ? 'checked' : ''; ?>>
                        <label for="enable_newsletter" class="text-sm font-medium">নিউজলেটার চালু রাখুন</label>
                    </div>

                    <div class="flex items-center gap-2">
                        <input type="checkbox" id="enable_ads" name="enable_ads" class="rounded border-gray-300" <?php echo $settings['enable_ads'] ? 'checked' : ''; ?>>
                        <label for="enable_ads" class="text-sm font-medium">বিজ্ঞাপন চালু রাখুন</label>
                    </div>

                    <div class="flex items-center gap-2 pt-4 border-t">
                        <input type="checkbox" id="maintenance_mode" name="maintenance_mode" class="rounded border-gray-300 text-red-600 focus:ring-red-500" <?php echo $settings['maintenance_mode'] ? 'checked' : ''; ?>>
                        <label for="maintenance_mode" class="text-sm font-bold text-red-600">মেইনটেনেন্স মোড (Maintenance Mode)</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end pt-4">
            <button type="submit" class="btn btn-primary w-full md:w-auto">সেটিংস সেভ করুন</button>
        </div>
    </form>
</div>
