'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Trophy, Medal, Star, Target, Award } from 'lucide-react'
import Link from 'next/link'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  date: string
  category: string
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [studentData, setStudentData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchStudentData()
    fetchAchievements()
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

  const fetchAchievements = async () => {
    // Static achievements data - in real app this would come from API
    const staticAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Victory',
        description: 'Won your first cricket match as captain',
        icon: 'trophy',
        date: '2024-01-15',
        category: 'Cricket',
        level: 'bronze'
      },
      {
        id: '2',
        title: 'Team Spirit',
        description: 'Demonstrated exceptional teamwork and sportsmanship',
        icon: 'star',
        date: '2024-01-20',
        category: 'Leadership',
        level: 'silver'
      },
      {
        id: '3',
        title: 'Champion Scorer',
        description: 'Scored 50+ runs in a single tournament',
        icon: 'target',
        date: '2024-02-10',
        category: 'Cricket',
        level: 'gold'
      },
      {
        id: '4',
        title: 'Perfect Attendance',
        description: 'Attended all practices for 3 consecutive months',
        icon: 'award',
        date: '2024-02-15',
        category: 'Commitment',
        level: 'silver'
      },
      {
        id: '5',
        title: 'MVP Performance',
        description: 'Named Most Valuable Player in football championship',
        icon: 'medal',
        date: '2024-03-01',
        category: 'Football',
        level: 'gold'
      },
      {
        id: '6',
        title: 'Speed Demon',
        description: 'Achieved personal best time in 100m sprint',
        icon: 'target',
        date: '2024-03-10',
        category: 'Athletics',
        level: 'platinum'
      },
      {
        id: '7',
        title: 'Community Leader',
        description: 'Organized 5+ successful team building events',
        icon: 'star',
        date: '2024-03-15',
        category: 'Leadership',
        level: 'gold'
      }
    ]

    setAchievements(staticAchievements)
    setLoading(false)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getIcon = (iconName: string) => {
    const iconMap = {
      trophy: Trophy,
      star: Star,
      target: Target,
      award: Award,
      medal: Medal
    }
    return iconMap[iconName as keyof typeof iconMap] || Trophy
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
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop")'
            }}
          ></div>
          <div className="relative z-10 px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Student Achievements
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Celebrate your sports accomplishments and milestones
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Trophy className="h-8 w-8 mx-auto text-yellow-400 mb-2" />
              <CardTitle className="text-lg">Total Achievements</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600">{achievements.length}</div>
              <p className="text-sm text-gray-600">Milestones reached</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Star className="h-8 w-8 mx-auto text-yellow-400 mb-2" />
              <CardTitle className="text-lg">Gold Level</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {achievements.filter(a => a.level === 'gold').length}
              </div>
              <p className="text-sm text-gray-600">Elite performances</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Award className="h-8 w-8 mx-auto text-purple-400 mb-2" />
              <CardTitle className="text-lg">Platinum</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {achievements.filter(a => a.level === 'platinum').length}
              </div>
              <p className="text-sm text-gray-600">Legendary status</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Target className="h-8 w-8 mx-auto text-green-400 mb-2" />
              <CardTitle className="text-lg">Active Streak</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600">7</div>
              <p className="text-sm text-gray-600">Days of excellence</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              Recent Achievements
            </CardTitle>
            <CardDescription>
              Your latest accomplishments and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <div key={achievement.id} className="flex items-start space-x-4 p-4 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow">
                  <div className={`w-16 h-16 rounded-full ${getLevelColor(achievement.level)} flex items-center justify-center flex-shrink-0`}>
                    {getIcon(achievement.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge className={getLevelColor(achievement.level)}>
                            {achievement.level.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="ml-2">
                            {achievement.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <img 
                          src={`/achievement${(index % 3) + 1}.jpeg`}
                          alt={achievement.title}
                          className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                        />
                      </div>
                    </div>
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