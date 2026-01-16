'use client';

import { useState } from 'react';
import { useTags } from '@/hooks/use-tags';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Hash } from 'lucide-react';
import Link from 'next/link';

export default function TagsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: tags, isLoading } = useTags({ search: searchTerm });

    return (
        <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">সকল ট্যাগ</h1>

                <div className="max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="ট্যাগ খুঁজুন..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
                    ))}
                </div>
            ) : tags && tags.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tags.map((tag: any) => {
                        const postCount = tag._count?.postTags || 0;
                        return (
                            <Link
                                key={tag.id}
                                href={`/tag/${tag.slug}`}
                                className="group"
                            >
                                <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 group-hover:scale-105">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Hash className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium text-gray-900 group-hover:text-blue-600">
                                                {tag.name}
                                            </span>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {postCount}
                                        </Badge>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">কোন ট্যাগ পাওয়া যায়নি</h2>
                    <p className="text-gray-600">আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন।</p>
                </div>
            )}
        </main>
    );
}
