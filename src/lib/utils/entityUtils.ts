import { useUserStore, useInstitutionStore } from '@/store'
import { getUserType } from '@/lib/api/utils'

export interface EntityData {
  id: string
  name: string
  profilePicture?: string
  location?: string
  verified?: boolean
  role?: string
  speciality?: string
  type?: string
  employees_count?: string
  area_of_expertise?: string
}

export function useCurrentEntity(): {
  currentEntity: EntityData | null
  isLoading: boolean
  userType: string | null
} {
  const { currentUser, loading: userLoading } = useUserStore()
  const { currentInstitution, loading: institutionLoading } = useInstitutionStore()
  const userType = getUserType()
  
  const isLoading = userLoading || institutionLoading
  
  const currentEntity = (() => {
    if (userType === 'institution' && currentInstitution && currentInstitution.id && currentInstitution.name) {
      return {
        id: currentInstitution.id,
        name: currentInstitution.name,
        profilePicture: currentInstitution.profile_picture,
        location: currentInstitution.location,
        verified: currentInstitution.verified,
        type: currentInstitution.type,
        employees_count: currentInstitution.employees_count,
        area_of_expertise: currentInstitution.area_of_expertise,
      }
    }
    
    if (currentUser && currentUser.id && currentUser.name) {
      return {
        id: currentUser.id,
        name: currentUser.name,
        profilePicture: currentUser.profilePicture,
        location: currentUser.location,
        role: currentUser.role,
        speciality: currentUser.speciality,
      }
    }
    
    return null
  })()
  
  return {
    currentEntity,
    isLoading,
    userType
  }
}

export function getCurrentEntity(): EntityData | null {
  const userType = getUserType()
  
  if (userType === 'institution') {
    const currentInstitution = useInstitutionStore.getState().currentInstitution
    if (currentInstitution && currentInstitution.id && currentInstitution.name) {
      return {
        id: currentInstitution.id,
        name: currentInstitution.name,
        profilePicture: currentInstitution.profile_picture,
        location: currentInstitution.location,
        verified: currentInstitution.verified,
        type: currentInstitution.type,
        employees_count: currentInstitution.employees_count,
        area_of_expertise: currentInstitution.area_of_expertise,
      }
    }
  } else {
    const currentUser = useUserStore.getState().currentUser
    if (currentUser && currentUser.id && currentUser.name) {
      return {
        id: currentUser.id,
        name: currentUser.name,
        profilePicture: currentUser.profilePicture,
        location: currentUser.location,
        role: currentUser.role,
        speciality: currentUser.speciality,
      }
    }
  }
  
  return null
}

export function getEntityFetchers() {
  const userType = getUserType()
  const { fetchCurrentUser } = useUserStore()
  const { fetchCurrentInstitution } = useInstitutionStore()
  
  if (userType === 'institution') {
    return { fetchEntity: fetchCurrentInstitution, entityType: 'institution' }
  }
  
  return { fetchEntity: fetchCurrentUser, entityType: 'user' }
}
