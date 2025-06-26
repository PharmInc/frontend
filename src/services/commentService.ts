import { contentApiClient } from './apiClient';
import { CreateCommentRequest, Comment, UpdateCommentRequest } from '../types/api';

/**
 * Comment service for handling comment operations
 */
export class CommentService {
  /**
   * Create a new comment
   * @param commentData - Comment data
   * @returns Promise containing the created comment
   * @throws ApiError if creation fails
   */
  async createComment(commentData: CreateCommentRequest): Promise<Comment> {
    return contentApiClient.post<Comment>('/private/comment', commentData);
  }

  /**
   * Get comment by ID
   * @param id - Comment ID
   * @returns Promise containing comment data
   * @throws ApiError if comment not found or request fails
   */
  async getCommentById(id: string): Promise<Comment> {
    return contentApiClient.get<Comment>(`/public/comment/${id}`);
  }

  /**
   * Update comment
   * @param id - Comment ID
   * @param updateData - Data to update
   * @returns Promise containing updated comment data
   * @throws ApiError if update fails
   */
  async updateComment(id: string, updateData: UpdateCommentRequest): Promise<Comment> {
    return contentApiClient.put<Comment>(`/private/comment/${id}`, updateData);
  }

  /**
   * Delete comment
   * @param id - Comment ID
   * @returns Promise that resolves when deletion is successful
   * @throws ApiError if deletion fails
   */
  async deleteComment(id: string): Promise<void> {
    await contentApiClient.delete<void>(`/private/comment/${id}`);
  }

  /**
   * Reply to a comment
   * @param parentId - Parent comment ID
   * @param commentData - Reply data
   * @returns Promise containing the created reply comment
   */
  async replyToComment(parentId: string, commentData: CreateCommentRequest): Promise<Comment> {
    return contentApiClient.post<Comment>(`/private/comment/${parentId}/reply`, commentData);
  }

  /**
   * Get all comments
   * @returns Promise containing array of comments
   */
  async getAllComments(): Promise<Comment[]> {
    return contentApiClient.get<Comment[]>('/public/comment');
  }

  /**
   * Get all comments for a post
   * @param postId - Post ID
   * @returns Promise containing array of comments
   */
  async getCommentsByPost(postId: string): Promise<Comment[]> {
    return contentApiClient.get<Comment[]>(`/public/comment/post/${postId}`);
  }

  /**
   * Get all comments by a user
   * @param userId - User ID
   * @returns Promise containing array of comments
   */
  async getCommentsByUser(userId: string): Promise<Comment[]> {
    return contentApiClient.get<Comment[]>(`/public/comment/user/${userId}`);
  }

  /**
   * Get replies to a comment
   * @param commentId - Comment ID
   * @returns Promise containing array of replies
   */
  async getReplies(commentId: string): Promise<Comment[]> {
    return contentApiClient.get<Comment[]>(`/public/comment/${commentId}/replies`);
  }

  /**
   * Search comments
   * @param query - Search query
   * @returns Promise containing array of comments
   */
  async searchComments(query: string): Promise<Comment[]> {
    return contentApiClient.get<Comment[]>(`/public/comment/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get comment thread
   * @param commentId - Comment ID
   * @returns Promise containing array of comments in the thread
   */
  async getCommentThread(commentId: string): Promise<Comment[]> {
    return contentApiClient.get<Comment[]>(`/public/comment/${commentId}/thread`);
  }
}

export const commentService = new CommentService();
