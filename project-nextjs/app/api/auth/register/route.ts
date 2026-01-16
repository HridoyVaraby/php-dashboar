import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(1),
})

export async function POST(req: NextRequest) {
    try {
        const json = await req.json()
        const { email, password, fullName } = registerSchema.parse(json)

        // Check if user already exists
        const existingUser = await prisma.profile.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hash(password, 10)

        // Create user
        const user = await prisma.profile.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                role: 'READER', // Default role
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
            },
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error('Registration error:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return NextResponse.json(
            { error: 'Failed to register user' },
            { status: 500 }
        )
    }
}
