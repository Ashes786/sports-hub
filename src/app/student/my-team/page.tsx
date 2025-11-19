'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Users, Calendar, Trophy, Plus, Crown, LogOut } from 'lucide-react'
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

export default function MyTeam() {
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
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
        const data = await response.json()
        setStudentData(data.student)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
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

  if (!studentData) {
    return null
  }

  return (
    <DashboardLayout
      userType="student"
      userName={studentData?.name}
      studentId={studentData?.studentID}
      teamName={studentData?.team?.name}
      onLogout={handleLogout}
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Team Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {studentData.team.name}
            </CardTitle>
            <CardDescription>{studentData.team.sport}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900">Team Captain</p>
                <p className="text-sm text-gray-600">You (Team Creator)</p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900">Sport</p>
                <Badge variant="secondary">{studentData.team.sport}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900">Created</p>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString()} (Today)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              Team Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total Members</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Active Members</p>
                <p className="text-2xl font-bold text-green-600">6</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Practice Schedule</p>
                <p className="text-sm text-gray-600">Mon, Wed, Fri - 4:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Team practice scheduled</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">New member joined</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Upcoming match</p>
                  <p className="text-xs text-gray-500">vs Rivals University - Tomorrow</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/student/events">
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View Events
              </Button>
            </Link>
            <Link href="/student/create-post">
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}