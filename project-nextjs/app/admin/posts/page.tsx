'use client';

import { useState } from 'react';
import { usePaginatedPosts, useDeletePost } from '@/hooks/use-posts';
import { useCategories } from '@/hooks/use-categories';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminPostsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedFeatured, setSelectedFeatured] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(20);
    const { toast } = useToast();

    const { data: categories } = useCategories();
    const { data: postsData, isLoading } = usePaginatedPosts({
        search: searchTerm,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
        featured: selectedFeatured === 'featured' ? true : undefined,
        page: currentPage,
        limit: postsPerPage,
    });
    const { mutate: deletePost } = useDeletePost();

    const posts = postsData?.posts || [];
    const pagination = postsData?.pagination;
    const totalPages = pagination?.pages || 1;
    const totalPosts = pagination?.total || 0;

    const handleDelete = async (id: string) => {
        if (!confirm('আপনি কি নিশ্চিত যে আপনি এই পোস্টটি মুছে ফেলতে চান?')) return;

        deletePost(id, {
            onSuccess: () => {
                toast({
                    title: "সফল!",
                    description: "পোস্টটি মুছে ফেলা হয়েছে।",
                });
            },
            onError: () => {
                toast({
                    title: "ত্রুটি",
                    description: "পোস্ট মুছতে সমস্যা হয়েছে।",
                    variant: "destructive",
                });
            }
        });
    };

    // Client-side status filtering (since API doesn't support status filter directly)
    const filteredPosts = posts?.filter((post: any) => {
        if (selectedStatus === 'all') return true;
        return post.status === selectedStatus;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePostsPerPageChange = (value: string) => {
        setPostsPerPage(parseInt(value));
        setCurrentPage(1); // Reset to first page when changing posts per page
    };

    // Reset to page 1 when filters change
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setCurrentPage(1);
    };

    const handleFeaturedChange = (value: string) => {
        setSelectedFeatured(value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">পোস্ট ম্যানেজমেন্ট</h1>
                    <p className="text-gray-600 mt-1">
                        সকল পোস্ট দেখুন এবং পরিচালনা করুন
                        {totalPosts > 0 && <span className="ml-2 text-sm font-medium">(মোট: {totalPosts} পোস্ট)</span>}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/posts/create">
                        <Plus className="w-4 h-4 mr-2" />
                        নতুন পোস্ট
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="পোস্ট খুঁজুন..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                        <SelectTrigger>
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

                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="স্ট্যাটাস" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">সকল স্ট্যাটাস</SelectItem>
                            <SelectItem value="PUBLISHED">প্রকাশিত</SelectItem>
                            <SelectItem value="DRAFT">খসড়া</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={selectedFeatured} onValueChange={handleFeaturedChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="ফিচারড স্ট্যাটাস" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">সকল</SelectItem>
                            <SelectItem value="featured">ফিচারড</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    শিরোনাম
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ক্যাটেগরি
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    স্ট্যাটাস
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    তারিখ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ভিউ
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    অ্যাকশন
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        লোড হচ্ছে...
                                    </td>
                                </tr>
                            ) : filteredPosts && filteredPosts.length > 0 ? (
                                filteredPosts.map((post: any) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                            <div className="text-sm text-gray-500">লেখক: {post.author?.fullName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {post.categories && post.categories.length > 0 ? (
                                                    post.categories.map((cat: any) => (
                                                        <span key={cat.slug} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                            {cat.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-500">{post.category?.name}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'PUBLISHED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {post.status === 'PUBLISHED' ? 'প্রকাশিত' : 'খসড়া'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(post.publishedAt || post.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {post.viewCount || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700"
                                                    asChild
                                                >
                                                    <a href={`/post/${post.id}`} target="_blank" rel="noopener noreferrer">
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/posts/edit/${post.id}`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDelete(post.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        কোন পোস্ট পাওয়া যায়নি
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Posts per page selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">প্রতি পৃষ্ঠায় পোস্ট:</span>
                            <Select value={postsPerPage.toString()} onValueChange={handlePostsPerPageChange}>
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">১০</SelectItem>
                                    <SelectItem value="20">২০</SelectItem>
                                    <SelectItem value="50">৫০</SelectItem>
                                    <SelectItem value="100">১০০</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Page info */}
                        <div className="text-sm text-gray-600">
                            পৃষ্ঠা {currentPage} / {totalPages} (মোট {totalPosts} পোস্ট)
                        </div>

                        {/* Page navigation */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {/* Page number buttons */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                            className="min-w-[36px]"
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

