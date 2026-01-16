'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Clock, Eye, Hash } from 'lucide-react';
import { useState } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface TagPageData {
    tag: {
        id: string;
        name: string;
        slug: string;
    };
    posts: any[];
    pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
    };
}

export default function TagPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [page, setPage] = useState(1);
    const limit = 36;

    const { data, isLoading, error } = useQuery<TagPageData>({
        queryKey: ['tag', slug, page],
        queryFn: async () => {
            const res = await fetch(`/api/tags/by-slug/${encodeURIComponent(slug)}?page=${page}&limit=${limit}`);
            if (!res.ok) {
                throw new Error('Failed to fetch tag');
            }
            return res.json();
        },
        enabled: !!slug,
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-gray-600">লোড হচ্ছে...</p>
                </div>
            </main>
        );
    }

    if (error || !data?.tag) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center py-16">
                    <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">ট্যাগ পাওয়া যায়নি</h1>
                    <p className="text-gray-600 mb-8">দুঃখিত, এই ট্যাগটি খুঁজে পাওয়া যায়নি।</p>
                    <Link href="/tags" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                        সকল ট্যাগ দেখুন
                    </Link>
                </div>
            </main>
        );
    }

    const { tag, posts, pagination } = data;

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Hash className="w-6 h-6 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">
                        {tag.name}
                    </h1>
                </div>
                <p className="text-gray-600">
                    এই ট্যাগ সম্বলিত সকল সংবাদ
                </p>
                <div className="mt-2 text-sm text-gray-500">
                    মোট পোস্ট: {pagination?.total || posts.length}
                </div>
            </div>

            {posts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {posts.map((post: any) => (
                            <Link key={post.id} href={`/post/${post.id}`} className="group">
                                <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={post.featuredImage || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=240&fit=crop"}
                                            alt={post.title}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <h2 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        {post.excerpt && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <span>{post.author?.fullName}</span>
                                                <span>•</span>
                                                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{post.readTime || 5} মিনিট</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    <span>{post.viewCount || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {pagination && pagination.pages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>

                                {[...Array(pagination.pages)].map((_, i) => {
                                    const p = i + 1;
                                    // Show first, last, current, and neighbors
                                    if (p === 1 || p === pagination.pages || (p >= page - 1 && p <= page + 1)) {
                                        return (
                                            <PaginationItem key={p}>
                                                <PaginationLink
                                                    isActive={page === p}
                                                    onClick={() => setPage(p)}
                                                    className="cursor-pointer"
                                                >
                                                    {p}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    } else if (p === page - 2 || p === page + 2) {
                                        return (
                                            <PaginationItem key={p}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    return null;
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                        className={page === pagination.pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">এই ট্যাগে কোনো সংবাদ পাওয়া যায়নি।</p>
                </div>
            )}
        </main>
    );
}
