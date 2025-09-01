"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Bell, Users, MessageCircle, ArrowLeft } from "lucide-react"
import { NotificationItem } from './_components/NotificationItem'
import { ConnectionRequestItem } from './_components/ConnectionRequestItem'
import { LoginPrompt } from './_components/LoginPrompt'
import { useUserStore, useNotificationStore } from '@/store'
import { getAuthToken } from '@/lib/api/utils'
import { acceptConnection, disconnectUser, Connect, User } from '@/lib/api'

interface ConnectionWithUser extends Connect {
  user: User;
}

const NotificationsPage = () => {
  const router = useRouter()
  const [loadingStates, setLoadingStates] = useState<{[key: string]: { accept: boolean; reject: boolean }}>({})
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { currentUser, fetchCurrentUser, loading: userLoading } = useUserStore()
  const { 
    connectionRequests, 
    loading: notificationLoading, 
    fetchNotifications,
    markAsRead 
  } = useNotificationStore()

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken()
      console.log('Auth token:', token ? 'exists' : 'not found')
      
      if (token) {
        setIsAuthenticated(true)
        if (!currentUser && !userLoading) {
          console.log('Fetching current user...')
          await fetchCurrentUser()
        } else {
          console.log('Current user:', currentUser ? { id: currentUser.id, name: currentUser.name } : 'null')
        }
      } else {
        console.log('No auth token, user not authenticated')
        setIsAuthenticated(false)
      }
    }
    
    checkAuth()
  }, [currentUser, fetchCurrentUser, userLoading])

  useEffect(() => {
    const fetchConnectionRequests = async () => {
      if (!currentUser?.id || !isAuthenticated) {
        console.log('Cannot fetch connections - missing data:', { 
          currentUserId: currentUser?.id, 
          isAuthenticated 
        })
        return
      }
      
      console.log('Fetching notifications for user:', currentUser.id)
      await fetchNotifications(currentUser.id)
    }

    if (currentUser?.id && isAuthenticated) {
      fetchConnectionRequests()
    }
  }, [currentUser?.id, isAuthenticated, fetchNotifications])

  // Mark notifications as read when user visits the page
  useEffect(() => {
    if (currentUser?.id && isAuthenticated && connectionRequests.length > 0) {
      // Add a small delay to ensure the user actually sees the notifications
      const timer = setTimeout(() => {
        markAsRead()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [currentUser?.id, isAuthenticated, connectionRequests.length, markAsRead])

  const handleAcceptConnection = async (connectionId: string) => {
    const connection = connectionRequests.find(conn => conn.id === connectionId)
    if (!connection || !currentUser?.id) return
    
    setLoadingStates(prev => ({
      ...prev,
      [connectionId]: { ...prev[connectionId], accept: true }
    }))
    
    try {
      await acceptConnection(connection.id1)
      // Refetch notifications to update the state
      await fetchNotifications(currentUser.id)
    } catch (error) {
      console.error('Error accepting connection:', error)
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        [connectionId]: { ...prev[connectionId], accept: false }
      }))
    }
  }

  const handleRejectConnection = async (connectionId: string) => {
    const connection = connectionRequests.find(conn => conn.id === connectionId)
    if (!connection) return
    
    // TODO -> Backend api missing for rejecting
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-gray-900" />
            <h1 className="text-xl font-bold text-gray-900 font-sans">Notifications</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  // For now, we'll keep general notifications empty since we're focusing on connection requests
  const generalNotifications: any[] = []

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900 font-sans">Notifications</h1>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="p-4 border-b border-gray-100">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50 border border-gray-200 rounded-full p-1">
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
              {connectionRequests.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {connectionRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1">
          <TabsContent value="all" className="">
            <div className="bg-white">
              {notificationLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <div className="text-sm text-gray-600">Loading notifications...</div>
                  </div>
                </div>
              ) : connectionRequests.length > 0 ? (
                <div className="space-y-4 p-4">
                  {connectionRequests.map((connectionRequest) => (
                    <ConnectionRequestItem 
                      key={connectionRequest.id}
                      user={connectionRequest.user}
                      connectionId={connectionRequest.id}
                      time={formatTimeAgo(connectionRequest.created_at)}
                      onAccept={handleAcceptConnection}
                      onReject={handleRejectConnection}
                      isLoading={loadingStates[connectionRequest.id] || { accept: false, reject: false }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <Bell className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">No notifications yet</h3>
                  <p className="text-gray-400 text-center max-w-sm">We'll notify you when something happens</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="general" className="">
            <div className="bg-white">
              {generalNotifications.length > 0 ? (
                <div className="space-y-4 p-4">
                  {generalNotifications.map((notification, index) => (
                    <NotificationItem key={index} {...notification} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">No general notifications</h3>
                  <p className="text-gray-400 text-center max-w-sm">Activity notifications will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="connections" className="">
            <div className="bg-white">
              {notificationLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <div className="text-sm text-gray-600">Loading connection requests...</div>
                  </div>
                </div>
              ) : connectionRequests.length > 0 ? (
                <div className="space-y-4 p-4">
                  {connectionRequests.map((connectionRequest) => (
                    <ConnectionRequestItem 
                      key={connectionRequest.id}
                      user={connectionRequest.user}
                      connectionId={connectionRequest.id}
                      time={formatTimeAgo(connectionRequest.created_at)}
                      onAccept={handleAcceptConnection}
                      onReject={handleRejectConnection}
                      isLoading={loadingStates[connectionRequest.id] || { accept: false, reject: false }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <Users className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">No connection requests</h3>
                  <p className="text-gray-400 text-center max-w-sm">Connection requests will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default NotificationsPage;
