'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, Users, Trophy, Plus, Crown } from 'lucide-react'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  description?: string
  date: string
  sport: string
  creator: {
    name: string
  }
  participants: Array<{
    id: string
    joinedAt: string
  }>
}

export default function StudentEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/student/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleParticipate = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/student/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventId })
      })

      if (response.ok) {
        await fetchEvents()
        showToast('Successfully joined event!')
      } else {
        const errorData = await response.json()
        showToast(errorData.error || 'Error joining event', 'error')
      }
    } catch (error) {
      console.error('Error joining event:', error)
      showToast('Error joining event', 'error')
    }
  }

  const handleWithdraw = async (eventId: string) => {
    if (!confirm('Are you sure you want to withdraw from this event?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/student/events?id=${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchEvents()
        showToast('Successfully withdrew from event')
      } else {
        showToast('Error withdrawing from event', 'error')
      }
    } catch (error) {
      console.error('Error withdrawing from event:', error)
      showToast('Error withdrawing from event', 'error')
    }
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div')
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/student/dashboard" className="flex items-center space-x-3">
                <img
                  src="/numl-logo-official.jpeg"
                  alt="NUML Logo"
                  className="w-8 h-8 object-contain rounded-full"
                />
                <span className="text-lg font-bold text-gray-900">NUML Sports Hub</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="text-gray-600">Discover and participate in sports events</p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isParticipating = event.participants.length > 0
            return (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant="secondary">{event.sport}</Badge>
                    </div>
                    {isParticipating && (
                      <Badge variant="destructive" className="text-xs">
                        Participating
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {event.description}
                  </CardDescription>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Created by <span className="font-medium">{event.creator.name}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {isParticipating ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdraw(event.id)}
                        >
                          Withdraw
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleParticipate(event.id)}
                        >
                          Participate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
            <p className="text-gray-500">Check back later for new events and tournaments</p>
          </div>
        )}
      </div>
    </div>
  )
}