import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all events with participation status
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

    const events = await db.event.findMany({
      where: {
        date: {
          gte: new Date()
        }
      },
      orderBy: { date: 'asc' },
      include: {
        creator: {
          select: {
            name: true
          }
        },
        participants: {
          where: {
            userId: userId
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
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST participate in event
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

    const { eventId } = await request.json()

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if already participating
    const existingParticipation = await db.eventParticipant.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId
        }
      }
    })

    if (existingParticipation) {
      return NextResponse.json(
        { error: 'Already participating in this event' },
        { status: 409 }
      )
    }

    // Create participation
    const participation = await db.eventParticipant.create({
      data: {
        eventId,
        userId
      }
    })

    return NextResponse.json(participation, { status: 201 })
  } catch (error) {
    console.error('Error participating in event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE withdraw from event
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
    const eventId = searchParams.get('id')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    await db.eventParticipant.deleteMany({
      where: {
        eventId,
        userId
      }
    })

    return NextResponse.json({ message: 'Withdrawn from event successfully' })
  } catch (error) {
    console.error('Error withdrawing from event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}