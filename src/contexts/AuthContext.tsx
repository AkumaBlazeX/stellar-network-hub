import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useOidcAuth } from 'react-oidc-context';
import { userAPI } from '@/services/mockAPI';


export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  connections: number;
  posts: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development - this will be replaced with real AWS Cognito integration
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  username: 'johndoe',
  fullName: 'John Doe',
  profilePicture: '',
  coverImage: '',
  bio: 'Software Developer passionate about building amazing products',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  connections: 450,
  posts: 25,
  createdAt: '2023-01-15',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const oidcAuth = useOidcAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage (for local development)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        // Validate and ensure all required fields are present
        const validatedUser: User = {
          id: userData.id || `user-${Date.now()}`,
          email: userData.email || 'user@example.com',
          username: userData.username || 'user',
          fullName: userData.fullName || 'User',
          profilePicture: userData.profilePicture || '',
          coverImage: userData.coverImage || '',
          bio: userData.bio || 'Software Developer',
          location: userData.location || 'New York',
          website: userData.website || '',
          connections: userData.connections || 0,
          posts: userData.posts || 0,
          createdAt: userData.createdAt || new Date().toISOString(),
        };
        
        setUser(validatedUser);
        console.log('👤 Loaded and validated user from localStorage:', validatedUser);
      } catch (error) {
        console.error('❌ Error parsing stored user:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Login attempt for:', email);
      // For now, use mock login to stay in the UI
      // In production, this would integrate with Cognito directly
      const mockUser: User = {
        id: `user-${Date.now()}`, // Generate unique ID
        email: email,
        username: email.split('@')[0],
        fullName: 'User',
        profilePicture: '',
        coverImage: '',
        bio: 'Software Developer',
        location: 'New York',
        website: '',
        connections: 0,
        posts: 0,
        createdAt: new Date().toISOString(),
      };
      console.log('👤 Setting user:', mockUser);
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      console.log('✅ Login successful');
        return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Mock registration - replace with AWS Cognito signUp
      console.log('📝 Mock Registration:', userData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        username: userData.username,
        fullName: userData.fullName,
        profilePicture: '',
        coverImage: '',
        bio: '',
        location: '',
        website: '',
        connections: 0,
        posts: 0,
        createdAt: new Date().toISOString(),
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      console.log('👤 Profile Update via AWS API:', userData);
      console.log('👤 Current user before update:', user);
      
      if (user) {
        // Call AWS API to update user profile
        const updatedUser = await userAPI.updateUser(user.id, userData);
        console.log('✅ Updated user from API:', updatedUser);
        
        if (updatedUser) {
          // Create a completely new user object with merged data
          const newUser: User = {
            ...user,
            ...userData,
            fullName: userData.fullName || user.fullName,
            bio: userData.bio || user.bio,
            location: userData.location || user.location,
            website: userData.website || user.website,
            profilePicture: userData.profilePicture !== undefined ? userData.profilePicture : user.profilePicture,
            coverImage: (userData as any).coverImage !== undefined ? (userData as any).coverImage : (user as any).coverImage,
          } as User;
          
          console.log('🔍 updateProfile - userData.profilePicture:', userData.profilePicture);
          console.log('🔍 updateProfile - user.profilePicture:', user.profilePicture);
          console.log('🔍 updateProfile - newUser.profilePicture:', newUser.profilePicture);
          console.log('🔍 updateProfile - userData.coverImage:', (userData as any).coverImage);
          console.log('🔍 updateProfile - user.coverImage:', (user as any).coverImage);
          console.log('🔍 updateProfile - newUser.coverImage:', (newUser as any).coverImage);
          
          console.log('✅ Final merged user object:', newUser);
          
          // Update state and localStorage
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          
          console.log('✅ User state and localStorage updated');
          
          return true;
        } else {
          console.error('❌ Profile update failed: No user data returned');
          return false;
        }
      } else {
        console.error('❌ Profile update failed: No current user');
        return false;
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear user data and redirect to login
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};