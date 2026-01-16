const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function fixAdminEmails() {
    try {
        console.log('Finding admin users with migrated emails...\n');

        const adminUsers = await prisma.profile.findMany({
            where: {
                role: { in: ['ADMIN', 'EDITOR'] },
                email: { contains: 'migrated_' }
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        if (adminUsers.length === 0) {
            console.log('✓ No admins with migrated emails found. Checking all admins...\n');

            const allAdmins = await prisma.profile.findMany({
                where: {
                    role: { in: ['ADMIN', 'EDITOR'] }
                },
                select: {
                    email: true,
                    fullName: true,
                    role: true,
                }
            });

            console.log(`Found ${allAdmins.length} admin/editor users:`);
            allAdmins.forEach(admin => {
                console.log(`  - ${admin.email} (${admin.fullName}) - ${admin.role}`);
            });

            rl.close();
            return;
        }

        console.log(`Found ${adminUsers.length} admin(s) with temporary migration emails:\n`);

        for (let i = 0; i < adminUsers.length; i++) {
            const admin = adminUsers[i];
            console.log(`\n[${i + 1}/${adminUsers.length}] Admin User:`);
            console.log(`  Current Email: ${admin.email}`);
            console.log(`  Name: ${admin.fullName || 'N/A'}`);
            console.log(`  Role: ${admin.role}`);

            const newEmail = await question('\nEnter the REAL email for this admin (or press Enter to skip): ');

            if (newEmail && newEmail.trim() && newEmail.includes('@')) {
                const trimmedEmail = newEmail.trim().toLowerCase();

                // Check if email already exists
                const existing = await prisma.profile.findUnique({
                    where: { email: trimmedEmail }
                });

                if (existing && existing.id !== admin.id) {
                    console.log('  ❌ This email already exists! Skipping...');
                    continue;
                }

                // Update email and reset password
                const newPassword = 'admin123';
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                await prisma.profile.update({
                    where: { id: admin.id },
                    data: {
                        email: trimmedEmail,
                        password: hashedPassword
                    }
                });

                console.log(`  ✓ Updated email to: ${trimmedEmail}`);
                console.log(`  ✓ Password set to: ${newPassword}`);
            } else {
                console.log('  ⊘ Skipped');
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('Update complete!');
        console.log('='.repeat(60));
        console.log('\nAll updated admins now have password: admin123');
        console.log('Please login and change your password immediately.\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
        await prisma.$disconnect();
    }
}

fixAdminEmails();
