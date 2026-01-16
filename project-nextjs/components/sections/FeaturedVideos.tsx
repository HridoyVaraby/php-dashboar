'use client';

import { useVideos } from '@/hooks/use-videos';
import { Play, Eye, Calendar } from 'lucide-react';
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

const FeaturedVideos = () => {
    const { data: videos, isLoading } = useVideos({ limit: 4 });

    if (isLoading) {
        return (
            <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">ভিডিও</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                <div className="aspect-video bg-gray-200 animate-pulse"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!videos || videos.length === 0) {
        return (
            <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">ভিডিও</h2>
                        <Link href="/videos" className="text-blue-600 hover:text-blue-800 font-medium">
                            আরো ভিডিও →
                        </Link>
                    </div>
                    <div className="text-center py-8">
                        <p className="text-gray-600">কোন ভিডিও পাওয়া যায়নি।</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">ভিডিও</h2>
                    <Link href="/videos" className="text-blue-600 hover:text-blue-800 font-medium">
                        আরো ভিডিও →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videos.map((video: any) => {
                        const thumbnail = video.thumbnail || getYouTubeThumbnail(video.videoUrl);

                        return (
                            <Link key={video.id} href={`/video/${video.id}`} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                <div className="relative aspect-video">
                                    <img
                                        src={thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop"}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="w-12 h-12 text-white" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {video.title}
                                    </h3>
                                    {video.description && (
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {video.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        {/* View count not available in schema yet, defaulting to 0 */}
                                        {/* <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{video.viewCount || 0}</span>
                    </div> */}
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(video.createdAt).toLocaleDateString('bn-BD')}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturedVideos;
