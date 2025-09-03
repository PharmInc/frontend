import { Metadata } from 'next'
import Link from 'next/link'
import { Building, Users, FileText, BarChart3, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Admin Dashboard - PharmInc',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
  other: {
    'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache',
  },
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your platform efficiently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Institute Onboarding */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Institute Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Onboard new medical institutions to the platform with comprehensive setup.
              </p>
              <Link href="/admin/5d7076d5-8936-4d03-9007-b0ea9c20425d">
                <Button className="w-full">
                  Start Onboarding
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage users, verify accounts, and handle user-related issues.
              </p>
              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Content Moderation */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Content Moderation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Review and moderate posts, jobs, and other platform content.
              </p>
              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                View platform statistics, usage analytics, and growth metrics.
              </p>
              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configure platform settings, features, and system parameters.
              </p>
              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Institutions</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Jobs</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Reviews</span>
                  <span className="font-semibold">-</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-amber-900">Security Notice</p>
                <p className="text-amber-800 text-sm">
                  This admin panel is protected from search engine indexing and is only accessible to authorized administrators.
                  Please ensure you log out when finished and never share your access credentials.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
