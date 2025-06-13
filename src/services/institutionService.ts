import { apiClient } from './apiClient';
import { CreateInstitutionRequest, Institution, UpdateInstitutionRequest } from '../types/api';

/**
 * Institution service for handling institution operations
 */
export class InstitutionService {
  /**
   * Create a new institution
   * @param institutionData - Institution data
   * @returns Promise containing the created institution
   * @throws ApiError if creation fails
   * 
   * @example
   * ```
   * try {
   *   const institution = await institutionService.createInstitution({
   *     name: 'Harvard Medical School',
   *     about: 'Leading medical institution',
   *     location: 'Boston, MA'
   *   });
   *   console.log('Institution created:', institution);
   * } catch (error) {
   *   console.error('Institution creation failed:', error.message);
   * }
   * ```
   */
  async createInstitution(institutionData: CreateInstitutionRequest): Promise<Institution> {
    return apiClient.post<Institution>('/institution', institutionData);
  }

  /**
   * Get institution by ID
   * @param id - Institution ID
   * @returns Promise containing institution data
   * @throws ApiError if institution not found or request fails
   */
  async getInstitutionById(id: string): Promise<Institution> {
    return apiClient.get<Institution>(`/institution/${id}`);
  }

  /**
   * Update institution
   * @param id - Institution ID
   * @param updateData - Data to update
   * @returns Promise containing updated institution data
   * @throws ApiError if update fails
   */
  async updateInstitution(id: string, updateData: UpdateInstitutionRequest): Promise<Institution> {
    return apiClient.put<Institution>(`/institution/${id}`, updateData);
  }

  /**
   * Delete institution
   * @param id - Institution ID
   * @returns Promise that resolves when deletion is successful
   * @throws ApiError if deletion fails
   */
  async deleteInstitution(id: string): Promise<void> {
    await apiClient.delete<void>(`/institution/${id}`);
  }
}

export const institutionService = new InstitutionService();
