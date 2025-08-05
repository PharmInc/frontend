import React from 'react'
import { Heart, MessageCircle, UserPlus, Briefcase } from 'lucide-react'

interface NotificationItemProps {
  type: string
  user: string
  action: string
  time: string
  avatar: string
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="w-4 h-4 text-red-500" />
    case 'comment':
      return <MessageCircle className="w-4 h-4 text-blue-500" />
    case 'connection':
      return <UserPlus className="w-4 h-4 text-green-500" />
    case 'general':
      return <Briefcase className="w-4 h-4 text-purple-500" />
    default:
      return <div className="w-4 h-4 bg-gray-400 rounded-full" />
  }
}

const getAvatarColor = (type: string) => {
  switch (type) {
    case 'like':
      return 'bg-red-100 text-red-600'
    case 'comment':
      return 'bg-blue-100 text-blue-600'
    case 'connection':
      return 'bg-green-100 text-green-600'
    case 'general':
      return 'bg-purple-100 text-purple-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export const NotificationItem = ({ 
  type, 
  user, 
  action, 
  time, 
  avatar 
}: NotificationItemProps) => (
  <div className="flex items-start space-x-3 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 font-sans">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${getAvatarColor(type)}`}>
      {avatar}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-900 leading-relaxed">
          <span className="font-semibold hover:underline cursor-pointer">{user}</span>{' '}
          <span className="text-gray-700">{action}</span>
        </p>
        <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
          {getTypeIcon(type)}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
  </div>
)
