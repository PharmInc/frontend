import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/app/(home)/home/_components/types'
import { getUser, getUserById } from '@/lib/api/services/user'

interface UserState {
  currentUser: User | null
  userCache: Record<string, User>
  loading: boolean
  error: string | null

  fetchCurrentUser: () => Promise<void>
  fetchUserById: (id: string) => Promise<User>
  clearUser: () => void
  setUser: (user: User) => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        currentUser: null,
        userCache: {},
        loading: false,
        error: null,

        fetchCurrentUser: async () => {
          set({ loading: true, error: null })
          try {
            const userData = await getUser()
            const transformedUser: User = {
              id: userData.id,
              name: userData.name,
              role: userData.role,
              speciality: userData.specialization,
              profilePicture: userData.profile_picture,
              location: userData.location,
            }
            
            set({ 
              currentUser: transformedUser,
              userCache: { 
                ...get().userCache, 
                [userData.id || '']: transformedUser 
              },
              loading: false 
            })
          } catch (error) {
            console.error('Error fetching current user:', error)
            set({ 
              currentUser: null,
              loading: false, 
              error: 'Failed to load user profile' 
            })
          }
        },

        fetchUserById: async (id: string): Promise<User> => {
          const { userCache } = get()
          
          // Return cached user if available
          if (userCache[id]) {
            return userCache[id]
          }

          try {
            const userData = await getUserById(id)
            const transformedUser: User = {
              id: userData.id,
              name: userData.name,
              role: userData.role,
              speciality: userData.specialization,
              profilePicture: userData.profile_picture,
              location: userData.location,
            }

            // Cache the user
            set({ 
              userCache: { 
                ...userCache, 
                [id]: transformedUser 
              }
            })

            return transformedUser
          } catch (error) {
            console.error(`Error fetching user ${id}:`, error)
            const fallbackUser: User = {
              id,
              name: "Unknown User",
              role: "Unknown Role",
              profilePicture: "/pp.png",
            }
            
            // Cache the fallback user to avoid repeated failed requests
            set({ 
              userCache: { 
                ...userCache, 
                [id]: fallbackUser 
              }
            })
            
            return fallbackUser
          }
        },

        clearUser: () => {
          set({ 
            currentUser: null, 
            userCache: {}, 
            error: null 
          })
        },

        setUser: (user: User) => {
          set({ 
            currentUser: user,
            userCache: { 
              ...get().userCache, 
              [user.id || '']: user 
            }
          })
        },
      }),
      {
        name: 'user-store',
        partialize: (state) => ({ 
          currentUser: state.currentUser,
          userCache: state.userCache 
        }),
      }
    ),
    { name: 'user-store' }
  )
)
