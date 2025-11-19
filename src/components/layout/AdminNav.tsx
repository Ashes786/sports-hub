'use client'

import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Home, Users, Calendar, Trophy, MessageSquare, Settings, LogOut, Plus, Team, UserPlus, Megaphone } from 'lucide-react'
import Link from 'next/link'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'Students', href: '/admin/students' },
  { icon: Team, label: 'Teams', href: '/admin/teams' },
  { icon: Calendar, label: 'Events', href: '/admin/events' },
  { icon: MessageSquare, label: 'Posts', href: '/admin/posts' },
  { icon: Megaphone, label: 'Announcements', href: '/admin/announcements' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

interface AdminNavProps {
  userName?: string
  onLogout?: () => void
}

export function AdminNav({ userName, onLogout }: AdminNavProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    if (onLogout) onLogout()
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img
              src="/numl-logo-official.png"
              alt="NUML Logo"
              className="w-10 h-10 object-contain rounded-full"
            />
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName || 'Admin'}</p>
              <Badge variant="destructive">Administrator</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>
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
    </nav>
  )
}