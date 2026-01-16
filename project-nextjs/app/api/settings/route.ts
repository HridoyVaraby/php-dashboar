import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Default settings
const DEFAULT_SETTINGS = {
    siteName: 'NewsViewBD',
    siteDescription: 'বাংলাদেশের অগ্রণী সংবাদ পোর্টাল',
    siteUrl: 'https://newsviewbd.com',
    logoUrl: '/logo.svg',
    faviconUrl: '/favicon.ico',
    contactEmail: 'contact@newsviewbd.com',
    socialFacebook: '',
    socialTwitter: '',
    socialYoutube: '',
    enableComments: true,
    enableNewsletter: true,
    maintenanceMode: false,
    postsPerPage: 10,
    enableAds: true,
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            // Create default settings if none exist
            settings = await prisma.siteSettings.create({
                data: DEFAULT_SETTINGS,
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Error fetching settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Remove id and updatedAt from data if present to avoid conflicts
        const { id, updatedAt, ...updateData } = data;

        const settings = await prisma.siteSettings.findFirst();

        let updatedSettings;
        if (settings) {
            updatedSettings = await prisma.siteSettings.update({
                where: { id: settings.id },
                data: updateData,
            });
        } else {
            updatedSettings = await prisma.siteSettings.create({
                data: updateData,
            });
        }

        return NextResponse.json(updatedSettings);
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { error: 'Error updating settings' },
            { status: 500 }
        );
    }
}
