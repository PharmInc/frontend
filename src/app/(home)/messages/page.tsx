"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import MessagesList from './_components/MessagesList'
import EmptyChatState from './_components/EmptyChatState'
import ChatInterface  from './_components/ChatInterface'
import { LoginPrompt } from './_components/LoginPrompt'
import { useChatStore } from '@/store'
import { useUserStore } from '@/store/userStore'
import { getAuthToken } from '@/lib/api/utils'

export default function MessagesPage() {
  const router = useRouter()
  const { selectedChat } = useChatStore()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { currentUser, fetchCurrentUser, loading: userLoading } = useUserStore()

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