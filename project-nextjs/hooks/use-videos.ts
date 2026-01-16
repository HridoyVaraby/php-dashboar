import { useQuery, useMutation } from '@tanstack/react-query';

interface UseVideosOptions {
    limit?: number;
    search?: string;
    sortBy?: 'latest' | 'oldest' | 'popular' | 'featured_position';
    featuredPosition?: boolean;
}

export type PaginatedVideosResponse = {
    videos: any[];
    pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
    };
};

export function useVideos(options: UseVideosOptions = {}) {
    const { limit, search, sortBy = 'latest', featuredPosition } = options;

    return useQuery({
        queryKey: ['videos', limit, search, sortBy, featuredPosition],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (limit) params.append('limit', limit.toString());
            if (search) params.append('search', search);
            if (sortBy) params.append('sortBy', sortBy);
            if (featuredPosition) params.append('featuredPosition', 'true');

            const response = await fetch(`/api/videos?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }
            return response.json();
        },
    });
}

// Hook for paginated videos (admin dashboard)
export function usePaginatedVideos(options: {
    limit: number;
    page: number;
    search?: string;
}) {
    const { limit, page, search } = options;

    return useQuery({
        queryKey: ['videos', 'paginated', limit, page, search],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('withPagination', 'true');
            params.append('limit', limit.toString());
            params.append('page', page.toString());
            if (search) params.append('search', search);

            const response = await fetch(`/api/videos?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }
            return response.json() as Promise<PaginatedVideosResponse>;
        },
    });
}

export function useVideo(id: string) {
    return useQuery({
        queryKey: ['video', id],
        queryFn: async () => {
            const response = await fetch(`/api/videos/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch video');
            }
            return response.json();
        },
        enabled: !!id,
    });
}

export function useIncrementVideoView() {
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/videos/${id}/view`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to increment view count');
            }
            return response.json();
        },
    });
}

