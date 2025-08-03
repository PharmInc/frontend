"use client";

import React, { useEffect } from 'react'
import LeftSidebar from './LeftSidebar'
import { RightSidebar } from './RightSidebar'
import { useUserStore } from '@/store'

interface LayoutContentProps {
  children: React.ReactNode
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { currentUser, fetchCurrentUser } = useUserStore()

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-[1300px] mx-auto flex justify-center">
        <div className="sticky top-0 h-screen flex-shrink-0">
          <div className="w-16 xl:w-64 transition-all duration-200 h-full">
            <LeftSidebar user={currentUser} />
          </div>
        </div>

        <div className="flex-1 min-w-0 max-w-[600px] border-x border-gray-200">
          <main className="w-full">
            {children}
          </main>
        </div>

        <div className="hidden lg:block w-80 sticky top-0 h-screen flex-shrink-0">
          <div className="h-full overflow-y-auto bg-white">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
