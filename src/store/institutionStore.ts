import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Institution } from '@/lib/api/types'
import { getInstitution, getInstitutionById } from '@/lib/api/services/institute'

interface InstitutionState {
  currentInstitution: Institution | null
  institutionCache: Record<string, Institution>
  loading: boolean
  error: string | null

  fetchCurrentInstitution: () => Promise<void>
  fetchInstitutionById: (id: string) => Promise<Institution>
  clearInstitution: () => void
  setInstitution: (institution: Institution) => void
}

export const useInstitutionStore = create<InstitutionState>()(
  devtools(
    persist(
      (set, get) => ({
        currentInstitution: null,
        institutionCache: {},
        loading: false,
        error: null,

        fetchCurrentInstitution: async () => {
          set({ loading: true, error: null })
          try {
            const institutionData = await getInstitution()
            
            set({ 
              currentInstitution: institutionData,
              institutionCache: { 
                ...get().institutionCache, 
                [institutionData.id || '']: institutionData 
              },
              loading: false 
            })
          } catch (error) {
            console.error('Error fetching current institution:', error)
            set({ 
              currentInstitution: null,
              loading: false, 
              error: 'Failed to load institution profile' 
            })
          }
        },

        fetchInstitutionById: async (id: string): Promise<Institution> => {
          const { institutionCache } = get()
          
          // Return cached institution if available
          if (institutionCache[id]) {
            return institutionCache[id]
          }

          try {
            const institutionData = await getInstitutionById(id)

            // Cache the institution
            set({ 
              institutionCache: { 
                ...institutionCache, 
                [id]: institutionData 
              }
            })

            return institutionData
          } catch (error) {
            console.error(`Error fetching institution ${id}:`, error)
            const fallbackInstitution: Institution = {
              id,
              name: "Unknown Institution",
              location: "Unknown Location",
              type: "Unknown Type",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            
            set({ 
              institutionCache: { 
                ...institutionCache, 
                [id]: fallbackInstitution 
              }
            })
            
            return fallbackInstitution
          }
        },

        clearInstitution: () => {
          set({ 
            currentInstitution: null, 
            institutionCache: {}, 
            error: null 
          })
        },

        setInstitution: (institution: Institution) => {
          set({ 
            currentInstitution: institution,
            institutionCache: { 
              ...get().institutionCache, 
              [institution.id || '']: institution 
            }
          })
        },
      }),
      {
        name: 'institution-store',
        partialize: (state) => ({ 
          currentInstitution: state.currentInstitution,
          institutionCache: state.institutionCache 
        }),
      }
    ),
    { name: 'institution-store' }
  )
)
