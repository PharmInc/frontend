"use client";

import React, { useState } from 'react'
import { Send, Image, Smile, MoreHorizontal, Phone, Video, Info } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ChatMessage {
  id: string
  content: string
  timestamp: string
  sender: 'me' | 'other'
  type: 'text' | 'image'
}

interface ChatInterfaceProps {
  recipientName?: string
  recipientAvatar?: string
  recipientUsername?: string
  recipientVerified?: boolean
  recipientOnline?: boolean
}

const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Hi! I saw your research on pharmaceutical innovations. Very impressive work!",
    timestamp: "10:30 AM",
    sender: "other",
    type: "text"
  },
  {
    id: "2",
    content: "Thank you! I'd love to discuss potential collaboration opportunities.",
    timestamp: "10:32 AM",
    sender: "me",
    type: "text"
  },
  {
    id: "3",
    content: "That sounds great. Are you available for a call this week?",
    timestamp: "10:35 AM",
    sender: "other",
    type: "text"
  },
  {
    id: "4",
    content: "Yes, absolutely. What day works best for you?",
    timestamp: "10:37 AM",
    sender: "me",
    type: "text"
  },
  {
    id: "5",
    content: "How about Thursday at 2 PM? We can discuss the project details and next steps.",
    timestamp: "10:40 AM",
    sender: "other",
    type: "text"
  }
]

export default function ChatInterface({ 
  recipientName = "Dr. Sarah Johnson",
  recipientAvatar = "/api/placeholder/40/40",
  recipientUsername = "sarah_j",
  recipientVerified = true,
  recipientOnline = true
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages)

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        sender: "me",
        type: "text"
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-1 flex-col bg-white w-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={recipientAvatar} alt={recipientName} />
                <AvatarFallback>
                  {recipientName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {recipientOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-1">
                <h2 className="font-semibold text-gray-900 font-sans">{recipientName}</h2>
                {recipientVerified && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-500">@{recipientUsername}</p>
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
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              msg.sender === 'me' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Start a new message"
              className="w-full p-3 pr-12 border border-gray-200 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ maxHeight: '120px' }}
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <Image className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <Smile className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-3 rounded-full transition-colors ${
              message.trim()
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
