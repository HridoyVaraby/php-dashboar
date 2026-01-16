import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const video = await prisma.video.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
        });

        if (!video) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        return NextResponse.json(video);
    } catch (error) {
        console.error('Error fetching video:', error);
        return NextResponse.json(
            { error: 'Error fetching video' },
            { status: 500 }
        );
    }
}

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

        const video = await prisma.video.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                videoUrl: data.videoUrl, // Fixed field name from youtubeUrl to videoUrl based on schema
                thumbnail: data.thumbnail, // Fixed field name from thumbnailUrl to thumbnail based on schema
                featuredPosition: data.featuredPosition,
                publishedAt: data.publishedAt,
            },
        });

        return NextResponse.json(video);
    } catch (error) {
        console.error('Error updating video:', error);
        return NextResponse.json(
            { error: 'Error updating video' },
            { status: 500 }
        );
    }
}

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

        await prisma.video.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting video:', error);
        return NextResponse.json(
            { error: 'Error deleting video' },
            { status: 500 }
        );
    }
}
