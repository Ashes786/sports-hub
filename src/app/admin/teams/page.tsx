'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, Plus, Edit, Trash2, Crown, User } from 'lucide-react'

interface Team {
  id: string
  name: string
  sport: string
  department: string
  createdAt: string
  creator: {
    name: string
    email: string
  }
  members: Array<{
    id: string
    name: string
    email: string
    studentID: string
    department: string
  }>
  _count: {
    members: number
  }
}

export default function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchTeams()
    // Get user name from localStorage
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setUserName(userData.name)
    }
  }, [])

  const fetchTeams = async () => {
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

      const response = await fetch('/api/admin/teams', {
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
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    router.push('/')
  }

  const handleShowMembers = (team: Team) => {
    setSelectedTeam(team)
    setIsMembersDialogOpen(true)
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team? This will remove all member assignments.')) {
      return
    }

    try {
      let token = localStorage.getItem('token')
      
      if (!token) {
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
        if (tokenCookie) {
          token = tokenCookie.trim().split('=')[1]
        }
      }

      const response = await fetch(`/api/admin/teams?id=${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchTeams() // Refresh the teams list
      } else {
        alert('Failed to delete team')
      }
    } catch (error) {
      console.error('Error deleting team:', error)
      alert('Error deleting team')
    }
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
      userType="admin"
      userName={userName}
      onLogout={handleLogout}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-600 mt-1">View and manage all sports teams</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleShowMembers(team)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">{team.sport}</Badge>
                      <Badge variant="outline">{team.department}</Badge>
                    </CardDescription>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTeam(team.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback>
                        {team.creator.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-gray-600">Created by</p>
                      <p className="font-medium">{team.creator.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {team._count.members} member{team._count.members !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">Team Captain</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Created {new Date(team.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-blue-600 font-medium">Click to view members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Found</h3>
            <p className="text-gray-600">No teams have been created yet. Create your first team to get started.</p>
          </div>
        )}

        {/* Team Members Dialog */}
        <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedTeam?.name} - Team Members
              </DialogTitle>
              <DialogDescription>
                View all members of the {selectedTeam?.name} team
              </DialogDescription>
            </DialogHeader>
            
            {selectedTeam && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="secondary">{selectedTeam.sport}</Badge>
                  <Badge variant="outline">{selectedTeam.department}</Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {selectedTeam._count.members} member{selectedTeam._count.members !== 1 ? 's' : ''}
                  </div>
                </div>

                {selectedTeam.members.length > 0 ? (
                  <div className="grid gap-3">
                    {selectedTeam.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">ID: {member.studentID}</p>
                          <p className="text-xs text-gray-500">{member.department}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Members Yet</h3>
                    <p className="text-gray-600">This team doesn't have any members yet.</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}