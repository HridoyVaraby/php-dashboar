'use client';

import { useQuery } from '@tanstack/react-query';

interface UseOpinionsOptions {
    search?: string;
    sortBy?: 'latest' | 'popular';
    limit?: number;
}

export type PaginatedOpinionsResponse = {
    opinions: any[];
    pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
    };
};

export function useOpinions(options: UseOpinionsOptions = {}) {
    const { search, sortBy, limit } = options;

    return useQuery({
        queryKey: ['opinions', search, sortBy, limit],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (sortBy) params.append('sortBy', sortBy);
            if (limit) params.append('limit', limit.toString());

            const response = await fetch(`/api/opinions?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch opinions');
            }
            return response.json();
        },
    });
}

// Hook for paginated opinions (admin dashboard)
export function usePaginatedOpinions(options: {
    limit: number;
    page: number;
    search?: string;
}) {
    const { limit, page, search } = options;

    return useQuery({
        queryKey: ['opinions', 'paginated', limit, page, search],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('withPagination', 'true');
            params.append('limit', limit.toString());
            params.append('page', page.toString());
            if (search) params.append('search', search);

            const response = await fetch(`/api/opinions?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch opinions');
            }
            return response.json() as Promise<PaginatedOpinionsResponse>;
        },
    });
}

export function useOpinion(id: string) {
    return useQuery({
        queryKey: ['opinion', id],
        queryFn: async () => {
            const response = await fetch(`/api/opinions/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch opinion');
            }
            return response.json();
        },
        enabled: !!id,
    });
}

