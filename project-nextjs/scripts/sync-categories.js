
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration: Syncing categoryId to categories relation...');

    // Get all posts that have a categoryId but no categories connected yet
    // To be safe, we can just process all posts. The connect operation is idempotent-ish if we check first,
    // or we can just let it try to connect. 
    // For efficiency, let's fetch all posts.
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            categoryId: true,
            title: true
        }
    });

    console.log(`Found ${posts.length} posts to check/sync.`);

    let validCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const post of posts) {
        if (!post.categoryId) {
            skippedCount++;
            continue;
        }

        try {
            // Update the post to connect the existing categoryId to the new categories list
            await prisma.post.update({
                where: { id: post.id },
                data: {
                    categories: {
                        connect: { id: post.categoryId }
                    }
                }
            });
            validCount++;
            if (validCount % 10 === 0) {
                process.stdout.write('.');
            }
        } catch (error) {
            console.error(`\nFailed to sync post ${post.id} (${post.title}):`, error.message);
            errorCount++;
        }
    }

    console.log('\nMigration complete.');
    console.log(`Synced: ${validCount}`);
    console.log(`Skipped (no categoryId): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
