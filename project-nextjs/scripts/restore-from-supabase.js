const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://yxtcwkykmpatavpgfzej.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGN3a3lrbXBhdGF2cGdmemVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTcxMzksImV4cCI6MjA2MzU5MzEzOX0.2Qnu-bUjuWhP8tNH_kQfcX1LrsjpiCFcvumGwikCcgk";

async function fetchData(table) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${table}: ${response.statusText}`);
    }
    return response.json();
}

async function main() {
    console.log('Starting restoration...');

    // 1. Profiles
    console.log('Fetching profiles...');
    const profiles = await fetchData('profiles');
    console.log(`Found ${profiles.length} profiles`);

    for (const p of profiles) {
        await prisma.profile.upsert({
            where: { email: p.id + '@placeholder.com' }, // Supabase profiles don't have email in public table usually, but let's check. 
            // Wait, Supabase public.profiles usually doesn't store email. It's in auth.users.
            // If I can't get email, I'll generate a placeholder.
            // Actually, let's check if I can get email. If not, I'll use `id@restored.com`.
            // But wait, the local schema requires unique email.
            // If I use placeholder, they can't login.
            // But I can't get real emails from Supabase public API.
            // I will use `username@restored.com` or `id@restored.com`.
            // The user can update it later.
            update: {},
            create: {
                id: p.id,
                fullName: p.full_name || 'Unknown',
                email: `${p.id}@restored.com`, // Placeholder
                password: '$2b$10$ANFvYSpphDh.OxavmtaHMO8HenQErjTTg8pXAnA2NRsdrPXwfwcgm', // password123
                avatarUrl: p.avatar_url,
                role: p.role ? p.role.toUpperCase() : 'READER',
                createdAt: new Date(p.created_at),
                updatedAt: new Date(p.updated_at),
            }
        });
    }

    // 2. Categories
    console.log('Fetching categories...');
    const categories = await fetchData('categories');
    for (const c of categories) {
        await prisma.category.upsert({
            where: { id: c.id },
            update: {},
            create: {
                id: c.id,
                name: c.name,
                slug: c.slug,
                createdAt: new Date(c.created_at),
                updatedAt: new Date(c.updated_at),
            }
        });
    }

    // 3. Subcategories
    console.log('Fetching subcategories...');
    const subcategories = await fetchData('subcategories');
    for (const s of subcategories) {
        await prisma.subcategory.upsert({
            where: { id: s.id },
            update: {},
            create: {
                id: s.id,
                name: s.name,
                slug: s.slug,
                parentCategoryId: s.parent_category_id,
                createdAt: new Date(s.created_at),
                updatedAt: new Date(s.updated_at),
            }
        });
    }

    // 4. Tags
    console.log('Fetching tags...');
    const tags = await fetchData('tags');
    for (const t of tags) {
        await prisma.tag.upsert({
            where: { id: t.id },
            update: {},
            create: {
                id: t.id,
                name: t.name,
                slug: t.slug,
                createdAt: new Date(t.created_at),
                updatedAt: new Date(t.updated_at),
            }
        });
    }

    // 5. Posts
    console.log('Fetching posts...');
    const posts = await fetchData('posts');
    for (const p of posts) {
        await prisma.post.upsert({
            where: { id: p.id },
            update: {},
            create: {
                id: p.id,
                title: p.title,
                content: p.content || '',
                excerpt: p.excerpt,
                featuredImage: p.featured_image,
                categoryId: p.category_id,
                subcategoryId: p.subcategory_id,
                authorId: p.author_id,
                status: p.status ? p.status.toUpperCase() : 'DRAFT',
                isFeatured: p.is_featured || false,
                viewCount: p.view_count || 0,
                publishedAt: p.published_at ? new Date(p.published_at) : new Date(),
                createdAt: new Date(p.created_at),
                updatedAt: new Date(p.updated_at),
            }
        });
    }

    // 6. Videos
    console.log('Fetching videos...');
    const videos = await fetchData('videos');
    for (const v of videos) {
        await prisma.video.upsert({
            where: { id: v.id },
            update: {},
            create: {
                id: v.id,
                title: v.title,
                description: v.description,
                videoUrl: v.video_url,
                thumbnail: v.thumbnail,
                authorId: v.author_id,
                viewCount: v.view_count || 0,
                publishedAt: v.published_at ? new Date(v.published_at) : new Date(),
                createdAt: new Date(v.created_at),
            }
        });
    }

    // 7. Opinions
    console.log('Fetching opinions...');
    const opinions = await fetchData('opinions');
    for (const o of opinions) {
        await prisma.opinion.upsert({
            where: { id: o.id },
            update: {},
            create: {
                id: o.id,
                title: o.title,
                excerpt: o.excerpt,
                content: o.content,
                authorName: o.author_name,
                authorRole: o.author_role,
                authorImage: o.author_image,
                createdBy: o.created_by,
                createdAt: new Date(o.created_at),
                updatedAt: new Date(o.updated_at),
            }
        });
    }

    // 8. Comments
    console.log('Fetching comments...');
    const comments = await fetchData('comments');
    // Sort comments to insert parents first? 
    // Actually, if parentId exists, the parent must exist.
    // We can try inserting all, and if it fails due to missing parent, retry?
    // Or just sort by createdAt.
    comments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    for (const c of comments) {
        try {
            await prisma.comment.upsert({
                where: { id: c.id },
                update: {},
                create: {
                    id: c.id,
                    postId: c.post_id,
                    userId: c.user_id,
                    parentId: c.parent_id,
                    content: c.content,
                    isApproved: c.is_approved || false,
                    createdAt: new Date(c.created_at),
                    updatedAt: new Date(c.updated_at),
                }
            });
        } catch (e) {
            console.error(`Failed to insert comment ${c.id}:`, e.message);
        }
    }

    // 9. Newsletter Subscribers
    console.log('Fetching newsletter subscribers...');
    const subscribers = await fetchData('newsletter_subscribers');
    for (const s of subscribers) {
        await prisma.newsletterSubscriber.upsert({
            where: { id: s.id },
            update: {},
            create: {
                id: s.id,
                email: s.email,
                createdAt: new Date(s.created_at),
            }
        });
    }

    console.log('Restoration completed successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
