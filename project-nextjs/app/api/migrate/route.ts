import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('Migration API handler started');
    try {
        // Initialize clients inside handler to catch errors
        const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://yxtcwkykmpatavpgfzej.supabase.co";
        const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGN3a3lrbXBhdGF2cGdmemVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTcxMzksImV4cCI6MjA2MzU5MzEzOX0.2Qnu-bUjuWhP8tNH_kQfcX1LrsjpiCFcvumGwikCcgk";

        console.log('Initializing Supabase...');
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        console.log('Initializing Prisma...');
        const prisma = new PrismaClient();

        const results = {
            categories: 0,
            tags: 0,
            profiles: 0,
            posts: 0,
            errors: [] as string[]
        };

        // 1. Migrate Categories
        console.log('Fetching categories...');
        const { data: categories, error: catError } = await supabase.from('categories').select('*');
        if (catError) {
            console.error('Categories error:', catError);
            results.errors.push(`Categories error: ${catError.message}`);
        } else if (categories) {
            console.log(`Found ${categories.length} categories`);
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
                results.categories++;
            }
        }

        // ... (skip other parts for brevity if debugging, but I'll include them)
        // I'll just do categories first to test connectivity.

        await prisma.$disconnect();
        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error('Migration API Critical Error:', error);
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
