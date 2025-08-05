"use client"

import React, { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Users, MessageCircle } from "lucide-react"
import { NotificationItem } from './_components/NotificationItem'
import { ConnectionRequestItem } from './_components/ConnectionRequestItem'
import { LoginPrompt } from './_components/LoginPrompt'
import { useUserStore } from '@/store/userStore'
import { getAuthToken } from '@/lib/api/utils'
import Link from 'next/link'

const page = () => {
  const [loadingStates, setLoadingStates] = useState<{[key: string]: { accept: boolean; reject: boolean }}>({})
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { currentUser, fetchCurrentUser, loading: userLoading } = useUserStore()

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken()
      if (token) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }
    
    checkAuth()
  }, [currentUser, fetchCurrentUser, userLoading])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-2xl mx-auto pt-8 px-4">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900 font-sans">Notifications</h1>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <div className="text-lg text-gray-600">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  const allNotifications = [
    {
      type: "like",
      user: "Dr. Sarah Johnson",
      action: "liked your post about new medical research",
      time: "2 hours ago",
      avatar: "SJ"
    },
    {
      type: "connection",
      user: "Medical University",
      action: "wants to connect with you",
      time: "4 hours ago",
      avatar: "MU",
      userId: "mu-123"
    },
    {
      type: "comment",
      user: "Dr. Mike Chen",
      action: "commented on your research paper",
      time: "6 hours ago",
      avatar: "MC"
    },
    {
      type: "connection",
      user: "Dr. Emily Rodriguez", 
      action: "sent you a connection request",
      time: "8 hours ago",
      avatar: "ER",
      userId: "er-456"
    },
    {
      type: "general",
      user: "PharmInc",
      action: "shared a new job opportunity that might interest you",
      time: "1 day ago",
      avatar: "PI"
    }
  ]

  const generalNotifications = allNotifications.filter(n => n.type === "general" || n.type === "like" || n.type === "comment")
  const connectionNotifications = allNotifications.filter(n => n.type === "connection")

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-2xl mx-auto pt-8 px-4">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900 font-sans">Notifications</h1>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-full p-1">
            <TabsTrigger 
              value="all" 
              className="flex items-center space-x-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Bell className="w-4 h-4" />
              <span>All</span>
            </TabsTrigger>
            <TabsTrigger 
              value="general" 
              className="flex items-center space-x-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <MessageCircle className="w-4 h-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger 
              value="connections" 
              className="flex items-center space-x-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              <span>Connections</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-0">
                {allNotifications.length > 0 ? (
                  allNotifications.map((notification, index) => (
                    <NotificationItem key={index} {...notification} />
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No notifications yet</p>
                    <p className="text-sm text-gray-400 mt-1">We'll notify you when something happens</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="mt-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-0">
                {generalNotifications.length > 0 ? (
                  generalNotifications.map((notification, index) => (
                    <NotificationItem key={index} {...notification} />
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No general notifications</p>
                    <p className="text-sm text-gray-400 mt-1">Activity notifications will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="mt-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-0">
                {connectionNotifications.length > 0 ? (
                  connectionNotifications.map((notification, index) => (
                    <ConnectionRequestItem 
                      key={index} 
                      user={notification.user}
                      action={notification.action}
                      time={notification.time}
                      avatar={notification.avatar}
                      onAccept={()=>{}}
                      onReject={()=>{}}
                      isLoading={loadingStates[notification.userId || `user-${index}`] || { accept: false, reject: false }}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No connection requests</p>
                    <p className="text-sm text-gray-400 mt-1">Connection requests will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default page;
