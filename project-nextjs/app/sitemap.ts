import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://newsviewbd.com';

    // Static routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/careers',
        '/advertise',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    const posts = await prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
    });

    const postRoutes = posts.map((post) => ({
        url: `${baseUrl}/post/${post.id}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Fetch categories
    const categories = await prisma.category.findMany({
        select: { slug: true },
    });

    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    return [...routes, ...categoryRoutes, ...postRoutes];
}
