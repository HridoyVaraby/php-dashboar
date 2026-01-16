'use client';

import { useParams } from 'next/navigation';
import { useVideo, useIncrementVideoView } from '@/hooks/use-videos';
import CommentSection from '@/components/comments/CommentSection';
import { Calendar, Eye } from 'lucide-react';
import { useEffect } from 'react';
import { formatBengaliDateTime, toBengaliDigits } from '@/lib/bengali-date-utils';

// Function to extract YouTube video ID and get embed URL
const getYouTubeEmbedUrl = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
};

export default function VideoPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: video, isLoading, error } = useVideo(id);
    const { mutate: incrementView } = useIncrementVideoView();

    useEffect(() => {
        if (id) {
            incrementView(id);
        }
    }, [id, incrementView]);

    if (isLoading) {
        return (
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-8 w-1/3"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !video) {
        return (
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">ভিডিও পাওয়া যায়নি</h1>
                    <p className="text-gray-600">এই ভিডিওটি খুঁজে পাওয়া যায়নি অথবা মুছে ফেলা হয়েছে।</p>
                </div>
            </main>
        );
    }

    const embedUrl = getYouTubeEmbedUrl(video.videoUrl);

    return (
        <main className="flex-1 container mx-auto px-4 py-8">
            <article className="max-w-4xl mx-auto">
                {/* Video Player */}
                <div className="aspect-video mb-6">
                    <iframe
                        src={embedUrl}
                        title={video.title}
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Video Info */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                        {video.title}
                    </h1>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatBengaliDateTime(video.createdAt)}</span>
                            </div>
                            {/* <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{toBengaliDigits(video.viewCount || 0)} বার দেখা হয়েছে</span>
                            </div> */}
                        </div>
                        <span>প্রকাশক: {video.author?.fullName}</span>
                    </div>

                    {video.description && (
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {video.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <CommentSection postId={video.id} />
            </article>
        </main>
    );
}
