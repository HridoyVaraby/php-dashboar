import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch single advertisement
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const ad = await prisma.advertisement.findUnique({
            where: { id },
        });

        if (!ad) {
            return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
        }

        return NextResponse.json(ad);
    } catch (error) {
        console.error('Error fetching ad:', error);
        return NextResponse.json(
            { error: 'Error fetching ad' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { isActive } = await request.json();

        const ad = await prisma.advertisement.update({
            where: { id },
            data: { isActive },
        });

        return NextResponse.json(ad);
    } catch (error) {
        console.error('Error updating ad:', error);
        return NextResponse.json(
            { error: 'Error updating ad' },
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

        const ad = await prisma.advertisement.update({
            where: { id },
            data: {
                title: data.title,
                imageUrl: data.imageUrl,
                linkUrl: data.linkUrl,
                location: data.location, // Fixed field name from position to location based on schema
                isActive: data.isActive,
            },
        });

        return NextResponse.json(ad);
    } catch (error) {
        console.error('Error updating ad:', error);
        return NextResponse.json(
            { error: 'Error updating ad' },
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

        await prisma.advertisement.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting ad:', error);
        return NextResponse.json(
            { error: 'Error deleting ad' },
            { status: 500 }
        );
    }
}
