'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  Plus, 
  Settings, 
  LogOut,
  MessageCircle,
  Trophy,
  Clock,
  MessageSquare,
  Users as TeamIcon,
  UserPlus,
  Megaphone
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SidebarItem {
  icon: any
  label: string
  href: string
}

interface SidebarProps {
  userType: 'student' | 'admin'
  userName?: string
  studentId?: string
  teamName?: string
  onLogout?: () => void
}

const studentMenuItems: SidebarItem[] = [
  { icon: Home, label: 'Dashboard', href: '/student/dashboard' },
  { icon: MessageCircle, label: 'Feed', href: '/student/feed' },
  { icon: Calendar, label: 'Upcoming Events', href: '/student/upcoming-events' },
  { icon: Trophy, label: 'Recent Events', href: '/student/recent-events' },
  { icon: Plus, label: 'Create Post', href: '/student/create-post' },
  { icon: Users, label: 'My Team', href: '/student/my-team' },
  { icon: Settings, label: 'Settings', href: '/student/settings' },
]

const adminMenuItems: SidebarItem[] = [
  { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'Students', href: '/admin/students' },
  { icon: TeamIcon, label: 'Teams', href: '/admin/teams' },
  { icon: Calendar, label: 'Events', href: '/admin/events' },
  { icon: MessageSquare, label: 'Posts', href: '/admin/posts' },
  { icon: Megaphone, label: 'Announcements', href: '/admin/announcements' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

function SidebarContent({ 
  userType, 
  userName, 
  studentId, 
  teamName, 
  onLogout, 
  isCollapsed = false 
}: SidebarProps & { isCollapsed?: boolean }) {
  const pathname = usePathname()
  const menuItems = userType === 'student' ? studentMenuItems : adminMenuItems

  const handleLogout = () => {
    // Clear all authentication data immediately
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Call parent logout handler if provided
    if (onLogout) {
      onLogout()
    }
    
    // Force redirect to prevent any race conditions
    window.location.href = '/'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Image
            src="/numl-logo-official.png"
            alt="NUML Logo"
            width={40}
            height={40}
            className="object-contain rounded-full"
          />
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">NUML Sports Hub</h1>
              <p className="text-xs text-gray-500 capitalize">{userType} Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-900">{userName || 'User'}</p>
              {userType === 'student' && studentId && (
                <p className="text-xs text-gray-500">ID: {studentId}</p>
              )}
              {userType === 'admin' && (
                <Badge variant="destructive" className="text-xs">Administrator</Badge>
              )}
              {teamName && (
                <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800 text-xs">
                  {teamName}
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {userName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className={`w-full justify-start group ${
            isCollapsed ? 'px-3' : 'px-3'
          }`}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  )
}

export function Sidebar({ userType, userName, studentId, teamName, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex bg-white border-r transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <SidebarContent
          userType={userType}
          userName={userName}
          studentId={studentId}
          teamName={teamName}
          onLogout={onLogout}
          isCollapsed={isCollapsed}
        />
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-white border rounded-full p-1 shadow-md hover:bg-gray-50"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 bg-white shadow-md">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent
              userType={userType}
              userName={userName}
              studentId={studentId}
              teamName={teamName}
              onLogout={onLogout}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}