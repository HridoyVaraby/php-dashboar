'use client';

import Link from "next/link";
import { Clock, Calendar, Play } from "lucide-react";
import { usePosts } from '@/hooks/use-posts';
import { useVideos } from '@/hooks/use-videos';

import { formatBengaliDateTime } from '@/lib/bengali-date-utils';

const HeroSection = () => {
    const { data: posts, isLoading: postsLoading } = usePosts({
        featuredPosition: true,
        orderBy: 'featured_position',
        limit: 10
    });
    const { data: videos, isLoading: videosLoading } = useVideos({
        featuredPosition: true,
        sortBy: 'featured_position',
        limit: 5
    });

    const isLoading = postsLoading || videosLoading;

    if (isLoading) {
        return (
            <section className="w-full px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-red-100">

                    {/* First Column – 50% width (col-span-2) */}
                    <div className="col-span-1 lg:col-span-2">
                        <div className="w-full h-80 lg:h-96 bg-gray-200 animate-pulse rounded-lg"></div>
                    </div>

                    {/* Second Column – 25% width (col-span-1) */}
                    <div className="col-span-1">
                        <div className="space-y-6">
                            <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg"></div>
                            <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg"></div>
                        </div>
                    </div>

                    {/* Third Column – 25% width (col-span-1) */}
                    <div className="col-span-1">
                        <div className="space-y-6">
                            <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg"></div>
                            <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg"></div>
                        </div>
                    </div>

                </div>
            </section>
        );
    }

    if ((!posts || posts.length === 0) && (!videos || videos.length === 0)) {
        return (
            <section className="container mx-auto px-4 py-8">
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">কোন ফিচারড পোস্ট পাওয়া যায়নি</h2>
                    <p className="text-gray-600">অনুগ্রহ করে অ্যাডমিন প্যানেল থেকে পোস্ট তৈরি করুন।</p>
                </div>
            </section>
        );
    }

    // Filter posts by position
    const featuredStory = posts?.find((p: any) => p.featuredPosition === 1) || posts?.[0];
    const secondStory = posts?.find((p: any) => p.featuredPosition === 2) || posts?.[1];
    const thirdStory = posts?.find((p: any) => p.featuredPosition === 3) || posts?.[2];

    const firstColumnStories = [secondStory, thirdStory].filter((s): s is any => !!s);

    // Filter videos by position
    const firstVideo = videos?.find((v: any) => v.featuredPosition === 1) || videos?.[0];
    const secondVideo = videos?.find((v: any) => v.featuredPosition === 2) || videos?.[1];
    const videoStories = [firstVideo, secondVideo].filter(Boolean);

    // Helper function to generate YouTube thumbnail
    const getYouTubeThumbnail = (url: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        if (match) {
            return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
        }
        return null;
    };

    return (
        <section className="w-full px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">

                {/* Main Featured Story - First Column */}
                <div className="col-span-1 lg:col-span-2">
                    {featuredStory && (
                        <Link href={`/post/${featuredStory.id}`} className="group block h-full">
                            <div className="relative overflow-hidden rounded-lg h-full">
                                <img
                                    src={
                                        featuredStory.featuredImage ||
                                        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop"
                                    }
                                    alt={featuredStory.title}
                                    className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    {featuredStory.category && (
                                        <span className="bg-red-600 text-white px-3 py-1 text-sm font-medium rounded mb-3 inline-block">
                                            {featuredStory.category.name}
                                        </span>
                                    )}
                                    <h2 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight group-hover:text-gray-200 transition-colors">
                                        {featuredStory.title}
                                    </h2>
                                    <p className="text-gray-200 mb-4 line-clamp-2">{featuredStory.excerpt}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-300">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatBengaliDateTime(featuredStory.publishedAt || featuredStory.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Supporting Stories - Second Column */}
                <div className="col-span-1 h-full flex flex-col justify-between gap-4">
                    {firstColumnStories.map((story) => (
                        <Link key={story.id} href={`/post/${story.id}`} className="group block flex-1">
                            <div className="relative overflow-hidden rounded-lg h-full">
                                <img
                                    src={
                                        story.featuredImage ||
                                        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop"
                                    }
                                    alt={story.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    {story.category && (
                                        <span className="bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded mb-2 inline-block">
                                            {story.category.name}
                                        </span>
                                    )}
                                    <h3 className="text-lg font-semibold leading-tight group-hover:text-gray-200 transition-colors">
                                        {story.title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Video Cards - Third Column */}
                <div className="col-span-1 h-full flex flex-col justify-between gap-4">
                    {videoStories.map((video: any) => {
                        const thumbnail = video.thumbnail || getYouTubeThumbnail(video.videoUrl);

                        return (
                            <Link key={video.id} href={`/video/${video.id}`} className="group block flex-1">
                                <div className="relative overflow-hidden rounded-lg h-full bg-gray-900">
                                    <img
                                        src={thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop"}
                                        alt={video.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-red-600 rounded-full p-3 group-hover:bg-red-700 transition-colors">
                                            <Play className="w-6 h-6 text-white fill-white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium rounded mb-2 inline-block">
                                            ভিডিও
                                        </span>
                                        <h3 className="text-lg font-semibold leading-tight group-hover:text-gray-200 transition-colors line-clamp-2">
                                            {video.title}
                                        </h3>
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

export default HeroSection;
