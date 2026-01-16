'use client';

import { useState } from 'react';
import { usePaginatedPosts } from '@/hooks/use-paginated-posts';
import { useCategories } from '@/hooks/use-categories';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar, Search } from 'lucide-react';
import Link from 'next/link';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { formatBengaliDateTime } from '@/lib/bengali-date-utils';

export default function PostsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<'view_count' | 'published_at'>('published_at');
    const [page, setPage] = useState(1);
    const limit = 36;

    const { data: categories } = useCategories();
    const { data: postsData, isLoading } = usePaginatedPosts({
        search: searchTerm,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
        orderBy: sortBy,
        page,
        limit,
    });

    const posts = postsData?.posts || [];
    const pagination = postsData?.pagination;

    return (
        <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">সকল পোস্ট</h1>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="পোস্ট খুঁজুন..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="ক্যাটেগরি" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">সকল ক্যাটেগরি</SelectItem>
                            {categories?.map((category: any) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="সর্ট করুন" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="published_at">নতুন আগে</SelectItem>
                            <SelectItem value="view_count">জনপ্রিয়</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg border border-gray-200">
                            <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-3 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : posts && posts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {posts.map((post: any) => (
                            <Link key={post.id} href={`/post/${post.id}`} className="group">
                                <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={post.featuredImage || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=250&fit=crop"}
                                            alt={post.title}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <span className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded">
                                            {post.category?.name}
                                        </span>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatBengaliDateTime(post.publishedAt || post.createdAt)}</span>
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
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">কোন পোস্ট পাওয়া যায়নি</h2>
                    <p className="text-gray-600">আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন।</p>
                </div>
            )}
        </main>
    );
}
