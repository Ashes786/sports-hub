'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TeamDistributionChart } from '@/components/charts/TeamDistributionChart'
import { UserStatsChart } from '@/components/charts/UserStatsChart'
import { Users, Calendar, Trophy, MessageSquare, Plus, UserPlus } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'

interface DashboardData {
  stats: {
    totalStudents: number
    totalTeams: number
    totalEvents: number
    totalPosts: number
  }
  latestPosts: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      name: string
      email: string
      role: string
    }
  }>
  recentEvents: Array<{
    id: string
    title: string
    date: string
    sport: string
    creator: {
      name: string
    }
  }>
  teamDistribution: Array<{
    name: string
    members: number
  }>
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
    // Get user name from localStorage
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setUserName(userData.name)
    }
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

      const response = await fetch('/api/admin/dashboard', {
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
    <DashboardLayout
      userType="admin"
      userName={userName}
      onLogout={handleLogout}
    >
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/students">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Manage Students</CardTitle>
                <UserPlus className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Add, edit, remove students</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/teams">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Manage Teams</CardTitle>
                <Trophy className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.totalTeams}</div>
                <p className="text-xs text-muted-foreground">Create and manage teams</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/events">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Manage Events</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">Create tournaments and matches</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/announcements">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                <Plus className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-muted-foreground">Send updates to students</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Number of members per team</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamDistributionChart data={data.teamDistribution} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Students vs Admins</CardDescription>
            </CardHeader>
            <CardContent>
              <UserStatsChart 
                data={{
                  students: data.stats.totalStudents,
                  admins: 1 // Assuming 1 admin
                }} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Latest Posts */}
        <Card>
          <CardHeader>
            <CardDescription>Most recent community updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {data.latestPosts.map((post) => (
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
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {post.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}