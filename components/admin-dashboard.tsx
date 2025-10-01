"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Activity, TrendingUp, Eye, RefreshCw, CheckCircle, Shield } from "lucide-react"

// Mock data for demo
const mockAnalytics = {
  summary: {
    totalUsers: 156,
    totalCredentials: 89,
    totalEvents: 1247,
    recentAnalytics: {
      page_views: 45,
    },
  },
  dailyAnalytics: [
    {
      date: "2024-01-15",
      total_visitors: 45,
      new_users: 8,
      credentials_issued: 12,
      verifications: 23,
      wallet_connections: 15,
      page_views: 156,
      unique_visitors: 42,
    },
    {
      date: "2024-01-14",
      total_visitors: 38,
      new_users: 5,
      credentials_issued: 8,
      verifications: 19,
      wallet_connections: 12,
      page_views: 134,
      unique_visitors: 35,
    },
    {
      date: "2024-01-13",
      total_visitors: 52,
      new_users: 11,
      credentials_issued: 15,
      verifications: 28,
      wallet_connections: 18,
      page_views: 187,
      unique_visitors: 48,
    },
  ],
}

interface AdminDashboardProps {
  onClose: () => void
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [analytics] = useState(mockAnalytics)
  const [lastUpdated] = useState(new Date())

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Platform analytics and management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</div>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.summary.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered wallet addresses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credentials Issued</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.summary.totalCredentials}</div>
                <p className="text-xs text-muted-foreground">Total credentials in system</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.summary.totalEvents}</div>
                <p className="text-xs text-muted-foreground">Tracked user interactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.summary.recentAnalytics?.page_views || 0}</div>
                <p className="text-xs text-muted-foreground">Page views today</p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Analytics (Last 3 Days)</CardTitle>
              <CardDescription>Platform usage metrics over the past few days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.dailyAnalytics.map((day) => (
                  <div key={day.date} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </h4>
                      <Badge variant="outline">{day.total_visitors} visitors</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{day.page_views} page views</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-green-500" />
                        <span>{day.unique_visitors} unique</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-purple-500" />
                        <span>{day.wallet_connections} connections</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-2 text-orange-500" />
                        <span>{day.credentials_issued} credentials</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current platform health and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-900">Platform Status</p>
                      <p className="text-sm text-green-700">All systems operational</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-900">Wallet Integration</p>
                      <p className="text-sm text-green-700">MetaMask connection working</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-900">Demo Mode</p>
                      <p className="text-sm text-blue-700">Running with mock data</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Demo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
