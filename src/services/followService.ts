import { networkApiClient } from './apiClient';
import { Follow, CreateFollowRequest, ApiError } from '../types/api';

/**
 * Follow service for handling follow operations
 */
export class FollowService {
  /**
   * Follow a user
   * @param followData - Follow data
   * @returns Promise containing the created follow relationship
   * @throws ApiError if creation fails
   */
  async followUser(followData: CreateFollowRequest): Promise<Follow> {
    return networkApiClient.post<Follow>('/private/follow', followData);
  }

  /**
   * Unfollow a user by follow relationship ID
   * @param id - Follow relationship ID
   * @returns Promise that resolves when unfollow is successful
   * @throws ApiError if deletion fails
   */
  async unfollowUser(id: string): Promise<void> {
    // The DELETE endpoint is /private/follow, so send the ID as a query param
    await networkApiClient.delete<void>(`/private/follow?id=${encodeURIComponent(id)}`);
  }

  /**
   * Get all followers for a user
   * @param userId - User ID
   * @returns Promise containing list of followers
   * @throws ApiError if request fails
   */
  async getFollowers(userId: string): Promise<Follow[]> {
    return networkApiClient.get<Follow[]>(`/public/follow/${userId}/followers`);
  }

  /**
   * Get all connections (followers/connections) for a user
   * @param userId - User ID
   * @returns Promise containing list of follower connections
   * @throws ApiError if request fails
   */
  async getConnections(userId: string): Promise<Follow[]> {
    return networkApiClient.get<Follow[]>(`/public/follow/${userId}/followers/c`);
  }
}

export const followService = new FollowService();
