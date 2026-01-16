import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                category: true,
                subcategory: true,
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                postTags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { error: 'Error fetching post' },
            { status: 500 }
        );
    }
}


export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const data = await request.json();

        // Handle array inputs
        const categoryId = data.categoryIds?.[0] || data.categoryId;
        const subcategoryId = data.subcategoryIds?.[0] || data.subcategoryId;

        // Transaction to handle tags update
        const post = await prisma.$transaction(async (tx) => {
            // 1. If this post is being set as featured with a position, remove others from that position
            if (data.isFeatured && data.featuredPosition) {
                await tx.post.updateMany({
                    where: {
                        isFeatured: true,
                        featuredPosition: data.featuredPosition,
                        id: { not: id }, // Exclude current post
                    },
                    data: {
                        isFeatured: false,
                        featuredPosition: null,
                    },
                });
            }

            // 2. Update basic fields
            const updatedPost = await tx.post.update({
                where: { id },
                data: {
                    title: data.title,
                    content: data.content,
                    excerpt: data.excerpt,
                    featuredImage: data.featuredImage,
                    categoryId: categoryId,
                    subcategoryId: subcategoryId,
                    status: data.status,
                    isFeatured: data.isFeatured,
                    subtitle: data.subtitle,
                    featuredPosition: data.featuredPosition,
                    publishedAt: data.publishedAt,
                },
            });

            // 2. Update tags if provided
            if (data.tagIds) {
                // Delete existing tags
                await tx.postTag.deleteMany({
                    where: { postId: id },
                });

                // Create new tags
                if (data.tagIds.length > 0) {
                    await tx.postTag.createMany({
                        data: data.tagIds.map((tagId: string) => ({
                            postId: id,
                            tagId,
                        })),
                    });
                }
            }

            // 3. Update Categories (Many-to-Many) & Sync Id
            if (data.categoryIds) {
                // We also maintain the legacy categoryId (first one)
                const firstCategoryId = data.categoryIds[0];

                await tx.post.update({
                    where: { id },
                    data: {
                        categoryId: firstCategoryId, // Sync legacy field
                        categories: {
                            set: data.categoryIds.map((catId: string) => ({ id: catId })) // Replace all categories
                        }
                    }
                });
            }

            return updatedPost;
        });

        // Fetch final result with relations
        const finalPost = await prisma.post.findUnique({
            where: { id },
            include: {
                category: true,
                categories: true,
                subcategory: true,
                author: true,
                postTags: { include: { tag: true } },
            },
        });

        return NextResponse.json(finalPost);
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Error updating post' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;

        await prisma.post.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Error deleting post' },
            { status: 500 }
        );
    }
}
