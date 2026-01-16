import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.video.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error incrementing video view count:', error);
        return NextResponse.json(
            { error: 'Error incrementing view count' },
            { status: 500 }
        );
    }
}
