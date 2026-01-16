'use client';

import Link from "next/link";
import { Calendar } from "lucide-react";
import { usePosts, Post } from '@/hooks/use-posts';

import { formatBengaliDateTime } from '@/lib/bengali-date-utils';

const CategoryPosts = () => {
    // Fetch latest posts
    const { data: latestPosts, isLoading: latestLoading } = usePosts({ limit: 8 });

    // Fetch Bangladesh (জাতীয়) category posts
    const { data: specialPosts, isLoading: specialLoading } = usePosts({ category: 'bangladesh', limit: 8 });

    // Fetch Narayanganj category posts
    const { data: narayanganjPosts, isLoading: narayanganjLoading } = usePosts({ category: 'narayanganj', limit: 8 });

    const isLoading = latestLoading || specialLoading || narayanganjLoading;

    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded mb-6"></div>
                            <div className="space-y-4">
                                {[...Array(8)].map((_, j) => (
                                    <div key={j} className="flex gap-3">
                                        <div className="w-20 h-20 bg-gray-200 rounded"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    const PostCard = ({ post }: { post: Post }) => (
        <Link href={`/post/${post.id}`} className="group block">
            <article className="flex gap-3 pb-4 border-b border-gray-200 last:border-b-0">
                <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded">
                    <img
                        src={post.featuredImage || `https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=150&h=150&fit=crop`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                        {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatBengaliDateTime(post.publishedAt || post.createdAt)}</span>
                    </div>
                </div>
            </article>
        </Link>
    );

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Latest Posts Column */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">সর্বশেষ সংবাদ</h2>
                        <Link href="/posts" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            আরো দেখুন →
                        </Link>
                    </div>
                    <div className="space-y-1">
                        {latestPosts && latestPosts.length > 0 ? (
                            latestPosts.map((post) => <PostCard key={post.id} post={post} />)
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>কোন পোস্ট পাওয়া যায়নি</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bangladesh (জাতীয়) Posts Column */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">জাতীয় সংবাদ</h2>
                        <Link href="/category/bangladesh" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            আরো দেখুন →
                        </Link>
                    </div>
                    <div className="space-y-1">
                        {specialPosts && specialPosts.length > 0 ? (
                            specialPosts.map((post) => <PostCard key={post.id} post={post} />)
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>কোন জাতীয় পোস্ট পাওয়া যায়নি</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Narayanganj Posts Column */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">নারায়ণগঞ্জ</h2>
                        <Link href="/category/narayanganj" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            আরো দেখুন →
                        </Link>
                    </div>
                    <div className="space-y-1">
                        {narayanganjPosts && narayanganjPosts.length > 0 ? (
                            narayanganjPosts.map((post) => <PostCard key={post.id} post={post} />)
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>কোন পোস্ট পাওয়া যায়নি</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryPosts;
