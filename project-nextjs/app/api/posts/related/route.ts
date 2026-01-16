import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const excludeId = searchParams.get('excludeId');

    if (!category) {
        return NextResponse.json(
            { error: 'Category is required' },
            { status: 400 }
        );
    }

    try {
        const posts = await prisma.post.findMany({
            where: {
                status: 'PUBLISHED',
                category: {
                    name: category,
                },
                NOT: {
                    id: excludeId || undefined,
                },
            },
            select: {
                id: true,
                title: true,
                featuredImage: true,
                publishedAt: true,
                createdAt: true,
                category: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                publishedAt: 'desc',
            },
            take: 3,
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching related posts:', error);
        return NextResponse.json(
            { error: 'Error fetching related posts' },
            { status: 500 }
        );
    }
}
