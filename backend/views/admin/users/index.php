<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">ইউজার</h1>
    </div>

    <div class="card">
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>নাম</th>
                        <th>ইমেইল</th>
                        <th>রোল</th>
                        <th>স্ট্যাটাস</th>
                        <th>যোগদানের তারিখ</th>
                        <th class="text-right">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($users)): ?>
                        <tr>
                            <td colspan="6" class="text-center py-8 text-muted-foreground">কোনো ইউজার পাওয়া যায়নি</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($users as $user): ?>
                            <tr>
                                <td class="font-medium">
                                    <div class="flex items-center gap-3">
                                        <img src="<?php echo !empty($user['avatar_url']) ? htmlspecialchars($user['avatar_url']) : '/assets/avatar-placeholder.png'; ?>" class="h-8 w-8 rounded-full bg-gray-100" alt="">
                                        <span><?php echo htmlspecialchars($user['full_name']); ?></span>
                                    </div>
                                </td>
                                <td><?php echo htmlspecialchars($user['email']); ?></td>
                                <td>
                                    <?php
                                    $roleColor = match($user['role']) {
                                        'ADMIN' => 'bg-red-100 text-red-800',
                                        'EDITOR' => 'bg-blue-100 text-blue-800',
                                        default => 'bg-gray-100 text-gray-800'
                                    };
                                    ?>
                                    <span class="badge <?php echo $roleColor; ?>"><?php echo htmlspecialchars($user['role']); ?></span>
                                </td>
                                <td>
                                    <?php if ($user['is_suspended']): ?>
                                        <span class="badge badge-destructive">সাসপেন্ডেড</span>
                                    <?php else: ?>
                                        <span class="badge bg-green-100 text-green-800">অ্যাক্টিভ</span>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo date('d M Y', strtotime($user['created_at'])); ?></td>
                                <td class="text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button type="button" class="btn btn-ghost btn-icon" onclick="openEditModal('<?php echo $user['id']; ?>', '<?php echo $user['role']; ?>', <?php echo $user['is_suspended']; ?>)">
                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                        </button>

                                        <?php if ($user['id'] !== $_SESSION['user']['id']): ?>
                                            <form action="/admin/users/delete/<?php echo $user['id']; ?>" method="POST" onsubmit="return confirm('আপনি কি নিশ্চিত?');">
                                                <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">
                                                <button type="submit" class="btn btn-ghost btn-icon text-red-500 hover:text-red-700 hover:bg-red-50">
                                                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                                                </button>
                                            </form>
                                        <?php endif; ?>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Edit User Modal -->
<div id="editModal" class="fixed inset-0 z-50 hidden bg-black/50 items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="flex items-center justify-between p-6 border-b">
            <h3 class="text-lg font-semibold">ইউজার এডিট করুন</h3>
            <button onclick="closeEditModal()" class="text-gray-400 hover:text-gray-500">
                <i data-lucide="x" class="h-5 w-5"></i>
            </button>
        </div>
        <form id="editForm" method="POST" class="p-6 space-y-4">
            <input type="hidden" name="csrf_token" value="<?php echo \App\Helpers\CSRF::generate(); ?>">
            <div class="space-y-2">
                <label for="role" class="label">রোল</label>
                <select id="role" name="role" class="input">
                    <option value="ADMIN">ADMIN</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="READER">READER</option>
                </select>
            </div>

            <div class="flex items-center gap-2">
                <input type="checkbox" id="is_suspended" name="is_suspended" class="rounded border-gray-300">
                <label for="is_suspended" class="text-sm font-medium">সাসপেন্ড করুন</label>
            </div>

            <div class="flex justify-end gap-3 mt-6">
                <button type="button" onclick="closeEditModal()" class="btn btn-ghost">বাতিল</button>
                <button type="submit" class="btn btn-primary">সেভ করুন</button>
            </div>
        </form>
    </div>
</div>

<script>
function openEditModal(id, role, isSuspended) {
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editForm');
    const roleInput = document.getElementById('role');
    const suspendedInput = document.getElementById('is_suspended');

    form.action = '/admin/users/update/' + id;
    roleInput.value = role;
    suspendedInput.checked = isSuspended == 1;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}
</script>
