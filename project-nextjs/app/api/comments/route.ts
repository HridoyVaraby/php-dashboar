import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';

const createCommentSchema = z.object({
    content: z.string().min(1, 'Comment cannot be empty'),
    postId: z.string().uuid(),
    parentId: z.string().uuid().optional(),
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        const isAdminOrEditor = user && ['ADMIN', 'EDITOR'].includes(user.role);

        const whereClause: any = {
            parentId: null,
        };

        if (postId) {
            whereClause.postId = postId;

            if (isAdminOrEditor) {
                // Admins see all comments
            } else if (user) {
                // Users see approved comments AND their own unapproved comments
                whereClause.OR = [
                    { isApproved: true },
                    { userId: user.id }
                ];
            } else {
                // Guests only see approved comments
                whereClause.isApproved = true;
            }
        }
        // If no postId, we assume it's for admin view (handled by isAdminOrEditor check ideally, but currently open for admin panel usage which sends no postId)

        // Fetch top-level comments
        const comments = await prisma.comment.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                replies: {
                    where: isAdminOrEditor ? {} : (user ? {
                        OR: [
                            { isApproved: true },
                            { userId: user.id }
                        ]
                    } : {
                        isApproved: true
                    }),
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { error: 'Error fetching comments' },
            { status: 500 }
        );
    }
}



export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validation = createCommentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues },
                { status: 400 }
            );
        }

        const { content, postId, parentId } = validation.data;

        // Assuming session.user.id is available and correct
        // In NextAuth with Prisma adapter, this should be the user ID

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: postId,
                userId: session.user.id as string,
                parentId: parentId,
                isApproved: false, // Comments require approval by default
            },
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Error creating comment' },
            { status: 500 }
        );
    }
}
