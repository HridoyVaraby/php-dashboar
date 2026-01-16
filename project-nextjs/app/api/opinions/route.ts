import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/opinions - List opinions with filtering and pagination
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limitParam = searchParams.get('limit');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'latest';
        const withPagination = searchParams.get('withPagination') === 'true';
        const page = parseInt(searchParams.get('page') || '1');

        const where: any = {};

        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive',
            };
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sortBy === 'oldest') {
            orderBy = { createdAt: 'asc' };
        }

        // Handle pagination
        const defaultLimit = withPagination ? 20 : undefined;
        const limit = limitParam ? parseInt(limitParam) : defaultLimit;
        const skip = limit && page ? (page - 1) * limit : undefined;

        const opinions = await prisma.opinion.findMany({
            where,
            orderBy,
            take: limit,
            skip: skip,
            select: {
                id: true,
                title: true,
                excerpt: true,
                authorName: true,
                authorRole: true,
                authorImage: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Return paginated response if pagination is enabled
        if (withPagination) {
            const total = await prisma.opinion.count({ where });
            return NextResponse.json({
                opinions,
                pagination: {
                    total,
                    pages: limit ? Math.ceil(total / limit) : 1,
                    page,
                    limit
                }
            });
        }

        return NextResponse.json(opinions);
    } catch (error) {
        console.error('Error fetching opinions:', error);
        return NextResponse.json({ error: 'Failed to fetch opinions' }, { status: 500 });
    }
}

const opinionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    excerpt: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
    authorName: z.string().min(1, 'Author name is required'),
    authorRole: z.string().optional(),
    authorImage: z.string().optional(),
    publishedAt: z.string().optional(),
});

// POST /api/opinions - Create new opinion
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await req.json();
        const data = opinionSchema.parse(json);

        const opinion = await prisma.opinion.create({
            data: {
                ...data,
                createdBy: session.user.id,
            },
        });

        return NextResponse.json(opinion, { status: 201 });
    } catch (error) {
        console.error('Error creating opinion:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create opinion' }, { status: 500 });
    }
}
