'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Calendar, MapPin, Clock, Users, Trophy } from 'lucide-react'
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

export default function RecentEvents() {
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

      const response = await fetch('/api/student/recent-events', {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    return {
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      daysAgo: daysDiff
    }
  }

  const getSportColor = (sport: string) => {
    const sportColors = {
      'Cricket': 'bg-green-100 text-green-800 border-green-300',
      'Football': 'bg-blue-100 text-blue-800 border-blue-300',
      'Basketball': 'bg-orange-100 text-orange-800 border-orange-300',
      'Badminton': 'bg-purple-100 text-purple-800 border-purple-300',
      'Tennis': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Volleyball': 'bg-red-100 text-red-800 border-red-300',
      'Hockey': 'bg-cyan-100 text-cyan-800 border-cyan-300',
      'Swimming': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'Athletics': 'bg-pink-100 text-pink-800 border-pink-300',
      'Table Tennis': 'bg-teal-100 text-teal-800 border-teal-300'
    }
    return sportColors[sport as keyof typeof sportColors] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getEventBackgroundImage = (sport: string) => {
    const sportImages = {
      'Cricket': '/cricket-event-bg.jpg',
      'Football': '/football-event-bg.jpg',
      'Basketball': '/basketball-event-bg.jpg',
      'Badminton': '/badminton-event-bg.jpg',
      'Tennis': '/tennis-event-bg.jpg',
      'Volleyball': '/football-event-bg.jpg',
      'Hockey': '/basketball-event-bg.jpg',
      'Swimming': '/football-event-bg.jpg',
      'Athletics': '/cricket-event-bg.jpg',
      'Table Tennis': '/tennis-event-bg.jpg'
    }
    return sportImages[sport as keyof typeof sportImages] || '/cricket-event-bg.jpg'
  }

  const getUrgencyColor = (daysAgo: number) => {
    if (daysAgo === 0) return 'text-green-600'
    if (daysAgo <= 7) return 'text-blue-600'
    if (daysAgo <= 30) return 'text-gray-600'
    return 'text-gray-500'
  }

  const handleLogout = () => {
    router.push('/')
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
        {/* Events List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const formattedDate = formatDate(event.date)
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
                  <div className="text-sm text-gray-500">
                    {formattedDate.weekday} • {formattedDate.time}
                  </div>
                </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{event.description}</p>
                
                {/* Participation Info */}
                {event.participants && event.participants.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        You're participating!
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Joined {new Date(event.participants[0].joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
                
                {/* Event Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className={getUrgencyColor(formattedDate.daysAgo)}>
                      {formattedDate.daysAgo === 0 ? 'Today' : `${formattedDate.daysAgo} days ago`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    Created by {event.creator.name}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Recent Events</h3>
            <p className="text-gray-500 mb-4">Check back later for new events and activities</p>
            <Link href="/student/upcoming-events">
              <Button className="bg-blue-600 hover:bg-blue-700">
                View All Events
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}