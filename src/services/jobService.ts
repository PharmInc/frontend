// import { jobApiClient } from './apiClient';

// // Define relevant types for jobs and applications (add as needed)
// export interface Job {
//   id?: string;
//   title: string;
//   description?: string;
//   location?: string;
//   category?: string;
//   // Add more fields as per your API spec
// }

// export interface JobApplication {
//   id?: string;
//   jobId: string;
//   // Add more fields as per your API spec
// }

// /**
//  * Job service for handling jobs and job applications
//  */
// export class JobService {
//   /**
//    * Create a new job
//    */
//   async createJob(jobData: Job): Promise<Job> {
//     try {
//       const response = await jobApiClient.post<Job>('/private/job', jobData);
//       return response;
//     } catch (error: any) {
//       throw new Error(error?.message || 'Failed to create job');
//     }
//   }

//   /**
//    * Update an existing job
//    */
//   async updateJob(id: string, jobData: Job): Promise<Job> {
//     try {
//       const response = await jobApiClient.put<Job>(`/private/job/${id}`, jobData);
//       return response;
//     } catch (error: any) {
//       throw new Error(error?.message || 'Failed to update job');
//     }
//   }

//   /**
//    * Delete a job by ID
//    */
//   async deleteJob(id: string): Promise<void> {
//     try {
//       await jobApiClient.delete(`/private/job/${id}`);
//     } catch (error: any) {
//       throw new Error(error?.message || 'Failed to delete job');
//     }
//   }

//   /**
//    * Get my jobs (for current authenticated user)
//    */
//   async getMyJobs(): Promise<Job[]> {
//     try {
//       const response = await jobApiClient.get<Job[]>('/private/job/my');
//       return response;
//     } catch (error: any) {
//       throw new Error(error?.message || 'Failed to fetch my jobs');
//     }
//   }

//   /**
//    * Get all public jobs
//    */
//   async getAllJobs(): Promise<Job[]> {
//     try {
//       const response = await jobApiClient.get<Job[]>('/public/job');
//       return response;
//     } catch (error: any) {
//       throw new Error(error?.message || 'Failed to fetch all jobs');
//     }
//   }

//   /**
//    * Get a job by ID
//    */
//   async getJobById(id: string): Promise<Job> {
//     try {
//       const response = await jobApiClient.get<Job>(`/public/job/${id}`);
//       return response;
//     } catch (error: any) {
//       throw new Error(error?.message || 'Failed to fetch job');
//     }
//   }

//   /**
//    * Search jobs by query
//    */
//   async searchJobs(query: string): Promise<Job[]> {
//     try {
//       const response = await jobApiClient.get<Job[]>(`/public/job/search?query=${encodeURIComponent(query)}`);
//       return response;
//     } catch (error: any) {
//       throw new Error(error?.message || 'Failed to search jobs');
//     }
//   }

//   /**
//    * Get jobs by category
//    */
//   async getJobsByCategory(category: string): Promise<Job[]> {
//     try {
//       const response = await jobApiClient.get<Job[]>(`/public/job/category/${category}`);
//       return response;
//     } catch (error: any) {
//       throw new Error(error?.message || 'Failed to fetch jobs by category');
//     }
//   }

//   /**
//    * Get jobs by location
//    */
//   async getJobsByLocation(location: string): Promise<Job[]> {
//     try {
//       const response = await jobApiClient.get<Job[]>(`/public/job/location/${location}`);
//       return response;
//     } catch (error: any) {
//       throw new Error(error?.message || 'Failed to fetch jobs by location');
//     }
//   }

//   /**
//    * Apply to a job
//    */
//   async applyToJob(jobId: string, applicationData?: any): Promise<JobApplication> {
//     try {
//       const response = await jobApiClient.post<JobApplication>(`/private/job/${jobId}/apply`, applicationData);
//       return response;
//     } catch (error: any) {
//       throw new Error(error?.message || 'Failed to apply to job');
//     }
//   }
// }

// export const jobService = new JobService();
