const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showAdminEmails() {
    try {
        const admins = await prisma.profile.findMany({
            where: {
                role: { in: ['ADMIN', 'EDITOR'] }
            },
            select: {
                email: true,
                fullName: true,
                role: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        console.log('\n=== ADMIN/EDITOR USERS ===\n');

        if (admins.length === 0) {
            console.log('No admin users found!\n');
        } else {
            admins.forEach((admin, index) => {
                console.log(`${index + 1}. Email: ${admin.email}`);
                console.log(`   Name: ${admin.fullName || 'N/A'}`);
                console.log(`   Role: ${admin.role}`);
                console.log('');
            });

            console.log(`Total: ${admins.length} admin/editor user(s)`);
        }

        console.log('\n=========================\n');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

showAdminEmails();
