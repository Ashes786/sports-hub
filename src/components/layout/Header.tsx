'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  currentPage?: string
}

export default function Header({ currentPage }: HeaderProps) {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/numl-logo-official.png"
              alt="NUML Logo"
              className="w-10 h-10 object-contain rounded-full"
            />
            <span className="text-xl font-bold text-gray-900">Sports Hub</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/achievements">
              <Button 
                variant={currentPage === 'achievements' ? 'default' : 'ghost'} 
                className={`${
                  currentPage === 'achievements' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                Achievements
              </Button>
            </Link>
            <Link href="/events">
              <Button 
                variant={currentPage === 'events' ? 'default' : 'ghost'} 
                className={`${
                  currentPage === 'events' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                Events
              </Button>
            </Link>
            <Link href="/sports-health">
              <Button 
                variant={currentPage === 'sports-health' ? 'default' : 'ghost'} 
                className={`${
                  currentPage === 'sports-health' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                Sports & Health
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                variant="secondary"
                className="text-gray-900 bg-white border-gray-300 hover:bg-gray-100 px-6 py-2 shadow-sm"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}