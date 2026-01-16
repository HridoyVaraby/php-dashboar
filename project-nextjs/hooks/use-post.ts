import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function usePost(id: string) {
    return useQuery({
        queryKey: ['post', id],
        queryFn: async () => {
            const response = await fetch(`/api/posts/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch post');
            }
            return response.json();
        },
        enabled: !!id,
    });
}

export function useIncrementView() {
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/posts/${id}/view`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to increment view count');
            }
            return response.json();
        },
    });
}
