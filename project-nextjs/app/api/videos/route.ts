import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/videos - List videos with filtering and pagination
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limitParam = searchParams.get('limit');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'latest';
        const featuredPosition = searchParams.get('featuredPosition');
        const withPagination = searchParams.get('withPagination') === 'true';
        const page = parseInt(searchParams.get('page') || '1');

        const where: any = {};

        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive',
            };
        }

        if (featuredPosition === 'true') {
            where.featuredPosition = { not: null };
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sortBy === 'oldest') {
            orderBy = { createdAt: 'asc' };
        } else if (sortBy === 'popular') {
            orderBy = { viewCount: 'desc' };
        } else if (sortBy === 'featured_position') {
            orderBy = { featuredPosition: 'asc' };
        }

        // Handle pagination
        const defaultLimit = withPagination ? 20 : undefined;
        const limit = limitParam ? parseInt(limitParam) : defaultLimit;
        const skip = limit && page ? (page - 1) * limit : undefined;

        const videos = await prisma.video.findMany({
            where,
            orderBy,
            take: limit,
            skip: skip,
            select: {
                id: true,
                title: true,
                description: true,
                videoUrl: true,
                thumbnail: true,
                viewCount: true,
                createdAt: true,
                publishedAt: true,
                featuredPosition: true,
                author: {
                    select: {
                        fullName: true,
                    },
                },
            },
        });

        // Return paginated response if pagination is enabled
        if (withPagination) {
            const total = await prisma.video.count({ where });
            return NextResponse.json({
                videos,
                pagination: {
                    total,
                    pages: limit ? Math.ceil(total / limit) : 1,
                    page,
                    limit
                }
            });
        }

        return NextResponse.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
}

const videoSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    videoUrl: z.string().url('Invalid video URL'),
    thumbnail: z.string().optional(),
    featuredPosition: z.number().int().optional().nullable(),
    publishedAt: z.string().optional(),
});

// POST /api/videos - Create new video
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await req.json();
        const data = videoSchema.parse(json);

        const video = await prisma.video.create({
            data: {
                ...data,
                authorId: session.user.id,
            },
        });

        return NextResponse.json(video, { status: 201 });
    } catch (error) {
        console.error('Error creating video:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
    }
}
