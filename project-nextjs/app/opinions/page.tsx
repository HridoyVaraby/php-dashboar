'use client';

import { useState } from 'react';
import { useOpinions } from '@/hooks/use-opinions';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function OpinionsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

    const { data: opinions, isLoading } = useOpinions({ search: searchTerm, sortBy });

    return (
        <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">মতামত এবং বিশ্লেষণ</h1>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="মতামত খুঁজুন..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="সর্ট করুন" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">নতুন আগে</SelectItem>
                            <SelectItem value="popular">জনপ্রিয়</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white border-t-4 border-gray-800 p-6 rounded-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
                                    <div className="h-3 bg-gray-200 animate-pulse rounded w-16"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : opinions && opinions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {opinions.map((opinion: any) => (
                        <Link key={opinion.id} href={`/opinion/${opinion.id}`} className="group">
                            <article className="bg-white border-t-4 border-gray-800 p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        <img
                                            src={opinion.authorImage || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"}
                                            alt={opinion.authorName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{opinion.authorName}</h3>
                                        <p className="text-sm text-gray-600">{opinion.authorRole}</p>
                                    </div>
                                </div>

                                <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                    {opinion.title}
                                </h2>
                                {opinion.excerpt && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {opinion.excerpt}
                                    </p>
                                )}

                                <div className="flex justify-between text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(opinion.createdAt).toLocaleDateString('bn-BD')}</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">কোন মতামত পাওয়া যায়নি</h2>
                    <p className="text-gray-600">আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন।</p>
                </div>
            )}
        </main>
    );
}
