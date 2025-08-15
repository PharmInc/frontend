import React from 'react'
import { Users } from 'lucide-react'

export const LoginPrompt = () => (
  <div className="flex flex-col bg-white min-h-screen">
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Users className="w-6 h-6 text-gray-900" />
        <h1 className="text-xl font-bold text-gray-900 font-sans">My Networks</h1>
      </div>
    </div>
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center max-w-md w-full">
        <Users className="h-16 w-16 text-blue-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-3 font-sans">View Your Networks</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Sign in to see your connections, followers, and the people you follow.
        </p>
        <div className="space-y-3">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-colors">
            Sign In
          </button>
          <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-full transition-colors">
            Create Account
          </button>
        </div>
      </div>
    </div>
  </div>
)
