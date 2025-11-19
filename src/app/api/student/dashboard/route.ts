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

    // Get student data
    const student = await db.user.findUnique({
      where: { id: decoded.userId },
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
          id: { not: decoded.userId } // Exclude current user
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