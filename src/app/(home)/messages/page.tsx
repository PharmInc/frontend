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
    <>
      <div className="min-h-screen bg-white">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
        </div>
        
        <div className="h-full flex-1 flex w-full">
          <MessagesList />
          <div className="flex-1">
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
      </div>
    </>
  )
}