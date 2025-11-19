import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all posts for feed
export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    const userId = request.headers.get('x-user-id')
    
    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const posts = await db.post.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            team: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create post
export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    const userId = request.headers.get('x-user-id')
    
    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { content, imageURL } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const post = await db.post.create({
      data: {
        content,
        imageURL,
        userID: userId
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update post
export async function PUT(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    const userId = request.headers.get('x-user-id')
    
    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, content, imageURL } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Check if user owns this post
    const existingPost = await db.post.findUnique({
      where: { id }
    })

    if (!existingPost || existingPost.userID !== userId) {
      return NextResponse.json(
        { error: 'Post not found or access denied' },
        { status: 403 }
      )
    }

    const post = await db.post.update({
      where: { id },
      data: {
        content,
        imageURL
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE post
export async function DELETE(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    const userId = request.headers.get('x-user-id')
    
    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Check if user owns this post
    const existingPost = await db.post.findUnique({
      where: { id }
    })

    if (!existingPost || existingPost.userID !== userId) {
      return NextResponse.json(
        { error: 'Post not found or access denied' },
        { status: 403 }
      )
    }

    await db.post.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}