import { userApiClient } from './apiClient';
import { CreateUserRequest, User, UpdateUserRequest } from '../types/api';
import { validate as isUuid } from 'uuid';

// Define the expected API response structure for user search
interface SearchUsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters: {
    query: string;
    name?: string;
    role?: string;
    location?: string;
  };
}

export class UserService {
  // Create user (authenticated)
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      return await userApiClient.post<User>('/private/user', userData);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  // Get current authenticated user
  async getCurrentUser(): Promise<User> {
    try {
      return await userApiClient.get<User>('/private/user');
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }

  // Update current authenticated user
  async updateCurrentUser(updateData: UpdateUserRequest): Promise<User> {
    try {
      return await userApiClient.put<User>('/private/user', updateData);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  // Delete current authenticated user
  async deleteCurrentUser(): Promise<void> {
    try {
      await userApiClient.delete<void>('/private/user');
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }

  // Get public user by ID
  async getUserById(id: string): Promise<User> {
    if (!isUuid(id)) {
      throw new Error('Invalid user ID: must be a valid UUID');
    }
    try {
      return await userApiClient.get<User>(`/public/user/${id}`, false);
    } catch (error) {
      console.error('Failed to get user by ID:', error);
      throw error;
    }
  }

  // List all public users
  async listUsers(): Promise<User[]> {
    try {
      return await userApiClient.get<User[]>('/public/users', false);
    } catch (error) {
      console.error('Failed to list users:', error);
      throw error;
    }
  }

  // Search public users
  async searchUsers(
    q: string,
    name?: string,
    location?: string,
    role?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    fields?: string
  ): Promise<SearchUsersResponse> {
    const params = new URLSearchParams();
    params.append('q', q);
    if (name) params.append('name', name);
    if (location) params.append('location', location);
    if (role) params.append('role', role);
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (fields) params.append('fields', fields);

    try {
      return await userApiClient.get<SearchUsersResponse>(
        `/public/user/search?${params.toString()}`,
        false
      );
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
