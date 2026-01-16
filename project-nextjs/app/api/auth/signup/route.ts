import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = signupSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.flatten() },
                { status: 400 }
            );
        }

        const { email, password, fullName } = validation.data;

        // Check if user already exists
        const existingUser = await prisma.profile.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.profile.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                role: 'READER',
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
            },
        });

        return NextResponse.json(
            { message: 'User created successfully', user },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে' },
            { status: 500 }
        );
    }
}
