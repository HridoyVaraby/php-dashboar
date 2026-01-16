import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Post = {
    id: string;
    title: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    category?: { name: string; slug: string };
    categories?: { name: string; slug: string }[];
    author?: { fullName: string; avatarUrl?: string };
    createdAt: string;
    publishedAt: string;
    readTime?: number;
    viewCount: number;
    status?: string;
    isFeatured?: boolean;
};

export type PaginatedPostsResponse = {
    posts: Post[];
    pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
    };
};

export const usePosts = (params?: {
    featured?: boolean;
    featuredPosition?: boolean;
    limit?: number;
    category?: string;
    categoryId?: string;
    search?: string;
    orderBy?: 'view_count' | 'published_at' | 'featured_position';
}) => {
    return useQuery({
        queryKey: ["posts", params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            if (params?.featured) searchParams.set("featured", "true");
            if (params?.featuredPosition) searchParams.set("featuredPosition", "true");
            if (params?.limit) searchParams.set("limit", params.limit.toString());
            if (params?.category) searchParams.set("category", params.category);
            if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
            if (params?.search) searchParams.set("search", params.search);
            if (params?.orderBy) searchParams.set("orderBy", params.orderBy);

            const res = await fetch(`/api/posts?${searchParams.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch posts");
            return res.json() as Promise<Post[]>;
        },
    });
};

// Helper hook specifically for paginated posts (type-safe) - fetches all posts including drafts
export const usePaginatedPosts = (params: {
    featured?: boolean;
    limit: number;
    page: number;
    categoryId?: string;
    search?: string;
}) => {
    return useQuery({
        queryKey: ["posts", "paginated", params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            searchParams.set("withPagination", "true");
            searchParams.set("status", "all"); // Fetch all posts including drafts
            searchParams.set("limit", params.limit.toString());
            searchParams.set("page", params.page.toString());
            if (params?.featured) searchParams.set("featured", "true");
            if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
            if (params?.search) searchParams.set("search", params.search);

            const res = await fetch(`/api/posts?${searchParams.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch posts");
            return res.json() as Promise<PaginatedPostsResponse>;
        },
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/posts/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete post");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
};

