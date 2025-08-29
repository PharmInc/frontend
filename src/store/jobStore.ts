import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Job } from '@/lib/api/types'
import { listJobs, getJob } from '@/lib/api/services/job'
import { getInstitutionById } from '@/lib/api/services/institute'
import { Institution } from '@/lib/api/types'

interface JobWithInstitution extends Job {
  institution?: Institution
}

interface JobState {
  jobs: JobWithInstitution[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  currentPage: number
  hasMore: boolean
  totalPages: number
  totalJobs: number
  
  fetchJobs: (page?: number, limit?: number, append?: boolean) => Promise<void>
  fetchSingleJob: (jobId: string) => Promise<JobWithInstitution | null>
  loadMoreJobs: () => Promise<void>
  clearJobs: () => void
  setJobs: (jobs: JobWithInstitution[]) => void
}

export const useJobStore = create<JobState>()(
  devtools(
    (set, get) => ({
      jobs: [],
      loading: false,
      loadingMore: false,
      error: null,
      currentPage: 1,
      hasMore: true,
      totalPages: 0,
      totalJobs: 0,

      fetchJobs: async (page = 1, limit = 10, append = false) => {
        if (append) {
          set({ loadingMore: true, error: null })
        } else {
          set({ loading: true, error: null, jobs: [] })
        }

        try {
          const response = await listJobs(page, limit, undefined, true)
          
          // Fetch institution details for each job
          const jobsWithInstitutions = await Promise.all(
            response.data.map(async (job) => {
              try {
                const institution = await getInstitutionById(job.institute_id)
                return { ...job, institution }
              } catch (error) {
                console.error(`Failed to fetch institution for job ${job.id}:`, error)
                return job
              }
            })
          )

          if (append) {
            set((state) => ({
              jobs: [...state.jobs, ...jobsWithInstitutions],
              loadingMore: false,
              currentPage: page,
              hasMore: page < response.pagination.totalPages,
              totalPages: response.pagination.totalPages,
              totalJobs: response.pagination.total
            }))
          } else {
            set({
              jobs: jobsWithInstitutions,
              loading: false,
              currentPage: page,
              hasMore: page < response.pagination.totalPages,
              totalPages: response.pagination.totalPages,
              totalJobs: response.pagination.total
            })
          }
        } catch (error) {
          console.error('Failed to fetch jobs:', error)
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch jobs',
            loading: false,
            loadingMore: false
          })
        }
      },

      fetchSingleJob: async (jobId: string) => {
        try {
          const job = await getJob(jobId)
          const institution = await getInstitutionById(job.institute_id)
          return { ...job, institution }
        } catch (error) {
          console.error('Failed to fetch job:', error)
          return null
        }
      },

      loadMoreJobs: async () => {
        const { currentPage, hasMore, loadingMore } = get()
        if (!hasMore || loadingMore) return
        
        await get().fetchJobs(currentPage + 1, 10, true)
      },

      clearJobs: () => {
        set({
          jobs: [],
          loading: false,
          loadingMore: false,
          error: null,
          currentPage: 1,
          hasMore: true,
          totalPages: 0,
          totalJobs: 0
        })
      },

      setJobs: (jobs: JobWithInstitution[]) => {
        set({ jobs })
      }
    }),
    {
      name: 'job-store'
    }
  )
)
