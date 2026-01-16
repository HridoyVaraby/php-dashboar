<?php
/**
 * Pagination Component
 *
 * Expected variables:
 * $page: current page number
 * $totalPages: total number of pages
 * $baseUrl: base URL for pagination links (e.g. /admin/posts)
 * $queryParams: array of query parameters to preserve
 */

if ($totalPages <= 1) return;

$queryParams = $queryParams ?? [];
$buildUrl = function($p) use ($baseUrl, $queryParams) {
    $params = array_merge($queryParams, ['page' => $p]);
    return $baseUrl . '?' . http_build_query($params);
};
?>

<div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
    <div class="flex flex-1 justify-between sm:hidden">
        <?php if ($page > 1): ?>
            <a href="<?php echo $buildUrl($page - 1); ?>" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">আগে</a>
        <?php else: ?>
            <span class="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">আগে</span>
        <?php endif; ?>

        <?php if ($page < $totalPages): ?>
            <a href="<?php echo $buildUrl($page + 1); ?>" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">পরে</a>
        <?php else: ?>
            <span class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">পরে</span>
        <?php endif; ?>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
            <p class="text-sm text-gray-700">
                দেখানো হচ্ছে <span class="font-medium"><?php echo $page; ?></span> থেকে <span class="font-medium"><?php echo $totalPages; ?></span> পৃষ্ঠা
            </p>
        </div>
        <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <!-- Previous -->
                <?php if ($page > 1): ?>
                    <a href="<?php echo $buildUrl($page - 1); ?>" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span class="sr-only">Previous</span>
                        <i data-lucide="chevron-left" class="h-4 w-4"></i>
                    </a>
                <?php else: ?>
                    <span class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 cursor-not-allowed">
                        <span class="sr-only">Previous</span>
                        <i data-lucide="chevron-left" class="h-4 w-4"></i>
                    </span>
                <?php endif; ?>

                <!-- Page Numbers -->
                <?php
                $start = max(1, $page - 2);
                $end = min($totalPages, $page + 2);

                if ($start > 1) {
                    echo '<a href="' . $buildUrl(1) . '" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">1</a>';
                    if ($start > 2) {
                        echo '<span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>';
                    }
                }

                for ($i = $start; $i <= $end; $i++):
                    $isCurrent = $i === $page;
                ?>
                    <a href="<?php echo $buildUrl($i); ?>" aria-current="<?php echo $isCurrent ? 'page' : 'false'; ?>" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold <?php echo $isCurrent ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'; ?>">
                        <?php echo $i; ?>
                    </a>
                <?php endfor; ?>

                <?php
                if ($end < $totalPages) {
                    if ($end < $totalPages - 1) {
                        echo '<span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>';
                    }
                    echo '<a href="' . $buildUrl($totalPages) . '" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">' . $totalPages . '</a>';
                }
                ?>

                <!-- Next -->
                <?php if ($page < $totalPages): ?>
                    <a href="<?php echo $buildUrl($page + 1); ?>" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span class="sr-only">Next</span>
                        <i data-lucide="chevron-right" class="h-4 w-4"></i>
                    </a>
                <?php else: ?>
                    <span class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 cursor-not-allowed">
                        <span class="sr-only">Next</span>
                        <i data-lucide="chevron-right" class="h-4 w-4"></i>
                    </span>
                <?php endif; ?>
            </nav>
        </div>
    </div>
</div>
