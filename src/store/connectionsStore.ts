import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Connect } from '@/lib/api/types'
import { 
  getUserConnections, 
  connectUser, 
  disconnectUser, 
  acceptConnection 
} from '@/lib/api/services/network'

export type ConnectionStatus = 'connected' | 'pending_sent' | 'pending_received' | 'none'

interface ConnectionsState {
  connections: Connect[]
  connectionStatusMap: Record<string, ConnectionStatus>
  loading: boolean
  error: string | null

  // Actions
  fetchConnections: (userId: string) => Promise<void>
  getConnectionStatus: (currentUserId: string, targetUserId: string) => ConnectionStatus
  connectToUser: (currentUserId: string, targetUserId: string) => Promise<void>
  disconnectFromUser: (currentUserId: string, targetUserId: string) => Promise<void>
  acceptConnectionRequest: (currentUserId: string, requesterId: string) => Promise<void>
  rejectConnectionRequest: (currentUserId: string, requesterId: string) => Promise<void>
  clearConnections: () => void
}

export const useConnectionsStore = create<ConnectionsState>()(
  devtools(
    persist(
      (set, get) => ({
        connections: [],
        connectionStatusMap: {},
        loading: false,
        error: null,

        fetchConnections: async (userId: string) => {
          set({ loading: true, error: null })
          try {
            const connections = await getUserConnections(userId)
            const connectionStatusMap: Record<string, ConnectionStatus> = {}

            // Build status map for quick lookup
            connections.forEach(conn => {
              const otherUserId = conn.user1_id === userId ? conn.user2_id : conn.user1_id
              
              if (conn.accepted) {
                connectionStatusMap[otherUserId] = 'connected'
              } else {
                // If current user is user1, they sent the request
                // If current user is user2, they received the request
                connectionStatusMap[otherUserId] = conn.user1_id === userId 
                  ? 'pending_sent' 
                  : 'pending_received'
              }
            })

            set({ 
              connections,
              connectionStatusMap,
              loading: false 
            })
          } catch (error) {
            console.error('Error fetching connections:', error)
            set({ 
              error: 'Failed to load connections',
              loading: false 
            })
          }
        },

        getConnectionStatus: (currentUserId: string, targetUserId: string): ConnectionStatus => {
          if (currentUserId === targetUserId) return 'none'
          const { connectionStatusMap } = get()
          
          // If we don't have the status in our map, return 'none' but optionally trigger a fetch
          if (!connectionStatusMap[targetUserId]) {
            // Optionally fetch connections in the background if we don't have them
            const { connections } = get()
            if (connections.length === 0) {
              // Don't await here to avoid blocking the UI
              get().fetchConnections(currentUserId).catch(console.error)
            }
            return 'none'
          }
          
          return connectionStatusMap[targetUserId]
        },

        connectToUser: async (currentUserId: string, targetUserId: string) => {
          try {
            const connection = await connectUser({ user2_id: targetUserId })
            
            // Update local state
            const { connections, connectionStatusMap } = get()
            const newConnections = [...connections, connection]
            const newStatusMap = {
              ...connectionStatusMap,
              [targetUserId]: 'pending_sent' as ConnectionStatus
            }

            set({
              connections: newConnections,
              connectionStatusMap: newStatusMap
            })
          } catch (error) {
            console.error('Error connecting to user:', error)
            throw error
          }
        },

        disconnectFromUser: async (currentUserId: string, targetUserId: string) => {
          try {
            await disconnectUser({ user2_id: targetUserId })
            
            // Update local state
            const { connections, connectionStatusMap } = get()
            const newConnections = connections.filter(conn => {
              const otherUserId = conn.user1_id === currentUserId ? conn.user2_id : conn.user1_id
              return otherUserId !== targetUserId
            })
            
            const newStatusMap = { ...connectionStatusMap }
            delete newStatusMap[targetUserId]

            set({
              connections: newConnections,
              connectionStatusMap: newStatusMap
            })
          } catch (error) {
            console.error('Error disconnecting from user:', error)
            throw error
          }
        },

        acceptConnectionRequest: async (currentUserId: string, requesterId: string) => {
          try {
            const updatedConnection = await acceptConnection(requesterId)
            
            // Update local state
            const { connections, connectionStatusMap } = get()
            const newConnections = connections.map(conn => {
              if ((conn.user1_id === requesterId && conn.user2_id === currentUserId) ||
                  (conn.user1_id === currentUserId && conn.user2_id === requesterId)) {
                return { ...conn, accepted: true }
              }
              return conn
            })
            
            const newStatusMap = {
              ...connectionStatusMap,
              [requesterId]: 'connected' as ConnectionStatus
            }

            set({
              connections: newConnections,
              connectionStatusMap: newStatusMap
            })
          } catch (error) {
            console.error('Error accepting connection request:', error)
            throw error
          }
        },

        rejectConnectionRequest: async (currentUserId: string, requesterId: string) => {
          try {
            await disconnectUser({ user2_id: requesterId })
            
            // Update local state
            const { connections, connectionStatusMap } = get()
            const newConnections = connections.filter(conn => {
              return !((conn.user1_id === requesterId && conn.user2_id === currentUserId) ||
                      (conn.user1_id === currentUserId && conn.user2_id === requesterId))
            })
            
            const newStatusMap = { ...connectionStatusMap }
            delete newStatusMap[requesterId]

            set({
              connections: newConnections,
              connectionStatusMap: newStatusMap
            })
          } catch (error) {
            console.error('Error rejecting connection request:', error)
            throw error
          }
        },

        clearConnections: () => {
          set({ 
            connections: [],
            connectionStatusMap: {},
            error: null 
          })
        },
      }),
      {
        name: 'connections-store',
        partialize: (state) => ({ 
          connections: state.connections,
          connectionStatusMap: state.connectionStatusMap 
        }),
      }
    ),
    { name: 'connections-store' }
  )
)
