// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
  type?: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  type?: string;
}

// User types
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  specialization: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  about?: string;
  location?: string;
  interests?: string;
  profilePicture?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  specialization?: string;
}

// Post types
export interface CreatePostRequest {
  content: string;
  userId: string;
}

export interface Post {
  id: string;
  content: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdatePostRequest {
  content?: string;
}

// Tag types
export interface CreateTagRequest {
  tag: string;
}

export interface Tag {
  id: string;
  tag: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateTagRequest {
  tag?: string;
}

// Comment types
export interface CreateCommentRequest {
  content: string;
  postId: string;
  parentId?: string;
  userId: string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  parentId?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCommentRequest {
  content?: string;
}

// Institution types
export interface CreateInstitutionRequest {
  name: string;
  type: string;
  location: string;
}

export interface Institution {
  id: string;
  name: string;
  about: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateInstitutionRequest {
  name?: string;
  about?: string;
  location?: string;
}

// User Education types
export interface CreateUserEducationRequest {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  institutionId: string;
}

export interface UserEducation {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  institutionId: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserEducationRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  institutionId?: string;
}

// User Experience types
export interface CreateUserExperienceRequest {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  institutionId: string;
}

export interface UserExperience {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  institutionId: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserExperienceRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  institutionId?: string;
}

// Post Tag types
export interface CreatePostTagRequest {
  postId: string;
  tagId: string;
}

export interface PostTag {
  id: string;
  postId: string;
  tagId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdatePostTagRequest {
  postId?: string;
  tagId?: string;
}

// User Tag types
export interface CreateUserTagRequest {
  userId: string;
  tagId: string;
}

export interface UserTag {
  id: string;
  userId: string;
  tagId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserTagRequest {
  userId?: string;
  tagId?: string;
}

// Connection types
export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateConnectionRequest {
  receiverId: string; // The user to whom the connection is sent
}

export interface AcceptConnectionRequest {
  connectionId: string;
}

// Follow types
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFollowRequest {
  followingId: string; // The user to follow
}

// Job types
export interface Job {
  id: string;
  title: string;
  description: string;
  payRange: string;
  benefits?: string;
  category: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  instituteId: string;
  instituteName?: string;
  institute2Location?: string;
}

export interface CreateJobRequest {
  title: string;
  description?: string;
  payRange?: string;
  benefits?: string;
  category: string;
  location: string;
  instituteId: string;
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  payRange?: string;
  benefits?: string;
  category?: string;
  location?: string;
  instituteId?: string;
}

// Job search and filter types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchFilters {
  category?: string;
  location?: string;
  instituteId?: string;
  minPay?: string;
  maxPay?: string;
}

export interface SearchJobsResponse {
  data: Job[];
  search2Term?: string;
  pagination: Pagination;
  filters: SearchFilters;
}

// Job application types
export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status?: 'pending' | 'accepted' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobApplicationRequest {
  jobId: string;
  userId: string;
}

// API Error type
export interface ApiError {
  message: string;
  status: number;
  details?: any;
}
