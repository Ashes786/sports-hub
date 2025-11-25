'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Calendar, Users, Trophy, Plus, Crown, MapPin } from 'lucide-react'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  description?: string
  date: string
  sport: string
  location?: string
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
  const [studentData, setStudentData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchStudentData()
    fetchEvents()
  }, [])

  const fetchStudentData = async () => {
    try {
      let token = localStorage.getItem('token')
      
      if (!token) {
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
        if (tokenCookie) {
          token = tokenCookie.trim().split('=')[1]
        }
      }
      
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/student/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStudentData(data.student)
      }
    } catch (error) {
      console.error('Error fetching student data:', error)
    }
  }

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

  const handleLogout = () => {
    router.push('/')
  }

  const getEventBackgroundImage = (sport: string) => {
    const sportImages = {
      'Cricket': '/cricket-event-action.jpg',
      'Football': '/football-event-action.jpg',
      'Basketball': '/basketball-event-action.jpg',
      'Badminton': '/badminton-event-bg.jpg',
      'Tennis': '/tennis-event-bg.jpg',
      'Volleyball': '/football-event-bg.jpg',
      'Hockey': '/basketball-event-action.jpg',
      'Swimming': '/football-event-action.jpg',
      'Athletics': '/cricket-event-action.jpg',
      'Table Tennis': '/tennis-event-bg.jpg'
    }
    return sportImages[sport as keyof typeof sportImages] || '/cricket-event-action.jpg'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout
      userType="student"
      userName={studentData?.name}
      studentId={studentData?.studentID}
      teamName={studentData?.team?.name}
      onLogout={handleLogout}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="text-gray-600">Discover and participate in sports events</p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isParticipating = event.participants.length > 0
            const isToday = new Date(event.date).toDateString() === new Date().toDateString()
            
            return (
              <Card key={event.id} className={`hover:shadow-lg transition-shadow overflow-hidden ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                {/* Background Image with Blue Overlay */}
                <div 
                  className="relative h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${getEventBackgroundImage(event.sport)}")`
                  }}
                >
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-80"></div>
                  <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
                    <div>
                      <CardTitle className="text-xl text-white mb-2">{event.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-white text-blue-800 hover:bg-gray-100">
                          {event.sport}
                        </Badge>
                        {isParticipating && (
                          <Badge variant="destructive" className="ml-2">
                            Participating
                          </Badge>
                        )}
                        {isToday && (
                          <Badge variant="destructive" className="ml-2">
                            TODAY
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-white text-sm">
                      <MapPin className="h-4 w-4" />
                      <span className="text-white">
                        {event.location || 'NUML Sports Complex'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {event.description && (
                    <CardDescription className="mt-2">
                      {event.description}
                    </CardDescription>
                  )}
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
    </DashboardLayout>
  )
}