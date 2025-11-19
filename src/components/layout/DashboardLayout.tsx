'use client'

import { useState, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
  userType: 'student' | 'admin'
  userName?: string
  studentId?: string
  teamName?: string
  onLogout?: () => void
}

function getPageTitle(pathname: string, userType: 'student' | 'admin'): string {
  const pathSegments = pathname.split('/').filter(Boolean)
  
  if (pathSegments.length === 0) return `${userType === 'admin' ? 'Admin' : 'Student'} Dashboard`
  
  const lastSegment = pathSegments[pathSegments.length - 1]
  
  const titles: Record<string, string> = {
    'dashboard': 'Dashboard',
    'feed': 'Community Feed',
    'create-post': 'Create Post',
    'my-team': 'My Team',
    'teams': 'Teams',
    'events': 'Events',
    'upcoming-events': 'Upcoming Events',
    'recent-events': 'Recent Events',
    'achievements': 'Achievements',
    'settings': 'Settings',
    'students': 'Manage Students',
    'announcements': 'Announcements',
    'posts': 'Manage Posts'
  }
  
  return titles[lastSegment] || 'Dashboard'
}

export function DashboardLayout({ 
  children, 
  userType, 
  userName, 
  studentId, 
  teamName, 
  onLogout 
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const pageTitle = getPageTitle(pathname, userType)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  // Verify authentication on mount and route change
  useEffect(() => {
    const checkAuth = () => {
      let token = localStorage.getItem('token')
      
      if (!token) {
        // Fallback to cookie if localStorage is empty
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
        if (tokenCookie) {
          token = tokenCookie.trim().split('=')[1]
          // Sync back to localStorage
          localStorage.setItem('token', token)
        }
      }
      
      if (!token) {
        setIsAuthenticated(false)
        router.push('/login')
        return
      }
      
      // Verify token is still valid by making a test request
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (!response.ok) {
          // Token is invalid, clear and redirect
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
          setIsAuthenticated(false)
          router.push('/login')
        } else {
          setIsAuthenticated(true)
        }
      }).catch(() => {
        // On error, assume token is invalid
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        setIsAuthenticated(false)
        router.push('/login')
      })
    }

    checkAuth()
    
    // Set up interval to check auth status less frequently to avoid race conditions
    const authCheckInterval = setInterval(checkAuth, 60000) // Check every minute instead of 30 seconds
    
    return () => clearInterval(authCheckInterval)
  }, [pathname, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        userType={userType}
        userName={userName}
        studentId={studentId}
        teamName={teamName}
        onLogout={onLogout}
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Page Header */}
        <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">
              {pageTitle}
            </h1>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}