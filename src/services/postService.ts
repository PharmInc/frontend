import { contentApiClient } from './apiClient';
import { CreatePostRequest, Post, UpdatePostRequest } from '../types/api';

/**
 * Post service for handling post operations
 */
export class PostService {
  /**
   * Create a new post
   * @param postData - Post data
   * @returns Promise containing the created post
   */
  async createPost(postData: CreatePostRequest): Promise<Post> {
    return contentApiClient.post<Post>('/private/post', postData);
  }

  /**
   * Get post by ID
   * @param id - Post ID
   * @returns Promise containing post data
   */
  async getPostById(id: string): Promise<Post> {
    return contentApiClient.get<Post>(`/public/post/${id}`);
  }

  /**
   * Update post
   * @param id - Post ID
   * @param updateData - Data to update
   * @returns Promise containing updated post data
   */
  async updatePost(id: string, updateData: UpdatePostRequest): Promise<Post> {
    return contentApiClient.put<Post>(`/private/post/${id}`, updateData);
  }

  /**
   * Delete post
   * @param id - Post ID
   * @returns Promise that resolves when deletion is successful
   */
  async deletePost(id: string): Promise<void> {
    await contentApiClient.delete<void>(`/private/post/${id}`);
  }

  /**
   * Get all posts (public)
   * @returns Promise containing array of posts
   */
  async getAllPosts(): Promise<Post[]> {
    return contentApiClient.get<Post[]>('/public/post');
  }

  /**
   * Get all posts by a user (public)
   * @param userId - User ID
   * @returns Promise containing array of posts
   */
  async getPostsByUser(userId: string): Promise<Post[]> {
    return contentApiClient.get<Post[]>(`/public/post/user/${userId}`);
  }

  /**
   * Search posts (public)
   * @param query - Search query
   * @returns Promise containing array of posts
   */
  async searchPosts(query: string): Promise<Post[]> {
    return contentApiClient.get<Post[]>(`/public/post/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get trending posts (public)
   * @returns Promise containing array of trending posts
   */
  async getTrendingPosts(): Promise<Post[]> {
    return contentApiClient.get<Post[]>('/public/post/trending');
  }

  /**
   * Get popular posts (public)
   * @returns Promise containing array of popular posts
   */
  async getPopularPosts(): Promise<Post[]> {
    return contentApiClient.get<Post[]>('/public/post/popular');
  }
}

export const postService = new PostService();
