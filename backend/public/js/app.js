// Custom JavaScript for Admin Panel
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuButton = document.querySelector('header button');
    const sidebar = document.querySelector('aside');

    if (menuButton && sidebar) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('absolute');
            sidebar.classList.toggle('z-50');
            sidebar.classList.toggle('h-full');
        });
    }

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
