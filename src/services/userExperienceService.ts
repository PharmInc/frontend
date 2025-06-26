import { backgroundApiClient } from './apiClient';
import { CreateUserExperienceRequest, UserExperience, UpdateUserExperienceRequest } from '../types/api';

export class UserExperienceService {
  /**
   * Add experience to user profile
   * @param experienceData - Experience data
   * @returns Promise containing the created experience record
   * @throws ApiError if creation fails
   */
  async createUserExperience(experienceData: CreateUserExperienceRequest): Promise<UserExperience> {
    return backgroundApiClient.post<UserExperience>('/private/experience', experienceData);
  }

  /**
   * Get experience by ID (public endpoint)
   * @param id - Experience ID
   * @returns Promise containing experience data
   * @throws ApiError if experience not found or request fails
   */
  async getUserExperienceById(id: string): Promise<UserExperience> {
    return backgroundApiClient.get<UserExperience>(`/public/experience/${id}`);
  }

  /**
   * Get all experiences for a user (public endpoint)
   * @param userId - User ID
   * @returns Promise containing array of experiences
   * @throws ApiError if request fails
   */
  async getUserExperiencesByUserId(userId: string): Promise<UserExperience[]> {
    return backgroundApiClient.get<UserExperience[]>(`/public/experience/user/${userId}`);
  }

  /**
   * Update experience
   * @param id - Experience ID
   * @param updateData - Data to update
   * @returns Promise containing updated experience data
   * @throws ApiError if update fails
   */
  async updateUserExperience(id: string, updateData: UpdateUserExperienceRequest): Promise<UserExperience> {
    return backgroundApiClient.put<UserExperience>(`/private/experience/${id}`, updateData);
  }

  /**
   * Delete experience
   * @param id - Experience ID
   * @returns Promise that resolves when deletion is successful
   * @throws ApiError if deletion fails
   */
  async deleteUserExperience(id: string): Promise<void> {
    await backgroundApiClient.delete<void>(`/private/experience/${id}`);
  }
}

export const userExperienceService = new UserExperienceService();
