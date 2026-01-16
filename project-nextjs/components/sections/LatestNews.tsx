'use client';

import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { usePosts } from '@/hooks/use-posts';

import { formatBengaliDateTime } from '@/lib/bengali-date-utils';

const LatestNews = () => {
    const { data: posts, isLoading } = usePosts({ limit: 8 });

    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">সর্বশেষ সংবাদ</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
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
            </section>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <section className="container mx-auto px-4 py-12">
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">কোন পোস্ট পাওয়া যায়নি</h2>
                    <p className="text-gray-600">অনুগ্রহ করে অ্যাডমিন প্যানেল থেকে পোস্ট তৈরি করুন।</p>
                </div>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">সর্বশেষ সংবাদ</h2>
                <Link href="/posts" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                    সব দেখুন
                    <span>→</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {posts.map((item) => {
                    return (
                        <Link key={item.id} href={`/post/${item.id}`} className="group">
                            <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={item.featuredImage || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=200&fit=crop"}
                                        alt={item.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {item.category && (
                                        <span className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded">
                                            {item.category.name}
                                        </span>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {item.excerpt}
                                    </p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatBengaliDateTime(item.publishedAt || item.createdAt)}</span>
                                        </div>

                                    </div>
                                </div>
                            </article>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default LatestNews;
