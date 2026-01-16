import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listImages, getImageUrl } from '@/lib/minio';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const objectNames = await listImages();

        // Map object names to full URLs
        const images = objectNames.map(name => ({
            name,
            url: getImageUrl(name)
        }));

        return NextResponse.json({ images });
    } catch (error) {
        console.error('Error fetching media:', error);
        return NextResponse.json(
            { error: 'Failed to fetch media' },
            { status: 500 }
        );
    }
}
