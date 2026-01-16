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

        // Fetch recent activities from different sources
        const [recentPosts, recentComments, recentUsers, recentVideos] = await Promise.all([
            // Recent posts
            prisma.post.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    author: {
                        select: {
                            fullName: true,
                        },
                    },
                },
            }),
            // Recent comments
            prisma.comment.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    user: {
                        select: {
                            fullName: true,
                        },
                    },
                },
            }),
            // Recent users
            prisma.profile.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    createdAt: true,
                },
            }),
            // Recent videos
            prisma.video.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                },
            }),
        ]);

        // Combine and format activities
        const activities = [
            ...recentPosts.map(post => ({
                type: 'post',
                title: `নতুন পোস্ট প্রকাশিত`,
                description: `${post.author.fullName} "${post.title.substring(0, 50)}${post.title.length > 50 ? '...' : ''}" পোস্ট করেছেন`,
                createdAt: post.createdAt,
            })),
            ...recentComments.map(comment => ({
                type: 'comment',
                title: `নতুন মন্তব্য`,
                description: `${comment.user.fullName} একটি মন্তব্য করেছেন`,
                createdAt: comment.createdAt,
            })),
            ...recentUsers.map(user => ({
                type: 'user',
                title: `নতুন ইউজার নিবন্ধিত`,
                description: `${user.fullName} (${user.email}) যোগ দিয়েছেন`,
                createdAt: user.createdAt,
            })),
            ...recentVideos.map(video => ({
                type: 'video',
                title: `নতুন ভিডিও আপলোড`,
                description: `"${video.title.substring(0, 50)}${video.title.length > 50 ? '...' : ''}" আপলোড করা হয়েছে`,
                createdAt: video.createdAt,
            })),
        ];

        // Sort by creation date and limit to 10 most recent
        const sortedActivities = activities
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10);

        return NextResponse.json(sortedActivities);
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        return NextResponse.json(
            { error: 'Error fetching recent activity' },
            { status: 500 }
        );
    }
}
