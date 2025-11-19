'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Home, 
  Users, 
  Calendar, 
  Plus, 
  Settings, 
  LogOut,
  MessageSquare,
  Clock
} from 'lucide-react'
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

const menuItems = [
  { icon: Home, label: 'Home', href: '/student/dashboard' },
  { icon: Users, label: 'My Team', href: '/student/team' },
  { icon: Calendar, label: 'Events', href: '/student/events' },
  { icon: Plus, label: 'Create Post', href: '/student/create-post' },
  { icon: Settings, label: 'Settings', href: '/student/settings' },
]

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('feed')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    // Set active tab based on current path
    if (pathname === '/student/dashboard') setActiveTab('feed')
  }, [pathname])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
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
    // Clear token cookie and user data
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    localStorage.removeItem('user')
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/numl-logo-official.png"
                alt="NUML Logo"
                className="w-8 h-8 object-contain rounded-full"
              />
              <span className="text-lg font-bold text-gray-900">NUML Sports Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{data.student.name}</p>
                <p className="text-xs text-gray-500">ID: {data.student.studentID}</p>
              </div>
              {data.student.team && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {data.student.team.name}
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Feed Tab */}
            {activeTab === 'feed' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Community Feed</h1>
                
                {/* Posts Feed */}
                <div className="space-y-4">
                  {data.posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {post.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900">
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
                            <p className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-3">{post.content}</p>
                        {post.imageURL && (
                          <img 
                            src={post.imageURL} 
                            alt="Post image"
                            className="w-full rounded-lg object-cover h-64"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Events Sidebar */}
          <div className="w-80 ml-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Upcoming Events</span>
                </CardTitle>
                <CardDescription>Don't miss these events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {data.events.map((event) => (
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
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}