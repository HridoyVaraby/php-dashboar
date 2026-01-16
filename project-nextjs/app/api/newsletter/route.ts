import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = schema.parse(body);

        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
        }

        await prisma.newsletterSubscriber.create({
            data: { email },
        });

        return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const subscribers = await prisma.newsletterSubscriber.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(subscribers);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
}
