'use client'

import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  MessageCircle,
  Trophy,
  Clock
} from 'lucide-react'
import Link from 'next/link'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/student/dashboard' },
  { icon: MessageCircle, label: 'Feed', href: '/student/feed' },
  { icon: Calendar, label: 'Upcoming Events', href: '/student/upcoming-events' },
  { icon: Trophy, label: 'Recent Events', href: '/student/recent-events' },
  { icon: Users, label: 'My Team', href: '/student/my-team' },
  { icon: Settings, label: 'Settings', href: '/student/settings' },
]

interface StudentNavProps {
  studentName?: string
  studentId?: string
  teamName?: string
  onLogout?: () => void
}

export function StudentNav({ studentName, studentId, teamName, onLogout }: StudentNavProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    // Clear token and user data
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    if (onLogout) onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/numl-logo-official.png"
                alt="NUML Logo"
                className="w-8 h-8 object-contain rounded-full"
              />
              <span className="text-lg font-bold text-gray-900">NUML Sports Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{studentName || 'Student'}</p>
                <p className="text-xs text-gray-500">ID: {studentId || 'N/A'}</p>
                {teamName && (
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                    {teamName}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-3 overflow-x-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}