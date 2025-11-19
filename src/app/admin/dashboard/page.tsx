'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TeamDistributionChart } from '@/components/charts/TeamDistributionChart'
import { UserStatsChart } from '@/components/charts/UserStatsChart'
import { Users, Calendar, Trophy, MessageSquare, LogOut, Settings, Home } from 'lucide-react'
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
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
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
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/numl-logo-official.png"
                alt="NUML Logo"
                className="w-10 h-10 object-contain rounded-full"
              />
              <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="destructive">Admin</Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalTeams}</div>
              <p className="text-xs text-muted-foreground">Active teams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Scheduled events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">Community posts</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Team Distribution</CardTitle>
              <CardDescription>Number of members per team</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamDistributionChart data={data.teamDistribution} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
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
            <CardTitle>Latest Posts</CardTitle>
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
    </div>
  )
}