export interface Post {
  id: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    username: string;
    profilePicture?: string;
    headline?: string;
  };
  content: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    username: string;
    profilePicture?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  headline?: string;
  profilePicture?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  connections: number;
  posts: number;
  createdAt: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

// AWS Integration Types (for future implementation)
export interface AWSConfig {
  region: string;
  userPoolId: string;
  userPoolClientId: string;
  apiGatewayUrl: string;
  s3BucketName: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}