import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get comprehensive statistics
        const [
            postsCount,
            videosCount,
            opinionsCount,
            usersCount,
            commentsCount,
            categoriesCount,
        ] = await Promise.all([
            prisma.post.count(),
            prisma.video.count(),
            prisma.opinion.count(),
            prisma.profile.count(),
            prisma.comment.count(),
            prisma.category.count(),
        ]);

        // Get total views from posts
        const postsWithViews = await prisma.post.aggregate({
            _sum: {
                viewCount: true,
            },
        });

        // Get recent posts (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentPostsCount = await prisma.post.count({
            where: {
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
        });

        return NextResponse.json({
            posts: postsCount,
            videos: videosCount,
            opinions: opinionsCount,
            users: usersCount,
            comments: commentsCount,
            categories: categoriesCount,
            views: postsWithViews._sum.viewCount || 0,
            recentPosts: recentPostsCount,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Error fetching statistics' },
            { status: 500 }
        );
    }
}
