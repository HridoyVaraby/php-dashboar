'use client';

import { useRelatedPosts } from '@/hooks/use-related-posts';
import Link from 'next/link';
import { Clock } from 'lucide-react';

import { formatBengaliDateTime } from '@/lib/bengali-date-utils';

const RelatedNews = ({ category, currentPostId }: { category: string; currentPostId: string }) => {
    const { data: relatedNews, isLoading } = useRelatedPosts(category, currentPostId);

    if (isLoading) {
        return (
            <section className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">সম্পর্কিত সংবাদ</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!relatedNews || relatedNews.length === 0) {
        return null;
    }

    return (
        <section className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">সম্পর্কিত সংবাদ</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((news: any) => (
                    <Link key={news.id} href={`/post/${news.id}`} className="group">
                        <article className="flex flex-col">
                            <div className="relative overflow-hidden rounded-lg mb-3">
                                <img
                                    src={news.featuredImage || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=120&h=80&fit=crop"}
                                    alt={news.title}
                                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {news.title}
                            </h3>

                            <div className="mt-auto flex items-center gap-4 text-xs text-gray-500">
                                <span>{formatBengaliDateTime(news.publishedAt || news.createdAt)}</span>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RelatedNews;
