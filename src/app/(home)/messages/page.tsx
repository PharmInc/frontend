"use client";

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import MessagesList from './_components/MessagesList'
import EmptyChatState from './_components/EmptyChatState'
import ChatInterface  from './_components/ChatInterface'
import { LoginPrompt } from './_components/LoginPrompt'
import { useChatStore } from '@/store'
import { useUserStore } from '@/store/userStore'
import { getAuthToken } from '@/lib/api/utils'

function MessagesContent() {
  const searchParams = useSearchParams()
  const userIdFromUrl = searchParams.get('user')
  
  const { selectedChat, setSelectedChat, connect, disconnect, fetchConversations } = useChatStore()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { currentUser, fetchCurrentUser, fetchUserById, loading: userLoading } = useUserStore()

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken()
      
      if (token) {
        setIsAuthenticated(true)
        if (!currentUser && !userLoading) {
          await fetchCurrentUser()
        }
      } else {
        setIsAuthenticated(false)
      }
    }
    
    checkAuth()
  }, [currentUser, fetchCurrentUser, userLoading])

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (currentUser?.id) {
      connect(currentUser.id)
      fetchConversations(currentUser.id)
      
      // Cleanup on unmount
      return () => {
        disconnect()
      }
    }
  }, [currentUser?.id, connect, disconnect, fetchConversations])

  useEffect(() => {
    const selectUserFromUrl = async () => {
      if (userIdFromUrl && currentUser?.id && isAuthenticated) {
        try {
          const userData = await fetchUserById(userIdFromUrl)
          if (userData && userData.id && userData.name) {
            setSelectedChat({
              id: userData.id,
              name: userData.name,
              username: userData.id,
              avatar: userData.profilePicture,
              verified: false,
              online: false
            })
          }
        } catch (error) {
          console.error('Error fetching user for direct message:', error)
        }
      }
    }

    selectUserFromUrl()
  }, [userIdFromUrl, currentUser?.id, isAuthenticated, setSelectedChat, fetchUserById])

  if (isAuthenticated === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  if (isAuthenticated === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  return (
    <div className="h-full bg-white flex" style={{ height: 'calc(100vh - 24px)' }}>
      <MessagesList />
      <div className="flex-1 h-full">
        {
          selectedChat ? (
                <ChatInterface
                  recipientName={selectedChat.name}
                  recipientAvatar={selectedChat.avatar}
                  recipientUsername={selectedChat.username}
                  recipientVerified={selectedChat.verified}
                  recipientOnline={selectedChat.online}
                />
              ) : (
                <EmptyChatState />
              )
        }
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  )
}