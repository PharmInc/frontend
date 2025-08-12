export interface BaseEntity {
  id?: string;
  name?: string;
  location?: string;
  profile_picture?: string;
}

export interface User extends BaseEntity {
  firstName?: string;
  lastName?: string;
  role?: string;
  specialization?: string;
  profilePicture?: string;
  speciality?: string;
  roles?: string[];
}

export interface InstitutionEntity extends BaseEntity {
  type?: string;
  verified?: boolean;
  employees_count?: string;
  area_of_expertise?: string;
}

export interface Post {
  id: number | string;
  author: string;
  avatar: string;
  role: string;
  time: string;
  title?: string;
  content: string;
  image?: string;
  attachments?: FileAttachment[];
  tags?: string[];
  type: "Research Paper" | "Case Study";
  likes: number;
  comments: number;
  shares: number;
}

export interface FileAttachment {
  id: string;
  filename: string;
  size: number;
  content_type: string;
  url: string;
  type: 'image' | 'document' | 'video' | 'other';
  extension?: string;
}
