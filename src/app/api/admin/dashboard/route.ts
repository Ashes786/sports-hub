import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

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

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied - Not admin' },
        { status: 403 }
      )
    }

    // Get statistics
    const totalStudents = await db.user.count({
      where: { role: 'STUDENT' }
    })

    const totalTeams = await db.team.count()

    const totalEvents = await db.event.count()

    const totalPosts = await db.post.count()

    // Get latest posts with user info
    const latestPosts = await db.post.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
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

    // Get recent events
    const recentEvents = await db.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: {
            name: true
          }
        }
      }
    })

    // Get team distribution
    const teams = await db.team.findMany({
      include: {
        _count: {
          select: { members: true }
        }
      }
    })

    const teamDistribution = teams.map(team => ({
      name: team.name,
      members: team._count.members
    }))

    return NextResponse.json({
      stats: {
        totalStudents,
        totalTeams,
        totalEvents,
        totalPosts
      },
      latestPosts,
      recentEvents,
      teamDistribution
    })

  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}