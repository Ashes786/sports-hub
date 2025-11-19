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

    // Get student data
    const student = await db.user.findUnique({
      where: { id: userId },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            sport: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Get all posts (feed)
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

    // Get upcoming events
    const events = await db.event.findMany({
      where: {
        date: {
          gte: new Date()
        }
      },
      orderBy: { date: 'asc' },
      take: 10,
      include: {
        creator: {
          select: {
            name: true
          }
        }
      }
    })

    // Get team members if student has a team
    let teamMembers = []
    if (student.team) {
      teamMembers = await db.user.findMany({
        where: {
          teamID: student.team.id,
          id: { not: userId } // Exclude current user
        },
        select: {
          name: true,
          email: true,
          studentID: true
        }
      })
    }

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        studentID: student.studentID,
        team: student.team
      },
      posts,
      events,
      teamMembers
    })

  } catch (error) {
    console.error('Student dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}