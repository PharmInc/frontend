import { apiClient } from './apiClient';
import { CreateUserExperienceRequest, UserExperience, UpdateUserExperienceRequest } from '../types/api';

export class UserExperienceService {
  /**
   * Add experience to user profile
   * @param experienceData - Experience data
   * @returns Promise containing the created experience record
   * @throws ApiError if creation fails
   */
  async createUserExperience(experienceData: CreateUserExperienceRequest): Promise<UserExperience> {
    return apiClient.post<UserExperience>('/user/experience', experienceData);
  }

  /**
   * Get experience by ID
   * @param id - Experience ID
   * @returns Promise containing experience data
   * @throws ApiError if experience not found or request fails
   */
  async getUserExperienceById(id: string): Promise<UserExperience> {
    // Use the endpoint as per your API docs (with a hyphen)
    return apiClient.get<UserExperience>(`/user-experience/${id}`);
  }

  /**
   * Update experience
   * @param id - Experience ID
   * @param updateData - Data to update
   * @returns Promise containing updated experience data
   * @throws ApiError if update fails
   */
  async updateUserExperience(id: string, updateData: UpdateUserExperienceRequest): Promise<UserExperience> {
    // Check with your backend: is this /private/user/experience/{id} or /private/user-experience/{id}?
    // If slash:
    return apiClient.put<UserExperience>(`/user/experience/${id}`, updateData);
   
  }

  /**
   * Delete experience
   * @param id - Experience ID
   * @returns Promise that resolves when deletion is successful
   * @throws ApiError if deletion fails
   */
  async deleteUserExperience(id: string): Promise<void> {
    
    await apiClient.delete<void>(`/user/experience/${id}`);
    // If hyphen:
    // await apiClient.delete<void>(`/private/user-experience/${id}`);
  }

  // (Optional) If you want to fetch all experiences (public)
  async getAllUserExperiences(): Promise<UserExperience[]> {
    return apiClient.get<UserExperience[]>(`/user/experience`);
  }
}

export const userExperienceService = new UserExperienceService();
