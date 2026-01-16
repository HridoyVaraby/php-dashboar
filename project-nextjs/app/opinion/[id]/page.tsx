'use client';

import { useParams } from 'next/navigation';
import { useOpinion } from '@/hooks/use-opinions';
import CommentSection from '@/components/comments/CommentSection';
import { Calendar } from 'lucide-react';
import { formatBengaliDateTime } from '@/lib/bengali-date-utils';

export default function OpinionPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: opinion, isLoading, error } = useOpinion(id);

    if (isLoading) {
        return (
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
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

    if (error || !opinion) {
        return (
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">মতামত পাওয়া যায়নি</h1>
                    <p className="text-gray-600">এই মতামতটি খুঁজে পাওয়া যায়নি অথবা মুছে ফেলা হয়েছে।</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 container mx-auto px-4 py-8">
            <article className="max-w-4xl mx-auto">
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                            src={opinion.authorImage || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"}
                            alt={opinion.authorName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{opinion.authorName}</h3>
                        {opinion.authorRole && (
                            <p className="text-gray-600">{opinion.authorRole}</p>
                        )}
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            <time>{formatBengaliDateTime(opinion.createdAt)}</time>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {opinion.title}
                </h1>

                {/* Excerpt */}
                {opinion.excerpt && (
                    <div className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-blue-500 pl-6">
                        {opinion.excerpt}
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <div
                        className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: opinion.content.replace(/\n/g, '<br>') }}
                    />
                </div>

                {/* Comments Section */}
                <CommentSection postId={opinion.id} />
            </article>
        </main>
    );
}
