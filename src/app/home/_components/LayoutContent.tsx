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
    <>
      <div className="fixed top-0 left-0 h-full w-64 hidden lg:block z-10">
        <LeftSidebar user={currentUser} />
      </div>

      <div className="fixed top-0 right-0 h-full w-80 hidden xl:block z-10">
        <div className="h-full overflow-y-auto bg-white border-l border-gray-200">
          <RightSidebar />
        </div>
      </div>

      <div className="lg:ml-64 xl:mr-80">
        <div className="min-h-screen bg-white">
          <main className="max-w-2xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
