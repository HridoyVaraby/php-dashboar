import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/subcategories - List subcategories
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId');

        const where: any = {};

        if (categoryId) {
            where.categoryId = categoryId;
        }

        const subcategories = await prisma.subcategory.findMany({
            where,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(subcategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subcategories' },
            { status: 500 }
        );
    }
}

const subcategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    parentCategoryId: z.string().uuid('Parent category ID is required'),
});

// POST /api/subcategories - Create subcategory
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await req.json();
        const data = subcategorySchema.parse(json);

        const subcategory = await prisma.subcategory.create({
            data: {
                name: data.name,
                slug: data.slug,
                parentCategoryId: data.parentCategoryId,
            },
        });

        return NextResponse.json(subcategory, { status: 201 });
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create subcategory' }, { status: 500 });
    }
}
