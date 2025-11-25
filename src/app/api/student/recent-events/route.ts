import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// GET recent events (past events)
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    const events = await db.event.findMany({
      where: {
        date: {
          lt: new Date()
        }
      },
      orderBy: { date: 'desc' },
      take: 20, // Limit to last 20 past events
      include: {
        creator: {
          select: {
            name: true
          }
        },
        participants: {
          where: {
            userId: decoded.userId
          },
          select: {
            id: true,
            joinedAt: true
          }
        }
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching recent events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}