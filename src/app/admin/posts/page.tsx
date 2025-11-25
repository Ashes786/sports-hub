'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Plus, Edit, Trash2, Search, Filter, Eye, MessageCircle, Heart, Share } from 'lucide-react'

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

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    content: '',
    imageURL: ''
  })
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
    // Get user name from localStorage
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setUserName(userData.name)
    }
  }, [])

  const fetchPosts = async () => {
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

      const response = await fetch('/api/admin/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else if (response.status === 401) {
        // Token is invalid, clear and redirect
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        router.push('/login')
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    router.push('/')
  }

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
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

      const response = await fetch(`/api/admin/posts?id=${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchPosts() // Refresh posts list
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    }
  }

  const handleCreatePost = async () => {
    if (!formData.content.trim()) {
      alert('Please enter post content')
      return
    }

    setIsSubmitting(true)

    try {
      let token = localStorage.getItem('token')
      
      if (!token) {
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
        if (tokenCookie) {
          token = tokenCookie.trim().split('=')[1]
        }
      }

      let imageUrl = formData.imageURL

      // If a file is selected, upload it first
      if (selectedFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', selectedFile)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
        } else {
          const error = await uploadResponse.json()
          alert(error.error || 'Failed to upload image')
          setIsSubmitting(false)
          return
        }
      }

      const response = await fetch('/api/student/feed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: formData.content,
          imageURL: imageUrl
        })
      })

      if (response.ok) {
        await fetchPosts()
        setIsCreateDialogOpen(false)
        setFormData({ content: '', imageURL: '' })
        setSelectedFile(null)
        alert('Post created successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post')
    } finally {
      setIsSubmitting(false)
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
            <p className="text-gray-600 mt-1">Moderate and manage all user posts</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Share an announcement or update with all students.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="content">Post Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="What would you like to announce?"
                    rows={6}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image (optional)</Label>
                  <div className="space-y-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedFile(file)
                          setFormData({ ...formData, imageURL: '' })
                        }
                      }}
                      className="cursor-pointer"
                    />
                    {selectedFile && (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Selected: {selectedFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedFile(null)
                            const input = document.getElementById('image') as HTMLInputElement
                            if (input) input.value = ''
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Or enter image URL:
                  </p>
                  <Input
                    type="url"
                    value={formData.imageURL}
                    onChange={(e) => {
                      setFormData({ ...formData, imageURL: e.target.value })
                      setSelectedFile(null)
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false)
                  setSelectedFile(null)
                }}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Publish Post
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts by content or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {filteredPosts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No posts found matching your search criteria.</p>
                </div>
              )}
              {filteredPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {post.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-medium text-gray-900">{post.user.name}</p>
                        <Badge variant={post.user.role === 'ADMIN' ? 'destructive' : 'secondary'} className="text-xs">
                          {post.user.role}
                        </Badge>
                        {post.user.team && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {post.user.team.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                      </p>
                      <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>
                      {post.imageURL && (
                        <img 
                          src={post.imageURL} 
                          alt="Post image"
                          className="w-full rounded-lg object-cover h-48 mb-3"
                        />
                      )}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>Views: 0</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>Likes: 0</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>Comments: 0</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share className="h-4 w-4" />
                            <span>Shares: 0</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeletePost(post.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No posts found matching your search criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}