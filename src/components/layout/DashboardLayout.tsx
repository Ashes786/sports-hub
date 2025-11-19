'use client'

import { useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
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
  const pageTitle = getPageTitle(pathname, userType)

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
        {/* Mobile Top Bar Spacer */}
        <div className="md:hidden h-16"></div>
        
        {/* Page Header */}
        <div className="bg-white border-b px-6 py-4">
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