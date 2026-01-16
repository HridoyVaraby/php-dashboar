import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch single opinion
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const opinion = await prisma.opinion.findUnique({
            where: { id },
        });

        if (!opinion) {
            return NextResponse.json({ error: 'Opinion not found' }, { status: 404 });
        }

        return NextResponse.json(opinion);
    } catch (error) {
        console.error('Error fetching opinion:', error);
        return NextResponse.json(
            { error: 'Error fetching opinion' },
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

        const opinion = await prisma.opinion.update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                excerpt: data.excerpt,
                authorName: data.authorName,
                authorRole: data.authorRole, // Fixed field name from authorBio to authorRole based on schema
                authorImage: data.authorImage,
                publishedAt: data.publishedAt,
            },
        });

        return NextResponse.json(opinion);
    } catch (error) {
        console.error('Error updating opinion:', error);
        return NextResponse.json(
            { error: 'Error updating opinion' },
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

        await prisma.opinion.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting opinion:', error);
        return NextResponse.json(
            { error: 'Error deleting opinion' },
            { status: 500 }
        );
    }
}
