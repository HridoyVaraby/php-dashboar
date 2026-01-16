'use client';

import { usePaginatedVideos } from '@/hooks/use-videos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function AdminVideosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: videosData, isLoading } = usePaginatedVideos({
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
    });

    const videos = videosData?.videos || [];
    const pagination = videosData?.pagination;
    const totalPages = pagination?.pages || 1;
    const totalItems = pagination?.total || 0;

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/videos/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete video');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            toast({
                title: 'সফল!',
                description: 'ভিডিও ডিলিট হয়েছে।',
            });
        },
        onError: () => {
            toast({
                title: 'ত্রুটি',
                description: 'ভিডিও ডিলিট করতে সমস্যা হয়েছে।',
                variant: 'destructive',
            });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm('আপনি কি নিশ্চিত যে আপনি এই ভিডিওটি ডিলিট করতে চান?')) {
            deleteMutation.mutate(id);
        }
    };

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

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(parseInt(value));
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">ভিডিও ম্যানেজমেন্ট</h1>
                    <p className="text-gray-600 mt-1">
                        সকল ভিডিও দেখুন এবং পরিচালনা করুন
                        {totalItems > 0 && <span className="ml-2 text-sm font-medium">(মোট: {totalItems} ভিডিও)</span>}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/videos/create">
                        <Plus className="w-4 h-4 mr-2" />
                        নতুন ভিডিও
                    </Link>
                </Button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="ভিডিও খুঁজুন..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Videos Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    শিরোনাম
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
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        লোড হচ্ছে...
                                    </td>
                                </tr>
                            ) : videos && videos.length > 0 ? (
                                videos.map((video: any) => (
                                    <tr key={video.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={video.thumbnail || 'https://via.placeholder.com/120x67'}
                                                    alt={video.title}
                                                    className="w-20 h-11 object-cover rounded mr-3"
                                                />
                                                <div className="text-sm font-medium text-gray-900">{video.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(video.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {video.viewCount || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/videos/edit/${video.id}`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDelete(video.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        কোন ভিডিও পাওয়া যায়নি
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">প্রতি পৃষ্ঠায়:</span>
                            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
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

                        <div className="text-sm text-gray-600">
                            পৃষ্ঠা {currentPage} / {totalPages} (মোট {totalItems} ভিডিও)
                        </div>

                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                                <ChevronsLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

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

                            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                                <ChevronsRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

