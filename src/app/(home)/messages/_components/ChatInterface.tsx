"use client";

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, MoreHorizontal, Phone, Video, Info } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useChatStore } from '@/store/chatStore'
import { useUserStore } from '@/store/userStore'
import { getProfilePictureUrl, isProfilePictureUrl } from '@/lib/utils'

interface ChatInterfaceProps {
  recipientName?: string
  recipientAvatar?: string
  recipientUsername?: string
  recipientVerified?: boolean
  recipientOnline?: boolean
}

export default function ChatInterface({ 
  recipientName = "Dr. Sarah Johnson",
  recipientAvatar = "/api/placeholder/40/40",
  recipientUsername = "sarah_j",
  recipientVerified = true,
  recipientOnline = true
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  const { 
    messages, 
    sendMessage, 
    fetchMessages,
    selectedChat,
    onlineUsers 
  } = useChatStore()
  
  const { currentUser } = useUserStore()
  
  const conversationKey = selectedChat && currentUser 
    ? [currentUser.id, selectedChat.id].sort().join('_')
    : ''
    
  const currentMessages = conversationKey ? (messages[conversationKey] || []) : []

  useEffect(() => {
    if (selectedChat?.id && currentUser?.id) {
      fetchMessages(currentUser.id, selectedChat.id)
    }
  }, [selectedChat?.id, currentUser?.id, fetchMessages])

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (message.trim() && selectedChat?.id) {
      sendMessage(selectedChat.id, message.trim())
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getRecipientProfilePicture = () => {
    const profilePicture = selectedChat?.avatar || recipientAvatar;
    const recipientId = selectedChat?.id || recipientUsername || '';
    
    if (!profilePicture || profilePicture === "/api/placeholder/40/40") return "/pp.png";
    
    if (isProfilePictureUrl(profilePicture)) {
      console.log('Using existing API URL:', profilePicture)
      return profilePicture;
    }
    
    if (profilePicture.startsWith('http') || profilePicture.startsWith('/')) {
      console.log('Using legacy/external URL:', profilePicture)
      return profilePicture;
    }
    
    const constructedUrl = getProfilePictureUrl(recipientId, profilePicture);
    console.log('Constructed profile URL:', constructedUrl)
    return constructedUrl;
  }

  const isRecipientOnline = selectedChat ? onlineUsers.has(selectedChat.id) : recipientOnline

  const handleProfileClick = () => {
    const recipientId = selectedChat?.id || recipientUsername
    if (recipientId) {
      router.push(`/profile/${recipientId}`)
    }
  }

  return (
    <div className="h-full flex flex-1 flex-col bg-white w-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
            onClick={handleProfileClick}
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={getRecipientProfilePicture()} alt={selectedChat?.name || recipientName} />
                <AvatarFallback>
                  {(selectedChat?.name || recipientName).split(' ').map((n, i) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isRecipientOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-1">
                <h2 className="font-semibold text-gray-900 font-sans">
                  {selectedChat?.name || recipientName}
                </h2>
                {(selectedChat?.verified || recipientVerified) && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {isRecipientOnline ? 'Online' : `@${selectedChat?.username || recipientUsername}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-400">
                Send a message to {selectedChat?.name || recipientName}
              </p>
            </div>
          </div>
        ) : (
          currentMessages.map((msg) => {
            const isFromMe = msg.senderUsername === currentUser?.id
            return (
              <div
                key={msg.id}
                className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isFromMe 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className={`text-xs ${
                      isFromMe ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTimestamp(msg.timestamp)}
                    </p>
                    {msg.sending && isFromMe && (
                      <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Start a new message"
              className="w-full py-3 pl-4 pr-12 border border-gray-200 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
              rows={1}
              style={{ maxHeight: '120px' }}
              disabled={!selectedChat}
            />

          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || !selectedChat}
            className={`p-3 rounded-full transition-colors flex-shrink-0 ${
              message.trim() && selectedChat
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
