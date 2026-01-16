import { useQuery } from '@tanstack/react-query';

export function useRelatedPosts(category: string, currentPostId: string) {
    return useQuery({
        queryKey: ['related-posts', category, currentPostId],
        queryFn: async () => {
            const response = await fetch(`/api/posts/related?category=${encodeURIComponent(category)}&excludeId=${currentPostId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch related posts');
            }
            return response.json();
        },
        enabled: !!category && !!currentPostId,
    });
}
