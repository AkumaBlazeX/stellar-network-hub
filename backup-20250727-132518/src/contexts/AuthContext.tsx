import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { userAPI } from '../services/mockAPI';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          // Validate user data structure
          if (parsedUser && parsedUser.id && parsedUser.email) {
            const validatedUser: User = {
              id: parsedUser.id || '',
              email: parsedUser.email || '',
              username: parsedUser.username || '',
              fullName: parsedUser.fullName || 'User',
              profilePicture: parsedUser.profilePicture || '',
              coverImage: parsedUser.coverImage || '',
              bio: parsedUser.bio || 'Software Developer',
              location: parsedUser.location || 'New York',
              website: parsedUser.website || '',
              connections: parsedUser.connections || 0,
              posts: parsedUser.posts || 0,
              createdAt: parsedUser.createdAt || new Date().toISOString(),
            };
            setUser(validatedUser);
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Login attempt for:', email);
      
      // Basic validation
      if (!email || !password) {
        console.error('❌ Login failed: Missing email or password');
        return false;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error('❌ Login failed: Invalid email format');
        return false;
      }

      // Password length validation
      if (password.length < 6) {
        console.error('❌ Login failed: Password too short');
        return false;
      }

      // Check if user exists in localStorage (simulating database)
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = existingUsers.find((u: User) => u.email === email);
      
      if (existingUser) {
        // User exists - authenticate
        console.log('✅ User found, authenticating...');
        setUser(existingUser);
        localStorage.setItem('user', JSON.stringify(existingUser));
        return true;
      } else {
        // User doesn't exist - create new user (for demo purposes)
        console.log('🆕 User not found, creating new account...');
        const newUser: User = {
          id: uuidv4(),
          email: email,
          username: email.split('@')[0],
          fullName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          profilePicture: '',
          coverImage: '',
          bio: 'Software Developer',
          location: 'New York',
          website: '',
          connections: 0,
          posts: 0,
          createdAt: new Date().toISOString(),
        };
        
        // Save new user to users list
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        // Set as current user
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        console.log('✅ New user created and logged in:', newUser);
        return true;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      console.log('📝 Registration attempt:', userData);
      
      // Validation
      if (!userData.email || !userData.password || !userData.username || !userData.fullName) {
        console.error('❌ Registration failed: Missing required fields');
        return false;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        console.error('❌ Registration failed: Invalid email format');
        return false;
      }

      // Password length validation
      if (userData.password.length < 6) {
        console.error('❌ Registration failed: Password too short');
        return false;
      }

      // Username validation
      if (userData.username.length < 3) {
        console.error('❌ Registration failed: Username too short');
        return false;
      }

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = existingUsers.find((u: User) => u.email === userData.email);
      
      if (existingUser) {
        console.error('❌ Registration failed: User already exists');
        return false;
      }

      // Create new user
      const newUser: User = {
        id: uuidv4(),
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

      // Save to users list
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      // Set as current user
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      console.log('✅ Registration successful');
      return true;
    } catch (error) {
      console.error('❌ Registration error:', error);
      return false;
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      console.log('👤 Profile Update:', userData);
      console.log('👤 Current user before update:', user);
      
      if (user) {
        // Update user data
        const updatedUser = {
          ...user,
          ...userData,
          profilePicture: userData.profilePicture !== undefined ? userData.profilePicture : user.profilePicture,
          coverImage: userData.coverImage !== undefined ? userData.coverImage : user.coverImage,
        };
        
        console.log('✅ Final merged user object:', updatedUser);
        
        // Update state and localStorage
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update in users list
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = existingUsers.findIndex((u: User) => u.id === user.id);
        if (userIndex !== -1) {
          existingUsers[userIndex] = updatedUser;
          localStorage.setItem('users', JSON.stringify(existingUsers));
        }
        
        console.log('✅ User state and localStorage updated');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user:', user?.email);
    setUser(null);
    localStorage.removeItem('user');
    console.log('✅ Logout successful');
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