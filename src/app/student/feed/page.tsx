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
import { DashboardLayout } from '@/components/layout/DashboardLayout'
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
  Calendar,
  Users
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
  const [studentData, setStudentData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchStudentData()
    fetchPosts()
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

  const getFallbackImage = (postId: string) => {
    const fallbackImages = [
      'basketball-post.jpg',
      'victory-celebration.jpg', 
      'soccer-match.jpg',
      'cricket-match.jpg',
      'table-tennis.jpg'
    ]
    // Use post ID to ensure consistent image assignment
    const imageIndex = Math.abs(postId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % fallbackImages.length
    return fallbackImages[imageIndex]
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Announcements</h1>
            <p className="text-gray-600 mt-1">Official announcements and updates from sports administrators</p>
          </div>
        </div>

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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{post.content}</p>
                {/* Add fallback images for posts without images */}
                {!post.imageURL && (
                  <img 
                    src={`/${getFallbackImage(post.id)}`} 
                    alt="Sports activity"
                    className="w-full rounded-lg object-cover h-64 mb-4"
                  />
                )}
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

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Announcements Yet</h3>
            <p className="text-gray-500">Check back later for official announcements from sports administrators</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}