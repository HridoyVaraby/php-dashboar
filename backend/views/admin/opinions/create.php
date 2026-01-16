<div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">নতুন মতামত যোগ করুন</h1>
        <a href="/admin/opinions" class="btn btn-ghost">
            <i data-lucide="arrow-left" class="mr-2 h-4 w-4"></i> ফিরে যান
        </a>
    </div>

    <form action="/admin/opinions/create" method="POST" enctype="multipart/form-data" class="space-y-6">
        <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">

        <div class="grid gap-6 md:grid-cols-3">
            <!-- Main Content -->
            <div class="md:col-span-2 space-y-6">
                <div class="card p-6 space-y-4">
                    <div class="space-y-2">
                        <label for="title" class="label">শিরোনাম <span class="text-red-500">*</span></label>
                        <input type="text" id="title" name="title" required class="input" placeholder="মতামতের শিরোনাম">
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
                <div class="card p-6 space-y-4">
                    <h3 class="font-semibold text-lg">লেখকের তথ্য</h3>

                    <div class="space-y-2">
                        <label for="author_name" class="label">লেখকের নাম <span class="text-red-500">*</span></label>
                        <input type="text" id="author_name" name="author_name" required class="input" placeholder="নাম">
                    </div>

                    <div class="space-y-2">
                        <label for="author_role" class="label">পদবী/পরিচয়</label>
                        <input type="text" id="author_role" name="author_role" class="input" placeholder="যেমন: কলামিস্ট">
                    </div>

                    <div class="space-y-2">
                        <label for="author_image" class="label">লেখকের ছবি</label>
                        <input type="file" id="author_image" name="author_image" accept="image/*" class="input py-1.5">
                    </div>

                    <div class="pt-4">
                        <button type="submit" class="btn btn-primary w-full">সেভ করুন</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
