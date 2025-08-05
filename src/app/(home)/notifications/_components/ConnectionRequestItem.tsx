import React from 'react'
import { Button } from "@/components/ui/button"
import { Check, X, UserPlus } from "lucide-react"

interface ConnectionRequestItemProps {
  user: string
  action: string
  time: string
  avatar: string
  onAccept: () => void
  onReject: () => void
  isLoading: { accept: boolean; reject: boolean }
}

export const ConnectionRequestItem = ({ 
  user, 
  action, 
  time, 
  avatar,
  onAccept,
  onReject,
  isLoading
}: ConnectionRequestItemProps) => (
  <div className="flex items-start space-x-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 font-sans">
    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
      {avatar}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-900 leading-relaxed">
          <span className="font-semibold hover:underline cursor-pointer">{user}</span>{' '}
          <span className="text-gray-700">{action}</span>
        </p>
        <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
          <UserPlus className="w-4 h-4 text-blue-500" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
      
      <div className="flex gap-2 mt-3">
        <Button
          variant="default"
          size="sm"
          onClick={onAccept}
          disabled={isLoading.accept || isLoading.reject}
          className="h-8 bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-full px-4 font-medium transition-all duration-200"
        >
          {isLoading.accept ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Accepting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3" />
              <span>Accept</span>
            </div>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onReject}
          disabled={isLoading.accept || isLoading.reject}
          className="h-8 border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 rounded-full px-4 font-medium transition-all duration-200"
        >
          {isLoading.reject ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Rejecting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <X className="h-3 w-3" />
              <span>Reject</span>
            </div>
          )}
        </Button>
      </div>
    </div>
    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
  </div>
)
