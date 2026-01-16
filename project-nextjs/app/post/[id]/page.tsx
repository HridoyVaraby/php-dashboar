import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import PostClient from '@/components/post/PostClient';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

async function getPost(id: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                category: true,
                subcategory: true,
                postTags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });
        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        return {
            title: 'পোস্ট পাওয়া যায়নি',
        };
    }

    return {
        title: post.title,
        description: post.excerpt || post.content.substring(0, 160),
        alternates: {
            canonical: `/post/${id}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            url: `/post/${id}`,
            type: 'article',
            publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
            authors: [post.author?.fullName || 'NewsViewBD'],
            images: [
                {
                    url: post.featuredImage || '/newsview.webp',
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            images: [post.featuredImage || '/newsview.webp'],
        },
    };
}

export default async function PostPage({ params }: Props) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    return <PostClient post={post} />;
}
