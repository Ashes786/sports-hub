'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Heart, 
  MessageCircle,
  Share,
  MoreHorizontal,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

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

export default function StudentFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    content: '',
    imageURL: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/student/feed', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const url = editingPost ? '/api/student/feed' : '/api/student/feed'
      const method = editingPost ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          id: editingPost?.id
        })
      })

      if (response.ok) {
        await fetchPosts()
        resetForm()
        showToast(editingPost ? 'Post updated successfully' : 'Post created successfully')
      } else {
        showToast('Error saving post', 'error')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      showToast('Error saving post', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setFormData({
      content: post.content,
      imageURL: post.imageURL || ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/student/feed?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchPosts()
        showToast('Post deleted successfully')
      } else {
        showToast('Error deleting post', 'error')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      showToast('Error deleting post', 'error')
    }
  }

  const resetForm = () => {
    setFormData({ content: '', imageURL: '' })
    setEditingPost(null)
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
              <Link href="/student/dashboard" className="flex items-center space-x-3">
                <img
                  src="/numl-logo-official.jpeg"
                  alt="NUML Logo"
                  className="w-8 h-8 object-contain rounded-full"
                />
                <span className="text-lg font-bold text-gray-900">NUML Sports Hub</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            <Link
              href="/student/feed"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border-l-4 border-blue-700"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Feed</span>
            </Link>
            <Link
              href="/student/my-team"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Users className="h-5 w-5" />
              <span>My Team</span>
            </Link>
            <Link
              href="/student/events"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link
              href="/student/create-post"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Plus className="h-5 w-5" />
              <span>Create Post</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Community Feed</h1>
              <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>

            {/* Create/Edit Form Modal */}
            {showCreateForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={resetForm}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="content">Post Content *</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Share your thoughts with the community..."
                          rows={6}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imageURL">Image URL (optional)</Label>
                        <Input
                          id="imageURL"
                          value={formData.imageURL}
                          onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
                          placeholder="Enter image URL (optional)"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Posting...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              {editingPost ? 'Update Post' : 'Post'}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {post.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
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
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showToast('Like feature coming soon!', 'success')}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showToast('Comment feature coming soon!', 'success')}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showToast('Share feature coming soon!', 'success')}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
                              if (post.user.email === currentUser.email) {
                                handleEdit(post)
                              } else {
                                showToast('You can only edit your own posts', 'error')
                              }
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {post.user.email === JSON.parse(localStorage.getItem('user') || '{}').email && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    {post.imageURL && (
                      <img 
                        src={post.imageURL} 
                        alt="Post image"
                        className="w-full rounded-lg object-cover h-64 mb-4"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}