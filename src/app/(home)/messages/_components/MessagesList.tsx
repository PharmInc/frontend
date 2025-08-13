"use client";

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MoreHorizontal, MessageCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useChatStore } from '@/store'

interface Message {
  id: string
  user: {
    id: string
    name: string
    username: string
    avatar?: string
    verified?: boolean
    online?: boolean
  }
  lastMessage: string
  timestamp: string
  unread: boolean
}

const mockMessages: Message[] = []

export default function MessagesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const { setSelectedChat } = useChatStore()
  const router = useRouter()

  const filteredMessages = mockMessages.filter(message =>
    message.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message.id)
    setSelectedChat({
      id: message.user.id,
      name: message.user.name,
      username: message.user.username,
      avatar: message.user.avatar,
      verified: message.user.verified,
      online: message.user.online
    })
  }

  return (
    <div className="h-full flex flex-col bg-white w-96">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold font-sans">Messages</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Direct Messages"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:bg-gray-200 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredMessages.length > 0 ? filteredMessages.map((message) => (
          <div
            key={message.id}
            onClick={() => handleMessageClick(message)}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedMessage === message.id ? 'bg-gray-100' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={message.user.avatar} alt={message.user.name} />
                  <AvatarFallback>
                    {message.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {message.user.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <span className={`font-semibold text-sm truncate ${message.unread ? 'text-black' : 'text-gray-900'}`}>
                      {message.user.name}
                    </span>
                    {message.user.verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${message.unread ? 'font-medium text-black' : 'text-gray-600'}`}>
                    {message.lastMessage}
                  </p>
                  {message.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center h-full py-16 px-4">
            <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">No messages yet</h3>
          </div>
        )}
      </div>
    </div>
  )
}
