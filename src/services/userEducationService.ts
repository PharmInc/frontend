import { backgroundApiClient } from './apiClient';
import { CreateUserEducationRequest, UserEducation, UpdateUserEducationRequest } from '../types/api';

/**
 * User Education service for handling user education operations
 */
export class UserEducationService {
  /**
   * Add education to user profile
   * @param educationData - Education data
   * @returns Promise containing the created education record
   * @throws ApiError if creation fails
   */
  async createUserEducation(educationData: CreateUserEducationRequest): Promise<UserEducation> {
    return backgroundApiClient.post<UserEducation>('/private/education', educationData);
  }

  /**
   * Get education by ID (public endpoint)
   * @param id - Education ID
   * @returns Promise containing education data
   * @throws ApiError if education not found or request fails
   */
  async getUserEducationById(id: string): Promise<UserEducation> {
    return backgroundApiClient.get<UserEducation>(`/public/education/${id}`);
  }

  /**
   * Get all education records for a user (public endpoint)
   * @param userId - User ID
   * @returns Promise containing array of education data
   * @throws ApiError if request fails
   */
  async getUserEducationsByUserId(userId: string): Promise<UserEducation[]> {
    return backgroundApiClient.get<UserEducation[]>(`/public/education/user/${userId}`);
  }

  /**
   * Update education
   * @param id - Education ID
   * @param updateData - Data to update
   * @returns Promise containing updated education data
   * @throws ApiError if update fails
   */
  async updateUserEducation(id: string, updateData: UpdateUserEducationRequest): Promise<UserEducation> {
    return backgroundApiClient.put<UserEducation>(`/private/education/${id}`, updateData);
  }

  /**
   * Delete education
   * @param id - Education ID
   * @returns Promise that resolves when deletion is successful
   * @throws ApiError if deletion fails
   */
  async deleteUserEducation(id: string): Promise<void> {
    await backgroundApiClient.delete<void>(`/private/education/${id}`);
  }
}

export const userEducationService = new UserEducationService();
