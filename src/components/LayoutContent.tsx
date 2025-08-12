"use client";

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import LeftSidebar from './LeftSidebar'
import { RightSidebar } from '../app/(home)/home/_components/RightSidebar'
import { useUserStore, useInstitutionStore, useChatStore } from '@/store'
import { getUserType } from '@/lib/api/utils'

interface LayoutContentProps {
  children: React.ReactNode
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { currentUser, fetchCurrentUser } = useUserStore()
  const { currentInstitution, fetchCurrentInstitution } = useInstitutionStore()
  const pathname = usePathname()

  const isMessagesPage = pathname?.startsWith('/messages')

  useEffect(() => {
    const userType = getUserType()
    
    if (userType === 'institution') {
      fetchCurrentInstitution()
    } else {
      fetchCurrentUser()
    }
  }, [fetchCurrentUser, fetchCurrentInstitution])

  const currentEntity = (() => {
    const userType = getUserType();
    
    if (userType === 'institution' && currentInstitution) {
      return {
        id: currentInstitution.id,
        name: currentInstitution.name,
        location: currentInstitution.location,
        profile_picture: currentInstitution.profile_picture,
        type: currentInstitution.type,
        verified: currentInstitution.verified,
        employees_count: currentInstitution.employees_count,
        area_of_expertise: currentInstitution.area_of_expertise,
      };
    }
    
    return currentUser;
  })();

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-[1300px] w-full mx-auto flex justify-center">
        <div className="sticky top-0 h-screen flex-shrink-0">
          <div className="w-16 xl:w-64 transition-all duration-200 h-full">
            <LeftSidebar user={currentEntity} />
          </div>
        </div>

        <div className="flex-1 min-w-0 border-x border-gray-200 pt-3">
          <main className="w-full h-full">
            {children}
          </main>
        </div>

        {
          !isMessagesPage && (
            <div className="hidden lg:block w-80 sticky top-0 h-screen flex-shrink-0">
              <div className="h-full overflow-y-auto bg-white">
                <RightSidebar />
              </div>
            </div>
          )
        }


      </div>
    </div>
  )
}
