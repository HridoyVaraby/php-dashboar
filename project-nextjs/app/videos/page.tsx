'use client';

import { useState } from 'react';
import { useVideos } from '@/hooks/use-videos';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Calendar, Eye, Search } from 'lucide-react';
import Link from 'next/link';

// Function to extract YouTube video ID and generate thumbnail
const getYouTubeThumbnail = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    if (match) {
        return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    return null;
};

export default function VideosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'popular'>('latest');

    const { data: videos, isLoading } = useVideos({ search: searchTerm, sortBy });

    return (
        <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">সকল ভিডিও</h1>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="ভিডিও খুঁজুন..."
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
                            <SelectItem value="oldest">পুরাতন আগে</SelectItem>
                            <SelectItem value="popular">জনপ্রিয়</SelectItem>
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
            ) : videos && videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video: any) => {
                        const thumbnail = video.thumbnail || getYouTubeThumbnail(video.videoUrl);

                        return (
                            <Link key={video.id} href={`/video/${video.id}`} className="group cursor-pointer">
                                <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop"}
                                            alt={video.title}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-12 h-12 text-white" />
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                            {video.title}
                                        </h3>
                                        {video.description && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {video.description}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(video.createdAt).toLocaleDateString('bn-BD')}</span>
                                            </div>
                                            {/* <div className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                <span>{video.viewCount || 0}</span>
                                            </div> */}
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">কোন ভিডিও পাওয়া যায়নি</h2>
                    <p className="text-gray-600">আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন।</p>
                </div>
            )}
        </main>
    );
}
