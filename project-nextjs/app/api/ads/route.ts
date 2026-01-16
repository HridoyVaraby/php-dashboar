import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/ads - List ads
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const location = searchParams.get('location');

        const ads = await prisma.advertisement.findMany({
            where: {
                // If location is provided, filter by it. Otherwise return all (for admin)
                // Note: Admin might want to see inactive ads too, so we might need to adjust this logic based on who is calling
                // For now, let's assume this endpoint is used by both public (filtered) and admin (all)
                // But typically admin would use a separate query or we check auth.
                // Given the current usage in AdminAdsPage, it expects all ads.
                // The public site probably filters by isActive: true.
                // Let's return all ads if no location is specified (admin view), 
                // and only active ads if location is specified (public view).
                ...(location ? { location, isActive: true } : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(ads);
    } catch (error) {
        console.error('Error fetching ads:', error);
        return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
    }
}

const adSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    imageUrl: z.string().url('Invalid image URL'),
    linkUrl: z.string().url('Invalid link URL'),
    location: z.string().min(1, 'Location is required'),
    isActive: z.boolean().default(true),
});

// POST /api/ads - Create new ad
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await req.json();
        const data = adSchema.parse(json);

        const ad = await prisma.advertisement.create({
            data,
        });

        return NextResponse.json(ad, { status: 201 });
    } catch (error) {
        console.error('Error creating ad:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
    }
}
