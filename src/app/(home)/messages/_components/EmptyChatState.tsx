"use client";

import React from 'react'
import { MessageCircle } from 'lucide-react'

export default function EmptyChatState() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <MessageCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 font-sans">
          Your Messages
        </h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          Send private messages to your colleagues, research partners, and healthcare institutions.
        </p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
          Write a message
        </button>
      </div>
    </div>
  )
}
