import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/categories/[id] - Can accept either ID or slug
// GET /api/categories/[id] - Can accept either ID or slug
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { searchParams } = new URL(request.url);
    const subcategorySlug = searchParams.get('subcategory');
    const { id: identifier } = await params;

    try {
        // Try to find by ID first (if valid UUID), then by slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

        const category = await prisma.category.findFirst({
            where: {
                OR: [
                    ...(isUuid ? [{ id: identifier }] : []),
                    { slug: identifier },
                ],
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // If subcategory is requested, fetch it
        let subcategory = null;
        if (subcategorySlug) {
            subcategory = await prisma.subcategory.findFirst({
                where: {
                    slug: subcategorySlug,
                    parentCategoryId: category.id,
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            });

            if (!subcategory) {
                return NextResponse.json(
                    { error: 'Subcategory not found' },
                    { status: 404 }
                );
            }
        }

        // Fetch posts
        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '36'); // Default to 36 as requested
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            status: 'PUBLISHED',
            categories: {
                some: {
                    id: category.id
                }
            },
            ...(subcategory ? { subcategoryId: subcategory.id } : {}),
        };

        // Get total count and posts in parallel
        const [total, posts] = await Promise.all([
            prisma.post.count({ where }),
            prisma.post.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    excerpt: true,
                    featuredImage: true,
                    publishedAt: true,
                    createdAt: true,
                    viewCount: true,
                    category: {
                        select: {
                            name: true,
                            slug: true
                        }
                    },
                    author: {
                        select: {
                            fullName: true,
                        },
                    },
                },
                orderBy: {
                    publishedAt: 'desc',
                },
                take: limit,
                skip: skip,
            })
        ]);

        return NextResponse.json({
            category,
            subcategory,
            posts,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });
    } catch (error) {
        console.error('Error fetching category data:', error);
        return NextResponse.json(
            { error: 'Error fetching category data' },
            { status: 500 }
        );
    }
}

// PUT /api/categories/[id] - Update category (admin only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: 'Error updating category' },
            { status: 500 }
        );
    }
}

// DELETE /api/categories/[id] - Delete category (admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Error deleting category' },
            { status: 500 }
        );
    }
}
