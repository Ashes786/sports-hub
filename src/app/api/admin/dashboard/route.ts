import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
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