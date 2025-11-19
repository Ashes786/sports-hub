'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Users, Plus, Crown, LogOut } from 'lucide-react'
import Link from 'next/link'

interface Team {
  id: string
  name: string
  sport: string
  createdAt: string
  members: Array<{
    id: string
    name: string
    studentID: string
  }>
  _count: {
    members: number
  }
}

export default function StudentTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [studentData, setStudentData] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    sport: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchStudentData()
    fetchTeams()
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

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/student/teams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTeams(data)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (teamId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/student/teams', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ teamId })
      })

      if (response.ok) {
        await fetchTeams()
        showToast('Successfully joined team!')
      } else {
        const errorData = await response.json()
        showToast(errorData.error || 'Error joining team', 'error')
      }
    } catch (error) {
      console.error('Error joining team:', error)
      showToast('Error joining team', 'error')
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/student/teams', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchTeams()
        resetForm()
        showToast('Team created successfully!')
      } else {
        const errorData = await response.json()
        showToast(errorData.error || 'Error creating team', 'error')
      }
    } catch (error) {
      console.error('Error creating team:', error)
      showToast('Error creating team', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', sport: '' })
    setShowCreateForm(false)
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
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>

        {/* Create Team Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Create New Team</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Team Name</label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter team name"
                      className="w-full px-3 py-2 border border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="sport" className="text-sm font-medium">Sport</label>
                    <select
                      id="sport"
                      value={formData.sport}
                      onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                      className="w-full px-3 py-2 border border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a sport</option>
                      <option value="Cricket">Cricket</option>
                      <option value="Football">Football</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Badminton">Badminton</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Volleyball">Volleyball</option>
                      <option value="Hockey">Hockey</option>
                      <option value="Swimming">Swimming</option>
                      <option value="Athletics">Athletics</option>
                      <option value="Table Tennis">Table Tennis</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Team
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {team.name}
                  <Badge variant="secondary">{team.sport}</Badge>
                </CardTitle>
                <CardDescription>
                  {team._count.members} member{team._count.members !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Team Members</p>
                    <span className="text-sm text-gray-500">{team._count.members}/{10} max</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleJoin(team.id)}
                    disabled={team._count.members >= 10}
                  >
                    {team._count.members >= 10 ? 'Team Full' : 'Join Team'}
                  </Button>
                </div>
                {team.members.length > 0 ? (
                  <div className="space-y-2">
                    {team.members.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500">ID: {member.studentID}</p>
                        </div>
                      </div>
                    ))}
                    {team.members.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{team.members.length - 3} more members
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No members yet. Be the first to join!
                  </p>
                )}
              </CardContent>
          </Card>
        ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Teams Available</h3>
            <p className="text-gray-500 mb-4">Create your own team or browse existing teams to join!</p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create First Team
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}