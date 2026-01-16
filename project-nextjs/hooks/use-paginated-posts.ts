import { useQuery } from "@tanstack/react-query";
import { Post } from "./use-posts";

export type PaginationData = {
    total: number;
    pages: number;
    page: number;
    limit: number;
};

export type PaginatedPostsResponse = {
    posts: Post[];
    pagination: PaginationData;
};

export const usePaginatedPosts = (params?: {
    featured?: boolean;
    limit?: number;
    page?: number;
    category?: string;
    categoryId?: string;
    search?: string;
    orderBy?: 'view_count' | 'published_at'
}) => {
    return useQuery({
        queryKey: ["paginated-posts", params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            searchParams.set("withPagination", "true");

            if (params?.featured) searchParams.set("featured", "true");
            if (params?.limit) searchParams.set("limit", params.limit.toString());
            if (params?.page) searchParams.set("page", params.page.toString());
            if (params?.category) searchParams.set("category", params.category);
            if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
            if (params?.search) searchParams.set("search", params.search);
            if (params?.orderBy) searchParams.set("orderBy", params.orderBy);

            const res = await fetch(`/api/posts?${searchParams.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch posts");
            return res.json() as Promise<PaginatedPostsResponse>;
        },
    });
};
