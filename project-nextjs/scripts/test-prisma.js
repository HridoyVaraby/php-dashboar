const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

console.log('Testing Prisma Client...');

// Load env manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    console.log('Loading .env from', envPath);
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    });
}

try {
    const prisma = new PrismaClient();
    console.log('Prisma Client initialized successfully.');

    prisma.$connect()
        .then(() => {
            console.log('Connected to database.');
            return prisma.category.findMany();
        })
        .then((categories) => {
            console.log('Categories:', categories.length);
            return prisma.$disconnect();
        })
        .catch((e) => {
            console.error('Connection error:', e);
            process.exit(1);
        });

} catch (e) {
    console.error('Initialization error:', e);
}
