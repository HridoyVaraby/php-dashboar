import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/posts - List posts with filtering
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const category = searchParams.get('category')
        const categoryId = searchParams.get('categoryId')
        const featured = searchParams.get('featured')
        const limitQuery = searchParams.get('limit')
        const offset = searchParams.get('offset')
        const orderByParam = searchParams.get('orderBy')
        const search = searchParams.get('search')
        const featuredPosition = searchParams.get('featuredPosition')
        const status = searchParams.get('status')

        const where: any = {}

        // Only filter by status if not explicitly set to 'all'
        if (status !== 'all') {
            where.status = status || 'PUBLISHED'
        }

        if (category) {
            where.categories = {
                some: {
                    slug: category
                }
            }
        }

        if (categoryId) {
            where.categories = {
                some: {
                    id: categoryId
                }
            }
        }

        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive',
            }
        }

        if (featured === 'true') {
            where.isFeatured = true
        }

        if (featuredPosition === 'true') {
            where.isFeatured = true
            where.featuredPosition = { not: null }
        }

        const withPagination = searchParams.get('withPagination') === 'true'
        const page = parseInt(searchParams.get('page') || '1')
        const defaultLimit = withPagination ? 36 : undefined
        const limitParam = searchParams.get('limit')
        const limit = limitParam ? parseInt(limitParam) : defaultLimit
        const skip = limit && page ? (page - 1) * limit : (offset ? parseInt(offset) : undefined)

        const posts = await prisma.post.findMany({
            where,
            include: {
                category: { select: { name: true, slug: true } },
                categories: { select: { name: true, slug: true } },
                author: { select: { fullName: true, avatarUrl: true } },
                postTags: {
                    include: {
                        tag: { select: { name: true, slug: true } },
                    },
                },
            },
            orderBy: orderByParam === 'view_count'
                ? { viewCount: 'desc' }
                : orderByParam === 'featured_position'
                    ? { featuredPosition: 'asc' }
                    : { publishedAt: 'desc' },
            take: limit,
            skip: skip,
        })

        if (withPagination) {
            const total = await prisma.post.count({ where })
            return NextResponse.json({
                posts,
                pagination: {
                    total,
                    pages: limit ? Math.ceil(total / limit) : 1,
                    page,
                    limit
                }
            })
        }

        return NextResponse.json(posts)
    } catch (error) {
        console.error('Error fetching posts:', error)
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }
}

const postSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    categoryIds: z.array(z.string().uuid()).min(1),
    subcategoryIds: z.array(z.string().uuid()).optional(),
    status: z.enum(['PUBLISHED', 'DRAFT']).default('PUBLISHED'),
    isFeatured: z.boolean().default(false),
    subtitle: z.string().optional(),
    featuredPosition: z.number().int().optional().nullable(),
    publishedAt: z.string().optional(),

    tagIds: z.array(z.string().uuid()).optional(),
})

// POST /api/posts - Create new post
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const json = await req.json()
        const data = postSchema.parse(json)

        const { categoryIds, subcategoryIds, tagIds, ...postData } = data

        // Use the first category/subcategory as the primary one for backward compatibility
        const categoryId = categoryIds[0]
        const subcategoryId = subcategoryIds?.[0]

        const post = await prisma.$transaction(async (tx) => {
            // If this post is featured and has a position, remove other posts from this position
            if (postData.isFeatured && postData.featuredPosition) {
                await tx.post.updateMany({
                    where: {
                        isFeatured: true,
                        featuredPosition: postData.featuredPosition,
                    },
                    data: {
                        isFeatured: false,
                        featuredPosition: null,
                    },
                })
            }

            return await tx.post.create({
                data: {
                    ...postData,
                    categoryId,
                    categories: {
                        connect: categoryIds.map((id) => ({ id })),
                    },
                    subcategoryId,
                    authorId: session.user.id,
                    postTags: tagIds
                        ? {
                            create: tagIds.map((tagId) => ({ tagId })),
                        }
                        : undefined,
                },
                include: {
                    category: true,
                    categories: true,
                    author: true,
                    postTags: { include: { tag: true } },
                },
            })
        })

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error('Error creating post:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }
}
