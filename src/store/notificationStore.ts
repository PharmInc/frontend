import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Connect, User } from '@/lib/api'
import { getUserConnections, getUserById } from '@/lib/api'

interface NotificationWithUser extends Connect {
  user: User;
}

interface NotificationState {
  unreadCount: number
  connectionRequests: NotificationWithUser[]
  loading: boolean
  error: string | null
  lastFetchTime: number | null

  // Actions
  fetchNotifications: (userId: string) => Promise<void>
  markAsRead: () => void
  clearNotifications: () => void
  getUnreadCount: () => number
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        unreadCount: 0,
        connectionRequests: [],
        loading: false,
        error: null,
        lastFetchTime: null,

        fetchNotifications: async (userId: string) => {
          if (!userId) {
            return
          }

          set({ loading: true, error: null })
          
          try {
            
            const connections = await getUserConnections(userId)
            
            const pendingRequests = connections.filter(
              conn => !conn.accepted && conn.user2_id === userId
            )
            
            const connectionsWithUsers = await Promise.all(
              pendingRequests.map(async (conn) => {
                try {
                  const user = await getUserById(conn.user1_id)
                  return { ...conn, user }
                } catch (error) {
                  console.error(`Error fetching user ${conn.user1_id}:`, error)
                  return null
                }
              })
            )
            
            const validConnections = connectionsWithUsers.filter(Boolean) as NotificationWithUser[]
            
            set({ 
              connectionRequests: validConnections,
              unreadCount: validConnections.length,
              loading: false,
              lastFetchTime: Date.now()
            })
          } catch (error) {
            set({ 
              error: 'Failed to load notifications',
              loading: false 
            })
          }
        },

        markAsRead: () => {
          set({ unreadCount: 0 })
        },

        clearNotifications: () => {
          set({ 
            unreadCount: 0,
            connectionRequests: [],
            error: null,
            lastFetchTime: null
          })
        },

        getUnreadCount: () => {
          return get().unreadCount
        }
      }),
      {
        name: 'notification-store',
        partialize: (state) => ({ 
          unreadCount: state.unreadCount,
          connectionRequests: state.connectionRequests,
          lastFetchTime: state.lastFetchTime
        }),
      }
    ),
    {
      name: 'notification-store'
    }
  )
)
