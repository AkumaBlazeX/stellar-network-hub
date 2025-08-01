import { User, Post } from '@/types';

interface CreatePostData {
  content: string;
  authorId: string;
  imageUrls?: string[];
}

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth headers
function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text() as unknown as T;
}

// User API
export const userAPI = {
  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<User>(response);
  },

  async updateUser(userId: string, userData: Partial<User>, token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ userId, ...userData }),
    });
    return handleResponse<User>(response);
  },

  async getUserById(userId: string, token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<User>(response);
  },
};

// Posts API
export const postAPI = {
  async getPosts(token: string): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Post[]>(response);
  },

  async createPost(postData: CreatePostData, token: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(postData),
    });
    return handleResponse<Post>(response);
  },

  async updatePost(postId: string, content: string, token: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ postId, content }),
    });
    return handleResponse<Post>(response);
  },

  async deletePost(postId: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ postId }),
    });
    return handleResponse<void>(response);
  },

  async likePost(postId: string, action: 'like' | 'unlike', token: string): Promise<{ likes: number }> {
    const response = await fetch(`${API_BASE_URL}/posts/like`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ postId, action }),
    });
    return handleResponse<{ likes: number }>(response);
  },
};

// Upload API
export const uploadAPI = {
  async uploadFile(file: File, token: string): Promise<{ fileUrl: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    return handleResponse<{ fileUrl: string; fileName: string }>(response);
  },
};