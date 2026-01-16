import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

        const subcategory = await prisma.subcategory.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                parentCategoryId: data.categoryId, // Fixed field name from categoryId to parentCategoryId based on schema
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(subcategory);
    } catch (error) {
        console.error('Error updating subcategory:', error);
        return NextResponse.json(
            { error: 'Error updating subcategory' },
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

        await prisma.subcategory.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        return NextResponse.json(
            { error: 'Error deleting subcategory' },
            { status: 500 }
        );
    }
}
