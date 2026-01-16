<div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">প্রোফাইল সেটিংস</h1>
    </div>

    <form action="/admin/profile" method="POST" enctype="multipart/form-data" class="space-y-6">
        <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">

        <div class="card p-6 space-y-6">
            <div class="flex flex-col items-center gap-4">
                <div class="relative group">
                    <img src="<?php echo !empty($user['avatar_url']) ? htmlspecialchars($user['avatar_url']) : '/assets/avatar-placeholder.png'; ?>" class="h-24 w-24 rounded-full object-cover border-2 border-gray-200">
                    <div class="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <i data-lucide="camera" class="h-6 w-6 text-white"></i>
                        <input type="file" name="avatar" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
                    </div>
                </div>
                <div class="text-center">
                    <h2 class="text-lg font-semibold"><?php echo htmlspecialchars($user['full_name']); ?></h2>
                    <p class="text-sm text-muted-foreground"><?php echo htmlspecialchars($user['role']); ?></p>
                </div>
            </div>

            <div class="space-y-4">
                <div class="space-y-2">
                    <label for="full_name" class="label">পুরো নাম</label>
                    <input type="text" id="full_name" name="full_name" value="<?php echo htmlspecialchars($user['full_name']); ?>" required class="input">
                </div>

                <div class="space-y-2">
                    <label for="email" class="label">ইমেইল</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required class="input">
                </div>

                <div class="space-y-2">
                    <label for="password" class="label">নতুন পাসওয়ার্ড</label>
                    <input type="password" id="password" name="password" class="input" placeholder="পরিবর্তন করতে চাইলে লিখুন">
                    <p class="text-xs text-muted-foreground">পাসওয়ার্ড পরিবর্তন না করতে চাইলে ফাঁকা রাখুন</p>
                </div>
            </div>

            <div class="pt-4 flex justify-end">
                <button type="submit" class="btn btn-primary">আপডেট প্রোফাইল</button>
            </div>
        </div>
    </form>
</div>
