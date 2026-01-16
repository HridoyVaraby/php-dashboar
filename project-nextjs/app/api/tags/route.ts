import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/tags - List tags
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');

        const where: any = {};

        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            };
        }

        const tags = await prisma.tag.findMany({
            where,
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                    select: {
                        postTags: true,
                    },
                },
            },
        });

        return NextResponse.json(tags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
}

const tagSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
});

// POST /api/tags - Create tag
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await req.json();
        const data = tagSchema.parse(json);

        const tag = await prisma.tag.create({
            data: {
                name: data.name,
                slug: data.slug,
            },
        });

        return NextResponse.json(tag, { status: 201 });
    } catch (error) {
        console.error('Error creating tag:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
    }
}
