const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

console.log('Robust script started...');

// Manual env loader
function loadEnv(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            console.log('Loading env from:', filePath);
            const content = fs.readFileSync(filePath, 'utf8');
            content.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        } else {
            console.warn('Env file not found:', filePath);
        }
    } catch (e) {
        console.error('Error loading env:', e);
    }
}

// Load envs
loadEnv(path.resolve(process.cwd(), '../.env'));
loadEnv(path.resolve(process.cwd(), '.env'));

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Missing');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Found' : 'Missing');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://yxtcwkykmpatavpgfzej.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGN3a3lrbXBhdGF2cGdmemVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTcxMzksImV4cCI6MjA2MzU5MzEzOX0.2Qnu-bUjuWhP8tNH_kQfcX1LrsjpiCFcvumGwikCcgk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const prisma = new PrismaClient();

async function migrate() {
    console.log('Starting migration...');

    // 1. Migrate Categories
    console.log('Fetching categories from Supabase...');
    const { data: categories, error: catError } = await supabase.from('categories').select('*');
    if (catError) {
        console.error('Error fetching categories:', catError);
    } else if (categories) {
        console.log(`Found ${categories.length} categories. Migrating...`);
        for (const cat of categories) {
            await prisma.category.upsert({
                where: { slug: cat.slug },
                update: {
                    name: cat.name,
                    id: cat.id,
                    createdAt: new Date(cat.created_at),
                    updatedAt: new Date(cat.updated_at),
                },
                create: {
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    createdAt: new Date(cat.created_at),
                    updatedAt: new Date(cat.updated_at),
                },
            });
        }
    }

    // 2. Migrate Tags
    console.log('Fetching tags from Supabase...');
    const { data: tags, error: tagError } = await supabase.from('tags').select('*');
    if (tagError) {
        console.error('Error fetching tags:', tagError);
    } else if (tags) {
        console.log(`Found ${tags.length} tags. Migrating...`);
        for (const tag of tags) {
            await prisma.tag.upsert({
                where: { slug: tag.slug },
                update: {
                    name: tag.name,
                    id: tag.id,
                    createdAt: new Date(tag.created_at),
                    updatedAt: new Date(tag.updated_at),
                },
                create: {
                    id: tag.id,
                    name: tag.name,
                    slug: tag.slug,
                    createdAt: new Date(tag.created_at),
                    updatedAt: new Date(tag.updated_at),
                },
            });
        }
    }

    // 3. Migrate Profiles (Authors)
    console.log('Fetching profiles from Supabase...');
    const { data: profiles, error: profError } = await supabase.from('profiles').select('*');

    if (profError) {
        console.error('Error fetching profiles:', profError);
    } else if (profiles) {
        console.log(`Found ${profiles.length} profiles. Migrating...`);

        const hashedPassword = '$2a$10$EpIxT98h.n/1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1';

        for (const profile of profiles) {
            try {
                let role = 'READER';
                if (profile.role === 'admin') role = 'ADMIN';
                if (profile.role === 'editor') role = 'EDITOR';

                await prisma.profile.upsert({
                    where: { id: profile.id },
                    create: {
                        id: profile.id,
                        fullName: profile.full_name || 'Unknown User',
                        email: `migrated_${profile.id}@example.com`,
                        password: hashedPassword,
                        avatarUrl: profile.avatar_url,
                        role: role,
                        createdAt: new Date(profile.created_at),
                        updatedAt: new Date(profile.updated_at),
                    },
                    update: {
                        fullName: profile.full_name,
                        avatarUrl: profile.avatar_url,
                        role: role,
                        updatedAt: new Date(profile.updated_at),
                    }
                });
            } catch (e) {
                console.error(`Failed to migrate profile ${profile.id}`, e);
            }
        }
    }

    // 4. Migrate Posts
    console.log('Fetching posts from Supabase...');
    const { data: posts, error: postError } = await supabase.from('posts').select('*');
    if (postError) {
        console.error('Error fetching posts:', postError);
    } else if (posts) {
        console.log(`Found ${posts.length} posts. Migrating...`);
        for (const post of posts) {
            try {
                let status = 'PUBLISHED';
                if (post.status === 'draft') status = 'DRAFT';

                await prisma.post.upsert({
                    where: { id: post.id },
                    update: {
                        title: post.title,
                        content: post.content,
                        excerpt: post.excerpt,
                        featuredImage: post.featured_image,
                        status: status,
                        isFeatured: post.is_featured,
                        viewCount: post.view_count,
                        readTime: post.read_time,
                        publishedAt: post.published_at ? new Date(post.published_at) : new Date(),
                        createdAt: new Date(post.created_at),
                        updatedAt: new Date(post.updated_at),
                        categoryId: post.category_id,
                        subcategoryId: post.subcategory_id,
                        authorId: post.author_id,
                    },
                    create: {
                        id: post.id,
                        title: post.title,
                        content: post.content,
                        excerpt: post.excerpt,
                        featuredImage: post.featured_image,
                        status: status,
                        isFeatured: post.is_featured,
                        viewCount: post.view_count,
                        readTime: post.read_time,
                        publishedAt: post.published_at ? new Date(post.published_at) : new Date(),
                        createdAt: new Date(post.created_at),
                        updatedAt: new Date(post.updated_at),
                        categoryId: post.category_id,
                        subcategoryId: post.subcategory_id,
                        authorId: post.author_id,
                    },
                });
            } catch (e) {
                console.error(`Failed to migrate post ${post.id}:`, e);
            }
        }
    }

    console.log('Migration completed.');
}

migrate()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
