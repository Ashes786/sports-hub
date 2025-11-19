import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all teams
export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const teams = await db.team.findMany({
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            studentID: true
          }
        },
        _count: {
          select: { members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create team
export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    const userId = request.headers.get('x-user-id')
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const { name, sport, captainId } = await request.json()

    if (!name || !sport) {
      return NextResponse.json(
        { error: 'Team name and sport are required' },
        { status: 400 }
      )
    }

    const team = await db.team.create({
      data: {
        name,
        sport,
        createdBy: userId
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Assign captain if provided
    if (captainId) {
      await db.user.update({
        where: { id: captainId },
        data: { teamID: team.id }
      })
    }

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update team
export async function PUT(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const { id, name, sport, captainId } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      )
    }

    const team = await db.team.update({
      where: { id },
      data: {
        name,
        sport
      }
    })

    // Update captain assignment
    if (captainId !== undefined) {
      if (captainId) {
        await db.user.update({
          where: { id: captainId },
          data: { teamID: id }
        })
      } else {
        // Remove captain assignment (set to null)
        await db.user.updateMany({
          where: { teamID: id },
          data: { teamID: null }
        })
      }
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE team
export async function DELETE(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      )
    }

    // First remove team assignments from all members
    await db.user.updateMany({
      where: { teamID: id },
      data: { teamID: null }
    })

    // Then delete the team
    await db.team.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Team deleted successfully' })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}