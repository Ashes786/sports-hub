'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StudentNav } from '@/components/layout/StudentNav'
import { Calendar, Clock, Users, Plus } from 'lucide-react'
import Link from 'next/link'

interface StudentData {
  id: string
  name: string
  email: string
  studentID: string
  team?: {
    id: string
    name: string
    sport: string
  }
}

interface Post {
  id: string
  content: string
  imageURL?: string
  createdAt: string
  user: {
    name: string
    email: string
    role: string
    team?: {
      name: string
    }
  }
}

interface Event {
  id: string
  title: string
  description?: string
  date: string
  sport: string
  creator: {
    name: string
  }
}

interface DashboardData {
  student: StudentData
  posts: Post[]
  events: Event[]
  teamMembers: Array<{
    name: string
    email: string
    studentID: string
  }>
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Try to get token from localStorage first, then from cookie
      let token = localStorage.getItem('token')
      
      if (!token) {
        // Fallback to cookie if localStorage is empty
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
        const dashboardData = await response.json()
        setData(dashboardData)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
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

  if (!data) {
    return null
  }

  return (
    <div>
      <StudentNav 
        studentName={data.student.name}
        studentId={data.student.studentID}
        teamName={data.student.team?.name}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feed Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Community Feed</span>
                </CardTitle>
                <CardDescription>Latest updates from your sports community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {data.posts.length > 0 ? (
                    data.posts.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <Avatar>
                          <AvatarFallback>
                            {post.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {post.user.name}
                            </p>
                            <Badge variant={post.user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                              {post.user.role}
                            </Badge>
                            {post.user.team && (
                              <Badge variant="outline">
                                {post.user.team.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {post.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No posts yet. Be the first to share something!</p>
                    </div>
                  )}
                </div>
                {data.posts.length > 5 && (
                  <div className="text-center pt-4">
                    <Link href="/student/feed">
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                        View All Posts ({data.posts.length})
                      </Badge>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Team Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Team Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.student.team ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
                        <span className="text-green-800 font-bold text-xl">
                          {data.student.team.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{data.student.team.name}</h3>
                      <Badge variant="outline" className="mb-2">
                        {data.student.team.sport}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>🎉 Active member</p>
                      <p>Team ID: {data.student.team.id}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No Team Assigned</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      You haven't been assigned to a team yet. Contact your sports administrator to get added to a team.
                    </p>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Request Team Assignment
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>Next Event</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.events.length > 0 ? (
                  <div className="space-y-3">
                    {data.events.slice(0, 3).map((event) => (
                      <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {event.sport}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">No upcoming events</p>
                  </div>
                )}
                {data.events.length > 3 && (
                  <div className="text-center pt-4">
                    <Link href="/student/upcoming-events">
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                        View All Events ({data.events.length})
                      </Badge>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/student/create-post">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
                <Link href="/student/feed">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Feed
                  </Button>
                </Link>
                {data.student.team && (
                  <Link href="/student/my-team">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Team Details
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}