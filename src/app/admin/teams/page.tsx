'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, Plus, Edit, Trash2, Save, X, Crown } from 'lucide-react'
import Link from 'next/link'

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

interface User {
  id: string
  name: string
  email: string
  studentID: string
}

const sports = [
  'Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 
  'Volleyball', 'Hockey', 'Swimming', 'Athletics', 'Table Tennis'
]

const departments = [
  'BS English', 'BS Computer Science', 'BS Mathematics', 'BS Physics',
  'BS Chemistry', 'BS Biology', 'BS Business Administration', 'BS Economics',
  'BS Psychology', 'BS Sociology', 'BS Mass Communication'
]

export default function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    department: '',
    captainId: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchTeams()
    fetchUsers()
  }, [])

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token')
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
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const url = editingTeam ? '/api/admin/teams' : '/api/admin/teams'
      const method = editingTeam ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          id: editingTeam?.id
        })
      })

      if (response.ok) {
        await fetchTeams()
        resetForm()
        showToast(editingTeam ? 'Team updated successfully' : 'Team created successfully')
      } else {
        showToast('Error saving team', 'error')
      }
    } catch (error) {
      console.error('Error saving team:', error)
      showToast('Error saving team', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team? This will remove all member assignments.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/teams?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchTeams()
        showToast('Team deleted successfully')
      } else {
        showToast('Error deleting team', 'error')
      }
    } catch (error) {
      console.error('Error deleting team:', error)
      showToast('Error deleting team', 'error')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', sport: '', department: '', captainId: '' })
    setEditingTeam(null)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/admin/dashboard" className="flex items-center space-x-3">
                <img
                  src="/numl-logo-official.png"
                  alt="NUML Logo"
                  className="w-8 h-8 object-contain rounded-full"
                />
                <span className="text-lg font-bold text-gray-900">Admin Panel</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/admin/events">
                <Button variant="ghost" size="sm">Events</Button>
              </Link>
              <Link href="/admin/announcements">
                <Button variant="ghost" size="sm">Announcements</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{editingTeam ? 'Edit Team' : 'Create New Team'}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Team Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter team name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sport">Sport *</Label>
                      <Select value={formData.sport} onValueChange={(value) => setFormData({ ...formData, sport: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                        <SelectContent>
                          {sports.map((sport) => (
                            <SelectItem key={sport} value={sport}>
                              {sport}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="captainId">Team Captain</Label>
                    <Select value={formData.captainId} onValueChange={(value) => setFormData({ ...formData, captainId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select captain (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No captain assigned</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.studentID})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {editingTeam ? 'Update Team' : 'Create Team'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Teams Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Teams</CardTitle>
            <CardDescription>Manage sports teams and their members</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{team.sport}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{team.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{team._count.members}</span>
                      </div>
                    </TableCell>
                    <TableCell>{team.creator.name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTeam(team)
                            setFormData({
                              name: team.name,
                              sport: team.sport,
                              department: team.department,
                              captainId: team.members.find(m => m.teamID === team.id)?.id || ''
                            })
                            setShowCreateForm(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(team.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Team Members Details */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <Card key={team.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{team.name}</CardTitle>
                      <CardDescription>{team.sport}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {team.members.length > 0 ? (
                          team.members.map((member) => (
                            <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-gray-500">ID: {member.studentID}</p>
                                <p className="text-xs text-gray-400">{member.department}</p>
                              </div>
                              {team.members.find(m => m.id === member.id)?.teamID === team.id && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No members assigned</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}