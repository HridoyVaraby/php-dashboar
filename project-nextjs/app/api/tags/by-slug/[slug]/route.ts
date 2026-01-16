import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tags/by-slug/[slug] - Get tag and its posts by slug
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const decodedSlug = decodeURIComponent(slug);

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '36');
        const skip = (page - 1) * limit;

        // Find the tag by slug
        const tag = await prisma.tag.findUnique({
            where: { slug: decodedSlug },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });

        if (!tag) {
            return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        }

        // Count total posts for pagination
        const total = await prisma.postTag.count({
            where: {
                tagId: tag.id,
                post: {
                    status: 'PUBLISHED',
                },
            },
        });

        // Fetch posts associated with this tag
        const postTags = await prisma.postTag.findMany({
            where: {
                tagId: tag.id,
                post: {
                    status: 'PUBLISHED',
                },
            },
            include: {
                post: {
                    include: {
                        category: { select: { name: true, slug: true } },
                        author: { select: { fullName: true, avatarUrl: true } },
                        postTags: {
                            include: {
                                tag: { select: { name: true, slug: true } },
                            },
                        },
                    },
                },
            },
            orderBy: {
                post: {
                    publishedAt: 'desc',
                },
            },
            take: limit,
            skip: skip,
        });

        const posts = postTags.map((pt) => pt.post);

        return NextResponse.json({
            tag,
            posts,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        });
    } catch (error) {
        console.error('Error fetching tag by slug:', error);
        return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
    }
}
