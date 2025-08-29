"use client"

import { useEffect } from 'react'
import { useUserStore, useNotificationStore } from '@/store'
import { getAuthToken } from '@/lib/api/utils'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useUserStore()
  const { fetchNotifications } = useNotificationStore()

  useEffect(() => {
    const initializeNotifications = async () => {
      const token = getAuthToken()
      
      if (token && currentUser?.id) {
        await fetchNotifications(currentUser.id)
      }
    }

    initializeNotifications()
  }, [currentUser?.id, fetchNotifications])

  return <>{children}</>
}
