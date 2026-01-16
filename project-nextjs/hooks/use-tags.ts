import { useQuery } from '@tanstack/react-query';

interface UseTagsOptions {
    search?: string;
}

export function useTags(options: UseTagsOptions = {}) {
    const { search } = options;

    return useQuery({
        queryKey: ['tags', search],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);

            const response = await fetch(`/api/tags?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tags');
            }
            return response.json();
        },
    });
}
