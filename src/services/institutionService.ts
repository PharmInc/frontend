import { instituteApiClient } from './apiClient';
import { CreateInstitutionRequest, Institution, UpdateInstitutionRequest } from '../types/api';

/**
 * Institution service for handling institution operations
 */
export class InstitutionService {
  /**
   * Create a new institution (private endpoint)
   */
  async createInstitution(institutionData: CreateInstitutionRequest): Promise<Institution> {
    return instituteApiClient.post<Institution>('/private/institution', institutionData);
  }

  /**
   * Get institution by ID (public endpoint)
   */
  async getInstitutionById(id: string): Promise<Institution> {
    return instituteApiClient.get<Institution>(`/public/institution/${id}`);
  }

  /**
   * Update institution (private endpoint)
   * Note: The API spec shows PUT to /private/institution, so the ID may be in the body or as a query param.
   * Here, we send the ID inside the updateData object.
   */
  async updateInstitution(updateData: UpdateInstitutionRequest & { id: string }): Promise<Institution> {
    return instituteApiClient.put<Institution>('/private/institution', updateData);
  }

  /**
   * Delete institution (private endpoint)
   * Note: The API spec shows DELETE to /private/institution, so the ID may be in the body or as a query param.
   * Here, we send the ID as a query parameter.
   */
  async deleteInstitution(id: string): Promise<void> {
    await instituteApiClient.delete<void>(`/private/institution?id=${encodeURIComponent(id)}`);
  }

  /**
   * Search institutions (public endpoint)
   */
  async searchInstitutions(query: string): Promise<Institution[]> {
    return instituteApiClient.get<Institution[]>(`/public/institution/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get all institutions (public endpoint)
   */
  async getAllInstitutions(): Promise<Institution[]> {
    return instituteApiClient.get<Institution[]>('/public/institution');
  }
}

export const institutionService = new InstitutionService();
