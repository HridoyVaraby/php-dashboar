import { useQuery } from '@tanstack/react-query';

export function useCategory(slug: string, subcategorySlug?: string, page: number = 1, limit: number = 36) {
    return useQuery({
        queryKey: ['category', slug, subcategorySlug, page, limit],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (subcategorySlug) params.set('subcategory', subcategorySlug);
            params.set('page', page.toString());
            params.set('limit', limit.toString());

            const url = `/api/categories/${slug}?${params.toString()}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch category');
            }
            return response.json();
        },
        enabled: !!slug,
    });
}
