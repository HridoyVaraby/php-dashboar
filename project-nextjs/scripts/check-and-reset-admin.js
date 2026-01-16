const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAndResetAdminPassword() {
    try {
        console.log('Checking admin users...\n');

        // Find all admin users
        const adminUsers = await prisma.profile.findMany({
            where: {
                role: { in: ['ADMIN', 'EDITOR'] }
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                password: true,
            }
        });

        if (adminUsers.length === 0) {
            console.log('❌ No admin/editor users found in database.');
            console.log('\nSearching for ANY users...');

            const anyUsers = await prisma.profile.findMany({
                select: {
                    email: true,
                    role: true,
                }
            });

            console.log(`Found ${anyUsers.length} total users:`);
            anyUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`));
            return;
        }

        console.log(`✓ Found ${adminUsers.length} admin/editor user(s):\n`);
        adminUsers.forEach(admin => {
            console.log(`  Email: ${admin.email}`);
            console.log(`  Name: ${admin.fullName || 'N/A'}`);
            console.log(`  Role: ${admin.role}`);
            console.log(`  Password hash: ${admin.password ? 'Present' : 'MISSING!'}`);
            console.log('');
        });

        // Set a new password for all admin users
        const newPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log('Resetting passwords...\n');

        for (const admin of adminUsers) {
            await prisma.profile.update({
                where: { id: admin.id },
                data: { password: hashedPassword }
            });
            console.log(`✓ Updated password for: ${admin.email}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('SUCCESS! Admin passwords have been reset.');
        console.log('='.repeat(60));
        console.log(`\nNew password for ALL admin/editor accounts: ${newPassword}`);
        console.log('\nLogin credentials:');
        adminUsers.forEach(admin => {
            console.log(`  Email: ${admin.email}`);
            console.log(`  Password: ${newPassword}`);
            console.log('');
        });
        console.log('⚠️  Please change these passwords after logging in!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stack) {
            console.error('\nStack trace:', error.stack);
        }
    } finally {
        await prisma.$disconnect();
    }
}

checkAndResetAdminPassword();
