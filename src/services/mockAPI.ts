import { User, Post, Connection } from '../types';

// API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : null;
};

// Generic API call function
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`🌐 API Call: ${config.method || 'GET'} ${url}`);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Response:`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Error:`, error);
    throw error;
  }
};

// User API calls
export const userAPI = {
  // Get user profile
  getUser: async (userId: string): Promise<User> => {
    try {
      console.log('🌐 Attempting to fetch user from AWS API...');
      const response = await apiCall(`/users/${userId}`);
      return response.data || response;
    } catch (error) {
      console.error('❌ Error fetching user from API:', error);
      console.log('🔄 Using fallback user data');
      // Fallback to mock data for development
      return {
        id: userId,
        email: 'john@example.com',
        username: 'john_doe',
        fullName: 'John Doe',
        profilePicture: '',
        bio: 'Software Developer',
        location: 'New York',
        website: 'https://johndoe.com',
        connections: 150,
        posts: 25,
        createdAt: '2024-01-15T10:00:00Z',
      };
    }
  },

  // Update user profile
  updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
    try {
      console.log('🌐 Attempting to update user via AWS API...');
      const response = await apiCall(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      console.log('✅ User update response:', response);
      return response.data || response;
    } catch (error) {
      console.error('❌ Error updating user via API:', error);
      console.log('🔄 Using local update with current user data');
      
      // Get current user from localStorage to preserve existing data
      const currentUserStr = localStorage.getItem('user');
      let currentUser = null;
      
      if (currentUserStr) {
        try {
          currentUser = JSON.parse(currentUserStr);
        } catch (e) {
          console.error('❌ Error parsing current user:', e);
        }
      }
      
      // Merge current user data with updates - prioritize userData over currentUser
      const updatedUser: User = {
        id: userId,
        email: currentUser?.email || 'john@example.com',
        username: currentUser?.username || 'john_doe',
        fullName: userData.fullName !== undefined ? userData.fullName : (currentUser?.fullName || 'John Doe'),
        profilePicture: userData.profilePicture !== undefined ? userData.profilePicture : (currentUser?.profilePicture || ''),
        bio: userData.bio !== undefined ? userData.bio : (currentUser?.bio || 'Software Developer'),
        location: userData.location !== undefined ? userData.location : (currentUser?.location || 'New York'),
        website: userData.website !== undefined ? userData.website : (currentUser?.website || ''),
        connections: currentUser?.connections || 150,
        posts: currentUser?.posts || 25,
        createdAt: currentUser?.createdAt || '2024-01-15T10:00:00Z',
      };
      
      console.log('🔄 Current user from localStorage:', currentUser);
      console.log('🔄 User data to update:', userData);
      console.log('🔄 Final merged user:', updatedUser);
      
      console.log('✅ Local update result:', updatedUser);
      return updatedUser;
    }
  },
};

// Posts API calls
export const postsAPI = {
  // Get posts feed
  getPosts: async (limit: number = 10, offset: number = 0): Promise<Post[]> => {
    try {
      console.log('🌐 Attempting to fetch posts from AWS API...');
      const response = await apiCall(`/posts?limit=${limit}&offset=${offset}`);
      console.log('📝 Posts API Response:', response);
      
      // Transform backend data to match frontend expectations
      const posts = response.posts || response.data || response || [];
      return posts.map((post: any) => ({
        id: post.postId || post.id,
        authorId: post.authorId,
        author: {
          id: post.authorId,
          username: 'john_doe',
          fullName: post.authorName || 'John Doe',
          profilePicture: post.authorPicture || '',
        },
        content: post.content,
        images: post.imageUrl ? [post.imageUrl] : [],
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likes || 0,
        comments: post.comments || 0,
        shares: 0,
        isLiked: false,
      }));
    } catch (error) {
      console.error('❌ Error fetching posts from API:', error);
      console.log('🔄 Using fallback posts data');
      // Fallback to mock data for development
      return [
  {
    id: '1',
    authorId: '1',
    author: {
      id: '1',
            username: 'john_doe',
      fullName: 'John Doe',
      profilePicture: '',
    },
          content: 'Just deployed my first AWS application! 🚀',
          images: [],
          createdAt: '2024-01-20T14:30:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
          likes: 42,
          comments: 0,
    shares: 8,
    isLiked: false,
  },
  {
    id: '2',
          authorId: '1',
    author: {
            id: '1',
            username: 'john_doe',
            fullName: 'John Doe',
      profilePicture: '',
    },
          content: 'Learning about serverless architecture with AWS Lambda and API Gateway. The possibilities are endless! 💡',
          images: [],
          createdAt: '2024-01-19T10:15:00Z',
          updatedAt: '2024-01-19T10:15:00Z',
          likes: 89,
          comments: 0,
    shares: 15,
    isLiked: true,
  },
      ];
    }
  },

  // Create new post
  createPost: async (postData: { userId: string; content: string; imageUrl?: string }): Promise<Post> => {
    try {
      console.log('🌐 Creating post via AWS API...');
      // Transform frontend data to match backend expectations
      const backendData = {
        authorId: postData.userId, // Frontend sends userId, backend expects authorId
        content: postData.content,
        imageUrl: postData.imageUrl,
        authorName: 'John Doe', // Will be fetched from user data
        authorPicture: '', // Will be fetched from user data
      };
      
      const response = await apiCall('/posts', {
        method: 'POST',
        body: JSON.stringify(backendData),
      });
      
      // Transform backend response to match frontend expectations
      const post = response.data || response;
      return {
        id: post.postId || post.id,
        authorId: post.authorId,
    author: {
          id: post.authorId,
          username: 'john_doe',
          fullName: post.authorName || 'John Doe',
          profilePicture: post.authorPicture || '',
    },
        content: post.content,
        images: post.imageUrl ? [post.imageUrl] : [],
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likes || 0,
        comments: post.comments || 0,
        shares: 0,
    isLiked: false,
      };
    } catch (error) {
      console.error('❌ Error creating post:', error);
      throw error;
    }
  },

  // Update existing post
  updatePost: async (postId: string, postData: { content: string; imageUrl?: string }): Promise<Post> => {
    try {
      console.log('🌐 Updating post via AWS API...');
      const response = await apiCall(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(postData),
      });
      
      // Transform backend response to match frontend expectations
      const post = response.data || response;
      return {
        id: post.postId || post.id,
        authorId: post.authorId,
        author: {
          id: post.authorId,
          username: 'john_doe',
          fullName: post.authorName || 'John Doe',
          profilePicture: post.authorPicture || '',
        },
        content: post.content,
        images: post.imageUrl ? [post.imageUrl] : [],
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likes || 0,
        comments: post.comments || 0,
        shares: 0,
        isLiked: false,
      };
    } catch (error) {
      console.error('❌ Error updating post:', error);
      throw error;
    }
  },

  // Like/unlike post
  likePost: async (postId: string, userId: string): Promise<{ likes: number }> => {
    try {
      console.log('🌐 Liking post via AWS API...');
      const response = await apiCall(`/posts/${postId}/like`, {
        method: 'POST',
        body: JSON.stringify({ 
          postId,
          userId,
          action: 'like'
        }),
      });
      return response.data || response;
    } catch (error) {
      console.error('❌ Error liking post:', error);
      throw error;
    }
  },
};

// Connections API calls
export const connectionsAPI = {
  // Follow/unfollow user
  createConnection: async (followerId: string, followingId: string, action: 'follow' | 'unfollow' = 'follow'): Promise<Connection> => {
    try {
      console.log('🌐 Creating connection via AWS API...');
      const response = await apiCall('/connections', {
        method: 'POST',
        body: JSON.stringify({ followerId, followingId, action }),
      });
      return response.data || response;
    } catch (error) {
      console.error('❌ Error creating connection:', error);
      throw error;
    }
  },
};

// Upload API calls
export const uploadAPI = {
  // Test upload function to verify S3 connection
  testUpload: async (): Promise<boolean> => {
    try {
      console.log('🧪 Testing upload connection...');
      console.log('🧪 API Base URL:', API_BASE_URL);
      
      // Test with a simple image
      const testData = {
        fileName: 'test-image.jpg',
        fileType: 'image/jpeg',
        fileContent: Buffer.from('fake-image-data').toString('base64'),
        userId: 'test-user',
      };
      
      console.log('🧪 Test data:', testData);
      
      const testResponse = await apiCall('/upload', {
        method: 'POST',
        body: JSON.stringify(testData),
      });
      
      console.log('✅ Upload test successful:', testResponse);
      console.log('✅ Response data:', testResponse);
      
      // Check if we got a valid fileUrl
      if (testResponse.fileUrl) {
        console.log('✅ File URL received:', testResponse.fileUrl);
        return true;
      } else {
        console.error('❌ No fileUrl in response:', testResponse);
        return false;
      }
    } catch (error) {
      console.error('❌ Upload test failed:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      return false;
    }
  },

  // Simple test without API call
  simpleTest: async (): Promise<boolean> => {
    try {
      console.log('🧪 Simple test - checking API endpoint...');
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('✅ Simple test response:', response.status, response.statusText);
      return response.ok;
    } catch (error) {
      console.error('❌ Simple test failed:', error);
      return false;
    }
  },

  // Upload file
  uploadFile: async (file: File, userId: string): Promise<{ fileUrl: string; fileName: string }> => {
    try {
      console.log('🌐 Uploading file via AWS API...');
      // Convert file to base64 for API Gateway
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        };
        reader.readAsDataURL(file);
      });

      const response = await apiCall('/upload', {
        method: 'POST',
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileContent: base64,
          userId: userId,
        }),
      });
      console.log('✅ Upload response:', response);
      console.log('✅ Upload response data:', response.data);
      console.log('✅ Upload response type:', typeof response.data);
      
      // Handle different response structures
      const result = response.data || response;
      console.log('✅ Final upload result:', result);
      
      // Ensure we have the required fields
      if (!result.fileUrl) {
        console.error('❌ Upload response missing fileUrl:', result);
        throw new Error('Upload response missing fileUrl');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      console.log('🔄 Using mock upload');
      // Return mock upload result
      console.log('🔄 Using mock upload fallback');
      return {
        fileUrl: `https://via.placeholder.com/400x300/cccccc/666666?text=${encodeURIComponent(file.name)}`,
        fileName: file.name,
      };
    }
  },
};

// Mock data for development (fallback)
export const mockData = {
  users: [
    {
      id: '1',
      email: 'john@example.com',
      username: 'john_doe',
      fullName: 'John Doe',
      profilePicture: '',
      bio: 'Software Developer',
      location: 'New York',
      website: 'https://johndoe.com',
      connections: 150,
      posts: 25,
      createdAt: '2024-01-15T10:00:00Z',
    },
  ],
  posts: [
    {
      id: '1',
      authorId: '1',
      author: {
        id: '1',
        username: 'john_doe',
        fullName: 'John Doe',
        profilePicture: '',
      },
      content: 'Just deployed my first AWS application! 🚀',
      images: [],
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      likes: 42,
      comments: 0,
      shares: 8,
      isLiked: false,
    },
  ],
};

// Export the API functions
export default {
  userAPI,
  postsAPI,
  connectionsAPI,
  uploadAPI,
  mockData,
};