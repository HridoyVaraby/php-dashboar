import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        await prisma.$connect()
        console.log('Successfully connected to database')
        const posts = await prisma.post.findMany({ take: 1 })
        console.log('Posts found:', posts.length)
    } catch (e) {
        console.error('Connection error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
