'use client';

import { useIncrementView } from '@/hooks/use-post';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, Eye, Pencil } from 'lucide-react';
import AdBanner from '@/components/sections/AdBanner';
import CommentSection from '@/components/comments/CommentSection';
import RelatedNews from '@/components/sections/RelatedNews';
import { formatBengaliDateTime, toBengaliDigits } from '@/lib/bengali-date-utils';

interface PostClientProps {
    post: any; // Replace with proper type if available
}

export default function PostClient({ post }: PostClientProps) {
    const { mutate: incrementView } = useIncrementView();
    const { canAccessDashboard } = useAuth();

    useEffect(() => {
        if (post?.id) {
            incrementView(post.id);
        }
    }, [post?.id, incrementView]);

    const formatContent = (content: string) => {
        if (!content) return '';
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
            .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4 mt-6">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-3 mt-5">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
            .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
            .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$2</li>')
            .replace(/<span style="color: (#[0-9a-fA-F]{6})">(.*?)<\/span>/g, '<span style="color: $1">$2</span>')
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
            .replace(/\n/g, '<br>');
    };

    if (!post) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">পোস্ট পাওয়া যায়নি</h1>
                    <p className="text-gray-600 mb-8">দুঃখিত, এই পোস্টটি খুঁজে পাওয়া যায়নি।</p>
                    <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                        হোমে ফিরুন
                    </Link>
                </div>
            </main>
        );
    }

    const tags = post.postTags?.map((pt: any) => ({ name: pt.tag.name, slug: pt.tag.slug })) || [];

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Edit Button - Only visible to admin/editor users */}
                {canAccessDashboard && (
                    <div className="mb-4">
                        <Link
                            href={`/admin/posts/edit/${post.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                        >
                            <Pencil className="w-4 h-4" />
                            পোস্ট সম্পাদনা করুন
                        </Link>
                    </div>
                )}

                {/* Breadcrumb */}
                <nav className="text-sm text-gray-600 mb-6">
                    <Link href="/" className="hover:text-black">হোম</Link>
                    <span className="mx-2">/</span>
                    <Link href={`/category/${post.category?.slug}`} className="hover:text-black">
                        {post.category?.name}
                    </Link>
                    {post.subcategory && (
                        <>
                            <span className="mx-2">/</span>
                            <span className="text-black">{post.subcategory.name}</span>
                        </>
                    )}
                </nav>

                {/* Article Header */}
                <article className="bg-white">
                    <header className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-red-600 text-white px-3 py-1 text-sm font-medium">
                                {post.category?.name}
                            </span>
                            {post.subcategory && (
                                <span className="bg-gray-600 text-white px-3 py-1 text-sm font-medium">
                                    {post.subcategory.name}
                                </span>
                            )}
                        </div>

                        {post.subtitle && (
                            <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-2">
                                {post.subtitle}
                            </h2>
                        )}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{post.author?.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <time>{formatBengaliDateTime(post.publishedAt || post.createdAt)}</time>
                            </div>

                            {/* {post.viewCount > 0 && (
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    <span>{toBengaliDigits(post.viewCount)} বার পড়া হয়েছে</span>
                                </div>
                            )} */}
                        </div>
                    </header>

                    {/* Featured Image */}
                    {post.featuredImage && (
                        <div className="mb-8">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-[400px] object-cover rounded-lg"
                            />
                        </div>
                    )}

                    {/* Excerpt */}
                    {post.excerpt && (
                        <div className="mb-6 p-4 bg-gray-50 border-l-4 border-black italic text-gray-700">
                            {post.excerpt}
                        </div>
                    )}

                    {/* Article Content */}
                    <div
                        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: formatContent(post.content)
                        }}
                    />

                    {/* Mid-content Ad */}
                    <div className="my-12">
                        <AdBanner />
                    </div>

                    {/* Article Footer */}
                    <footer className="mt-12 pt-8 border-t border-gray-200">
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm text-gray-600">ট্যাগ:</span>
                                {tags.map((tag: { name: string; slug: string }) => (
                                    <Link
                                        key={tag.slug}
                                        href={`/tag/${encodeURIComponent(tag.slug)}`}
                                        className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded hover:bg-gray-200 cursor-pointer"
                                    >
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </footer>
                </article>

                {/* Comments Section */}
                <CommentSection postId={post.id} />

                {/* Post-comments Ad */}
                <div className="my-12">
                    <AdBanner />
                </div>

                {/* Related News */}
                <RelatedNews category={post.category?.name} currentPostId={post.id} />
            </div>
        </main>
    );
}
