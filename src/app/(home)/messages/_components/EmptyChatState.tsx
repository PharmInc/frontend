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
          Messaging Coming Soon
        </h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          We're working on bringing you a seamless messaging experience. Connect with colleagues and healthcare professionals soon.
        </p>
        <button 
          disabled 
          className="bg-gray-300 text-gray-500 px-6 py-2 rounded-full cursor-not-allowed"
        >
          Feature coming soon
        </button>
      </div>
    </div>
  )
}
