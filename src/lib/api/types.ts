// Auth types
export interface AuthParams {
  email: string;
  password: string;
  name?: string;
  type?: string;
}

export interface AuthResponse {
  token: string;
}

// User types
export interface User {
  id: string;
  name: string;
  location?: string;
  role: string;
  created_at: string;
  updated_at: string;
  email: string;
  verified?: boolean;
  profile_picture?: string;
  specialization?: string;
  banner_picture?: string;
  bio?: string;
  about?: string;
  followers?: number;
  connections?: number;
  isFollowing?: boolean;
  isConnected?: boolean;
  connectionStatus?: 'none' | 'pending_sent' | 'pending_received' | 'connected';
}

export interface UserCreateParams {
  name: string;
  location: string;
  role: string;
  specialization?: string;
}

export interface UserUpdateParams {
  name?: string;
  location?: string;
  role?: string;
  email?: string;
  verified?: boolean;
  profile_picture?: string;
  banner_picture?: string;
  bio?: string;
  about?: string;
  followers?: number;
  connections?: number;
  specialization?: string;
}

export interface UserSearchParams {
  page?: number;
  limit?: number;
  fields?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  name?: string;
  location?: string;
  role?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters?: Record<string, string>;
}

// Network types
export interface FollowParams {
  id2: string;
  id2_poster_type: "user" | "institute";
}

export interface Follow extends FollowParams {
  id: string;
  created_at: string;
  id1: string;
}

export interface ConnectParams {
  id2: string;
  id2_poster_type: "user" | "institute";
}

export interface Connect extends ConnectParams {
  id: string;
  created_at: string;
  id1: string;
  id2: string;
  accepted: boolean;
}

// Background types
export interface Education {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  user_id: string;
  institution_id: string;
  created_at: string;
  updated_at: string;
}

export interface EducationParams {
  title: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  institution_id: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  user_id: string;
  institution_id: string;
  created_at: string;
  updated_at: string;
}

export interface ExperienceParams {
  title: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  institution_id: string;
}

// Institute types
export interface Institution {
  id: string;
  name: string;
  location: string;
  type: string;
  created_at: string;
  updated_at: string;
  verified?: boolean;
  email?: string;
  employees_count?: string;
  area_of_expertise?: string;
  profile_picture?: string;
  banner_picture?: string;
  contact_email?: string;
  contact_number?: string;
  bio?: string;
  about?: string;
  followers?: number;
}

export interface InstitutionCreateParams {
  name: string;
  location: string;
  type: string;
}

export interface InstitutionUpdateParams {
  name?: string;
  location?: string;
  type?: string;
  verified?: boolean;
  email?: string;
  employees_count?: string;
  area_of_expertise?: string;
  profile_picture?: string;
  banner_picture?: string;
  contact_email?: string;
  contact_number?: string;
  bio?: string;
  about?: string;
  followers?: number;
}

export interface InstitutionSearchParams {
  name?: string;
  location?: string;
  type?: string;
  page?: number;
  limit?: number;
  fields?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Job types
export interface Job {
  id: string;
  title: string;
  description: string;
  pay_range: string;
  benefits: string;
  category: string;
  location: string;
  role: string;
  work_location: string;
  experience_level: string;
  institute_id: string;
  created_at: string;
  updated_at: string;
  active?: boolean;
}

export interface JobCreateParams {
  title: string;
  description: string;
  pay_range: string;
  benefits: string;
  category: string;
  location: string;
  role: string;
  work_location: string;
  experience_level: string;
}

export interface JobUpdateParams {
  title?: string;
  description?: string;
  pay_range?: string;
  benefits?: string;
  category?: string;
  location?: string;
  role?: string;
  work_location?: string;
  experience_level?: string;
  active?: boolean;
}

export interface JobSearchParams {
  title?: string;
  description?: string;
  pay_range?: string;
  benefits?: string;
  category?: string;
  location?: string;
  role?: string;
  work_location?: string;
  experience_level?: string;
  institute_id?: string;
  active?: boolean;
  page?: number;
  limit?: number;
  fields?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Content types
export interface Post {
  id: string;
  title: string;
  content: string;
  auth: string;
  created_at: string;
  updated_at: string;
  reactions?: number;
  shares?: number;
  saves?: number;
  attachment_id?: string;
  poster_type: string
}

export interface PostCreateParams {
  title: string;
  content: string;
  attachment_id?: string;
}

export interface PostUpdateParams {
  title?: string;
  content?: string;
  attachment_id?: string;
}

export interface PostSearchParams {
  q: string;
  auth?: string;
  minReactions?: number;
  maxReactions?: number;
  dateFrom?: string;
  dateTo?: string;
  hasAttachment?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Comment {
  id: string;
  content: string;
  auth: string;
  post_id: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  reactions?: number;
  shares?: number;
  saves?: number;
}

export interface CommentCreateParams {
  content: string;
  post_id: string;
  parent_id?: string;
}

export interface CommentUpdateParams {
  content: string;
}

export interface CommentSearchParams {
  q: string;
  auth?: string;
  post_id?: string;
  minReactions?: number;
  maxReactions?: number;
  dateFrom?: string;
  dateTo?: string;
  hasReplies?: boolean;
  isReply?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  created_at: string;
  updated_at: string;
  cover_letter?: string | null;
  resume_url?: string | null;
  portfolio_url?: string | null;
  status?: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  notes?: string | null;
  additional_info?: Record<string, unknown>;
  applied_at: string;
  reviewed_at?: string | null;
  responded_at?: string | null;
}

export interface ApplicationCreateParams {
  jobId: string;
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
  status?: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  notes?: string;
  additional_info?: Record<string, unknown>;
}

export interface ApplicationUpdateParams {
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
  status?: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  notes?: string;
  additional_info?: Record<string, unknown>;
  reviewed_at?: string;
  responded_at?: string;
}

export interface ReactionResponse {
  postId: string;
  reacted: boolean;
  totalReactions: number;
}

// Chat types
export interface ChatUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  verified?: boolean;
  online?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  senderUsername: string;
  recipientUsername: string;
  replyTo?: string;
  tempId?: string;
  sending?: boolean;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;
  lastSender: string;
}
