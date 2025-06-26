
// import { apiClient } from './apiClient';
// import { CreateTagRequest, Tag, UpdateTagRequest } from '../types/api';

// /**
//  * Tag service for handling tag operations
//  */
// export class TagService {
//   /**
//    * Create a new tag
//    * @param tagData - Tag data
//    * @returns Promise containing the created tag
//    * @throws ApiError if creation fails
//    * 
//    * @example
//    * ```typescript
//    * try {
//    *   const tag = await tagService.createTag({
//    *     tag: 'medical-research'
//    *   });
//    *   console.log('Tag created:', tag);
//    * } catch (error) {
//    *   console.error('Tag creation failed:', error.message);
//    * }
//    * ```
//    */
//   async createTag(tagData: CreateTagRequest): Promise<Tag> {
//     return apiClient.post<Tag>('/tag', tagData);
//   }

//   /**
//    * Get tag by ID
//    * @param id - Tag ID
//    * @returns Promise containing tag data
//    * @throws ApiError if tag not found or request fails
//    */
//   async getTagById(id: string): Promise<Tag> {
//     return apiClient.get<Tag>(`/tag/${id}`);
//   }

//   /**
//    * Update tag
//    * @param id - Tag ID
//    * @param updateData - Data to update
//    * @returns Promise containing updated tag data
//    * @throws ApiError if update fails
//    */
//   async updateTag(id: string, updateData: UpdateTagRequest): Promise<Tag> {
//     return apiClient.put<Tag>(`/tag/${id}`, updateData);
//   }

//   /**
//    * Delete tag
//    * @param id - Tag ID
//    * @returns Promise that resolves when deletion is successful
//    * @throws ApiError if deletion fails
//    */
//   async deleteTag(id: string): Promise<void> {
//     await apiClient.delete<void>(`/tag/${id}`);
//   }
// }

// export const tagService = new TagService();
