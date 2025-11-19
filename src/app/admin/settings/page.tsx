'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { User, Bell, Shield, Database, Palette, HelpCircle, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AdminData {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminSettings() {
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Settings state
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newUsers: true,
    newPosts: true,
    systemAlerts: true
  })
  const [systemSettings, setSystemSettings] = useState({
    allowRegistrations: true,
    requireApproval: false,
    enableNotifications: true,
    maintenanceMode: false
  })

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
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

      // Mock admin data for now
      const mockAdminData: AdminData = {
        id: '1',
        name: 'Admin User',
        email: 'admin@numl.edu.pk',
        role: 'ADMIN'
      }
      
      setAdminData(mockAdminData)
      setFormData({
        name: mockAdminData.name,
        email: mockAdminData.email
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    router.push('/')
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      // Mock save functionality
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSystemSettings = async () => {
    setSaving(true)
    try {
      // Mock save functionality
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "System Settings Updated",
        description: "System settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating system settings.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!adminData) {
    return null
  }

  return (
    <DashboardLayout
      userType="admin"
      userName={adminData.name}
      onLogout={handleLogout}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-2">Manage your admin account and system settings</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Admin Profile</span>
            </CardTitle>
            <CardDescription>
              Update your admin profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Role</Label>
                <Input value={adminData.role} disabled className="mt-1 bg-gray-50" />
              </div>
              <div>
                <Label>Admin ID</Label>
                <Input value={adminData.id} disabled className="mt-1 bg-gray-50" />
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="mt-4">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>System Settings</span>
            </CardTitle>
            <CardDescription>
              Configure system-wide settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow New Registrations</p>
                <p className="text-sm text-gray-600">Enable new user registrations</p>
              </div>
              <Switch
                checked={systemSettings.allowRegistrations}
                onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, allowRegistrations: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Approval</p>
                <p className="text-sm text-gray-600">Require admin approval for new registrations</p>
              </div>
              <Switch
                checked={systemSettings.requireApproval}
                onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, requireApproval: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Notifications</p>
                <p className="text-sm text-gray-600">Enable system notifications</p>
              </div>
              <Switch
                checked={systemSettings.enableNotifications}
                onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, enableNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Put the system in maintenance mode</p>
              </div>
              <Switch
                checked={systemSettings.maintenanceMode}
                onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, maintenanceMode: checked })}
              />
            </div>
            <Button onClick={handleSaveSystemSettings} disabled={saving} className="mt-4">
              {saving ? 'Saving...' : 'Save System Settings'}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Admin Notifications</span>
            </CardTitle>
            <CardDescription>
              Manage how you receive admin notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive admin updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive browser push notifications</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New User Registrations</p>
                <p className="text-sm text-gray-600">Get notified when new users register</p>
              </div>
              <Switch
                checked={notifications.newUsers}
                onCheckedChange={(checked) => setNotifications({ ...notifications, newUsers: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Posts</p>
                <p className="text-sm text-gray-600">Get notified when users create posts</p>
              </div>
              <Switch
                checked={notifications.newPosts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, newPosts: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Alerts</p>
                <p className="text-sm text-gray-600">Receive critical system alerts</p>
              </div>
              <Switch
                checked={notifications.systemAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Database Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Management</span>
            </CardTitle>
            <CardDescription>
              Manage database operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Backup Database
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Restore Database
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Clear Cache
            </Button>
            <Button variant="outline" className="w-full justify-start">
              View Logs
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
            <CardDescription>
              Manage security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              View Audit Logs
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Manage API Keys
            </Button>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Help & Support</span>
            </CardTitle>
            <CardDescription>
              Get help and support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Admin Documentation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Report an Issue
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}