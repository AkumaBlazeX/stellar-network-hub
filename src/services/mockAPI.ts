import { User, Post, Connection } from '../types';

// API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : null;
};

// Generic API call function
interface ApiResponse {
  data?: unknown;
  posts?: unknown;
  success?: boolean;
  deleted?: boolean;
  [key: string]: unknown;
}

const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<ApiResponse> => {
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
  // Create new user
  createUser: async (userData: User): Promise<User> => {
    try {
      console.log('🌐 Creating user via AWS API...');
      const response = await apiCall('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      console.log('✅ User creation response:', response);
      return response.data || response;
    } catch (error) {
      console.error('❌ Error creating user via API:', error);
      console.log('🔄 Using local user creation');
      // Return the user data as-is for local storage
      return userData;
    }
  },

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
  getPosts: async (limit: number = 50, offset: number = 0): Promise<Post[]> => {
    try {
      console.log('🌐 Attempting to fetch posts from AWS API...');
      const response = await apiCall(`/posts?limit=${limit}&offset=${offset}`);
      console.log('📝 Posts API Response:', response);
      
      // Transform backend data to match frontend expectations
      const posts = response.posts || response.data || response || [];
      
      // Get current user data for author information
      const currentUserStr = localStorage.getItem('user');
      let currentUser = null;
      if (currentUserStr) {
        try {
          currentUser = JSON.parse(currentUserStr);
        } catch (e) {
          console.error('❌ Error parsing current user:', e);
        }
      }
      
      return posts.map((post: unknown) => ({
        id: (post as any).postId || (post as any).id,
        authorId: (post as any).authorId,
        author: {
          id: (post as any).authorId,
          username: (post as any).authorName ? (post as any).authorName.split(' ')[0].toLowerCase() : (currentUser?.username || 'user'),
          fullName: (post as any).authorName || (currentUser?.fullName || 'User'),
          profilePicture: (post as any).authorPicture || (currentUser?.profilePicture || ''),
        },
        content: (post as any).content,
        images: (post as any).imageUrl && (post as any).imageUrl !== 'null' && (post as any).imageUrl !== '' ? [(post as any).imageUrl] : [],
        createdAt: (post as any).createdAt,
        updatedAt: (post as any).updatedAt,
        likes: (post as any).likes || 0,
        comments: (post as any).comments || 0,
        shares: 0,
        isLiked: false,
      }));
    } catch (error) {
      console.error('❌ Error fetching posts from API:', error);
      console.log('🔄 Using fallback posts data');
      
      // Get current user data for fallback posts
      const currentUserStr = localStorage.getItem('user');
      let currentUser = null;
      if (currentUserStr) {
        try {
          currentUser = JSON.parse(currentUserStr);
        } catch (e) {
          console.error('❌ Error parsing current user:', e);
        }
      }
      
      // Fallback to mock data for development
      return [
        {
          id: '1',
          authorId: currentUser?.id || '1',
          author: {
            id: currentUser?.id || '1',
            username: currentUser?.username || 'user',
            fullName: currentUser?.fullName || 'User',
            profilePicture: currentUser?.profilePicture || '',
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
          authorId: currentUser?.id || '1',
          author: {
            id: currentUser?.id || '1',
            username: currentUser?.username || 'user',
            fullName: currentUser?.fullName || 'User',
            profilePicture: currentUser?.profilePicture || '',
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
  createPost: async (postData: { userId: string; content: string; imageUrl?: string; imageUrls?: string[] }): Promise<Post> => {
    try {
      console.log('🌐 Creating post via AWS API...');
      
      // Get current user data for author information
      const currentUserStr = localStorage.getItem('user');
      let currentUser = null;
      if (currentUserStr) {
        try {
          currentUser = JSON.parse(currentUserStr);
        } catch (e) {
          console.error('❌ Error parsing current user:', e);
        }
      }
      
      // Transform frontend data to match backend expectations
      const backendData = {
        authorId: postData.userId, // Frontend sends userId, backend expects authorId
        content: postData.content,
        imageUrl: postData.imageUrl || (postData.imageUrls && postData.imageUrls.length > 0 ? postData.imageUrls[0] : undefined),
        imageUrls: postData.imageUrls || [], // Send all images
        authorName: currentUser?.fullName || 'User',
        authorPicture: currentUser?.profilePicture || '',
      };
      
      const response = await apiCall('/posts', {
        method: 'POST',
        body: JSON.stringify(backendData),
      });
      
      // Transform backend response to match frontend expectations
      const post = response.data || response;
      
      // Use uploaded images if available, otherwise use backend response
      const images = postData.imageUrls && postData.imageUrls.length > 0 
        ? postData.imageUrls.filter(url => url && url !== 'null' && url !== '')
        : (post.imageUrls && post.imageUrls.length > 0 
            ? post.imageUrls.filter(url => url && url !== 'null' && url !== '')
            : (post.imageUrl && post.imageUrl !== 'null' && post.imageUrl !== '' ? [post.imageUrl] : []));
      
      return {
        id: post.postId || post.id,
        authorId: post.authorId,
        author: {
          id: post.authorId,
          username: currentUser?.username || 'user',
          fullName: post.authorName || currentUser?.fullName || 'User',
          profilePicture: post.authorPicture || currentUser?.profilePicture || '',
        },
        content: post.content,
        images: images,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likes || 0,
        comments: post.comments || 0,
        shares: 0,
        isLiked: false,
      };
    } catch (error) {
      console.error('❌ Error creating post:', error);
      console.log('🔄 Using local post creation fallback');
      
      // Fallback to local post creation with uploaded images
      const currentUserStr = localStorage.getItem('user');
      let currentUser = null;
      if (currentUserStr) {
        try {
          currentUser = JSON.parse(currentUserStr);
        } catch (e) {
          console.error('❌ Error parsing current user:', e);
        }
      }
      
      // Use uploaded images if available
      const images = postData.imageUrls && postData.imageUrls.length > 0 
        ? postData.imageUrls.filter(url => url && url !== 'null' && url !== '')
        : (postData.imageUrl && postData.imageUrl !== 'null' && postData.imageUrl !== '' ? [postData.imageUrl] : []);
      
      const fallbackPost: Post = {
        id: `post-${Date.now()}`,
        authorId: postData.userId,
        author: {
          id: postData.userId,
          username: currentUser?.username || 'user',
          fullName: currentUser?.fullName || 'User',
          profilePicture: currentUser?.profilePicture || '',
        },
        content: postData.content,
        images: images,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
      };
      
      console.log('✅ Fallback post created:', fallbackPost);
      return fallbackPost;
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
        images: post.imageUrl && post.imageUrl !== 'null' ? [post.imageUrl] : [],
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

  // Delete post
  deletePost: async (postId: string, userId: string): Promise<boolean> => {
    try {
      console.log('🌐 Deleting post via AWS API...', { postId, userId });
      const response = await apiCall(`/posts/${postId}`, {
        method: 'DELETE',
        body: JSON.stringify({ 
          postId,
          userId
        }),
      });
      console.log('✅ Delete API response:', response);
      return response.success || response.deleted || true;
    } catch (error) {
      console.error('❌ Error deleting post:', error);
      console.log('🔄 Using local delete fallback');
      
      // Fallback to local delete functionality
      const currentUserStr = localStorage.getItem('user');
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          // Simulate successful deletion
          console.log('✅ Post deleted locally');
          return true;
        } catch (e) {
          console.error('❌ Error in local delete fallback:', e);
        }
      }
      
      // Default fallback
      return true;
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
      console.log('🔄 Using local like fallback');
      
      // Fallback to local like functionality
      const currentUserStr = localStorage.getItem('user');
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          // Simulate like increment
          const newLikes = Math.floor(Math.random() * 10) + 1; // Random likes for demo
          return { likes: newLikes };
        } catch (e) {
          console.error('❌ Error in local like fallback:', e);
        }
      }
      
      // Default fallback
      return { likes: 1 };
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

// Helper function to compress images
const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback to original
          }
        },
        file.type,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Upload API calls
export const uploadAPI = {
  // Upload file
  uploadFile: async (file: File, userId: string): Promise<{ fileUrl: string; fileName: string }> => {
    try {
      console.log('🌐 Uploading file via AWS API...');
      console.log('📁 File:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      
      // Check file size (5MB limit to match backend)
      const maxSize = 5 * 1024 * 1024; // 5MB
      let fileToUpload = file;
      
      if (file.size > maxSize) {
        console.log('📦 File is large, attempting compression...');
        try {
          fileToUpload = await compressImage(file);
          console.log('✅ Compression result:', {
            originalSize: file.size,
            compressedSize: fileToUpload.size,
            reduction: `${((1 - fileToUpload.size / file.size) * 100).toFixed(1)}%`
          });
          
          if (fileToUpload.size > maxSize) {
            throw new Error(`File too large even after compression: ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB (max: 5MB)`);
          }
        } catch (compressionError) {
          throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max: 5MB)`);
        }
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(fileToUpload.type)) {
        throw new Error(`Invalid file type: ${fileToUpload.type}`);
      }
      
      // Convert file to base64 for API Gateway
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        };
        reader.readAsDataURL(fileToUpload);
      });

      const uploadData = {
        fileName: fileToUpload.name,
        fileType: fileToUpload.type,
        fileContent: base64,
        userId: userId,
      };

      console.log('📤 Sending to AWS API...');
      const response = await apiCall('/upload', {
        method: 'POST',
        body: JSON.stringify(uploadData),
      });
      
      console.log('✅ AWS API Response:', response);
      
      // Handle different response structures
      const result = response.data || response;
      
      // Ensure we have the required fields
      if (!result.fileUrl) {
        console.error('❌ AWS API response missing fileUrl:', result);
        throw new Error('AWS API response missing fileUrl');
      }
      
      console.log('🎉 Upload successful:', result.fileUrl);
      return result;
    } catch (error) {
      console.error('❌ AWS API upload failed:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        type: typeof error,
        error: error
      });
      
      // Check if it's a network/API issue vs file issue
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          console.log('🌐 Network/API issue detected - using fallback');
        } else if (error.message.includes('File too large')) {
          console.log('📁 File size issue - using fallback');
        } else {
          console.log('❓ Unknown error - using fallback');
        }
      }
      
      // Return a simple SVG placeholder for development
      const svgPlaceholder = `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#f3f4f6"/>
          <text x="200" y="150" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">Image Upload Failed</text>
        </svg>
      `)}`;
      return {
        fileUrl: svgPlaceholder,
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