
// import { apiClient } from './apiClient';
// import { CreatePostTagRequest, PostTag, UpdatePostTagRequest } from '../types/api';

// /**
//  * Post Tag service for handling post-tag relationship operations
//  */
// export class PostTagService {
//   /**
//    * Link a post and tag
//    * @param postTagData - Post-tag relationship data
//    * @returns Promise containing the created post-tag relationship
//    * @throws ApiError if creation fails
//    * 
//    * @example
//    * ```typescript
//    * try {
//    *   const postTag = await postTagService.createPostTag({
//    *     postId: '456',
//    *     tagId: '789'
//    *   });
//    *   console.log('Post-tag relationship created:', postTag);
//    * } catch (error) {
//    *   console.error('Post-tag creation failed:', error.message);
//    * }
//    * ```
//    */
//   async createPostTag(postTagData: CreatePostTagRequest): Promise<PostTag> {
//     return apiClient.post<PostTag>('/post/tag', postTagData);
//   }

//   /**
//    * Get post-tag relationship by ID
//    * @param id - Post-tag relationship ID
//    * @returns Promise containing post-tag relationship data
//    * @throws ApiError if relationship not found or request fails
//    */
//   async getPostTagById(id: string): Promise<PostTag> {
//     return apiClient.get<PostTag>(`/post/tag/${id}`);
//   }

//   /**
//    * Update post-tag relationship
//    * @param id - Post-tag relationship ID
//    * @param updateData - Data to update
//    * @returns Promise containing updated post-tag relationship data
//    * @throws ApiError if update fails
//    */
//   async updatePostTag(id: string, updateData: UpdatePostTagRequest): Promise<PostTag> {
//     return apiClient.put<PostTag>(`/post/tag/${id}`, updateData);
//   }

//   /**
//    * Delete post-tag relationship
//    * @param id - Post-tag relationship ID
//    * @returns Promise that resolves when deletion is successful
//    * @throws ApiError if deletion fails
//    */
//   async deletePostTag(id: string): Promise<void> {
//     await apiClient.delete<void>(`/post/tag/${id}`);
//   }
// }

// export const postTagService = new PostTagService();
