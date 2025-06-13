import { apiClient } from './apiClient';
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
   * 
   * @example
   * ```
   * try {
   *   const education = await userEducationService.createUserEducation({
   *     title: 'Doctor of Medicine',
   *     description: 'MD program with focus on internal medicine',
   *     startDate: '2020-09-01',
   *     endDate: '2024-05-31',
   *     institutionId: '789'
   *   });
   *   console.log('Education added:', education);
   * } catch (error) {
   *   console.error('Education creation failed:', error.message);
   * }
   * ```
   */
  async createUserEducation(educationData: CreateUserEducationRequest): Promise<UserEducation> {
    return apiClient.post<UserEducation>('/user/education', educationData);
  }

  /**
   * Get education by ID
   * @param id - Education ID
   * @returns Promise containing education data
   * @throws ApiError if education not found or request fails
   */
  async getUserEducationById(id: string): Promise<UserEducation> {
    // If your backend supports public GETs, use `/public/user/education/${id}`
    // If not, use `/private/user/education/${id}`
    // Check your API docs: if education is only accessible to the user or admins, use private
    return apiClient.get<UserEducation>(`/user/education/${id}`);
  }

  /**
   * Update education
   * @param id - Education ID
   * @param updateData - Data to update
   * @returns Promise containing updated education data
   * @throws ApiError if update fails
   */
  async updateUserEducation(id: string, updateData: UpdateUserEducationRequest): Promise<UserEducation> {
    return apiClient.put<UserEducation>(`/user/education/${id}`, updateData);
  }

  /**
   * Delete education
   * @param id - Education ID
   * @returns Promise that resolves when deletion is successful
   * @throws ApiError if deletion fails
   */
  async deleteUserEducation(id: string): Promise<void> {
    await apiClient.delete<void>(`/user/education/${id}`);
  }
}

export const userEducationService = new UserEducationService();
