'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Calendar, Plus, Edit, Trash2, Save, X } from 'lucide-react'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  description?: string
  sport: string
  date: string
  type?: string
  location?: string
  teamAID?: string
  teamBID?: string
  status?: string
  scoreA?: number
  scoreB?: number
  creator: {
    name: string
    email: string
  }
  teamA?: {
    id: string
    name: string
  }
  teamB?: {
    id: string
    name: string
  }
}

const sports = [
  'Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 
  'Volleyball', 'Hockey', 'Swimming', 'Athletics', 'Table Tennis'
]

const eventTypes = [
  { value: 'TOURNAMENT', label: 'Tournament' },
  { value: 'MATCH', label: 'Match' },
  { value: 'PRACTICE', label: 'Practice' }
]

const eventStatuses = [
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' }
]

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sport: '',
    date: '',
    type: 'TOURNAMENT',
    location: '',
    teamAID: '',
    teamBID: '',
    status: 'UPCOMING',
    scoreA: '',
    scoreB: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
    fetchTeams()
  }, [])

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/admin/events', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const url = editingEvent ? '/api/admin/events' : '/api/admin/events'
      const method = editingEvent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          id: editingEvent?.id
        })
      })

      if (response.ok) {
        await fetchEvents()
        resetForm()
        showToast(editingEvent ? 'Event updated successfully' : 'Event created successfully')
      } else {
        showToast('Error saving event', 'error')
      }
    } catch (error) {
      console.error('Error saving event:', error)
      showToast('Error saving event', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      sport: event.sport,
      date: new Date(event.date).toISOString().split('T')[0],
      type: event.type || 'TOURNAMENT',
      location: event.location || '',
      teamAID: event.teamAID || '',
      teamBID: event.teamBID || '',
      status: event.status || 'UPCOMING',
      scoreA: event.scoreA?.toString() || '',
      scoreB: event.scoreB?.toString() || ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/events?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchEvents()
        showToast('Event deleted successfully')
      } else {
        showToast('Error deleting event', 'error')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      showToast('Error deleting event', 'error')
    }
  }

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/teams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTeams(data)
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      sport: '', 
      date: '', 
      type: 'TOURNAMENT',
      location: '',
      teamAID: '',
      teamBID: '',
      status: 'UPCOMING',
      scoreA: '',
      scoreB: ''
    })
    setEditingEvent(null)
    setShowCreateForm(false)
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    // Simple toast implementation
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
              <Link href="/admin/teams">
                <Button variant="ghost" size="sm">Teams</Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter event title"
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
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Event Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter event location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter event description"
                      rows={4}
                    />
                  </div>
                  
                  {/* Match-specific fields */}
                  {formData.type === 'MATCH' && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teamAID">Team A *</Label>
                        <Select value={formData.teamAID} onValueChange={(value) => setFormData({ ...formData, teamAID: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Team A" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teamBID">Team B *</Label>
                        <Select value={formData.teamBID} onValueChange={(value) => setFormData({ ...formData, teamBID: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Team B" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  
                  {/* Score fields for completed matches */}
                  {formData.type === 'MATCH' && (
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventStatuses.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="scoreA">Team A Score</Label>
                        <Input
                          id="scoreA"
                          type="number"
                          value={formData.scoreA}
                          onChange={(e) => setFormData({ ...formData, scoreA: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="scoreB">Team B Score</Label>
                        <Input
                          id="scoreB"
                          type="number"
                          value={formData.scoreB}
                          onChange={(e) => setFormData({ ...formData, scoreB: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}
                  
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
                          {editingEvent ? 'Update Event' : 'Create Event'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
            <CardDescription>Manage all sports events and tournaments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{event.sport}</Badge>
                    </TableCell>
                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell>{event.location || '-'}</TableCell>
                    <TableCell>
                      {event.type === 'MATCH' ? (
                        <div className="text-sm">
                          {event.teamA?.name} vs {event.teamB?.name}
                          {event.scoreA !== null && event.scoreB !== null && (
                            <div className="font-semibold">
                              ({event.scoreA} - {event.scoreB})
                            </div>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={event.status === 'COMPLETED' ? 'default' : 'secondary'}>
                        {event.status || 'UPCOMING'}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.creator.name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}