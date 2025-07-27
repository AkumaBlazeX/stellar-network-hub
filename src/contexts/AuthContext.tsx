import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { userAPI } from '../services/mockAPI';
import { User } from '@/types';
import { SecurityUtils } from '@/utils/security';

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
      console.log('🔍 Password provided:', !!password, 'Length:', password.length);
      
      // Basic validation
      if (!email || !password) {
        console.error('❌ Login failed: Missing email or password');
        console.log('Debug - Email provided:', !!email, 'Password provided:', !!password);
        return false;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error('❌ Login failed: Invalid email format');
        console.log('Debug - Email format test:', emailRegex.test(email));
        return false;
      }

      // Password length validation
      if (password.length < 6) {
        console.error('❌ Login failed: Password too short');
        console.log('Debug - Password length:', password.length);
        return false;
      }

      // Hash password for comparison
      console.log('🔍 Hashing password for comparison...');
      const hashedPassword = await SecurityUtils.hashData(password);
      console.log('🔍 Password hashed successfully');

      // Check if user exists in localStorage (simulating database)
      console.log('🔍 Checking for existing users...');
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('🔍 Total users in system:', existingUsers.length);
      console.log('🔍 All users:', existingUsers.map(u => ({ email: u.email, username: u.username })));
      
      const existingUser = existingUsers.find((u: User & { hashedPassword?: string }) => u.email === email);
      console.log('🔍 Found user by email:', existingUser ? 'Yes' : 'No');
      
      if (existingUser) {
        // User exists - verify password hash
        console.log('🔍 Comparing password hashes...');
        console.log('🔍 Stored hash:', existingUser.hashedPassword);
        console.log('🔍 Input hash:', hashedPassword);
        console.log('🔍 Hashes match:', existingUser.hashedPassword === hashedPassword);
        
        if (existingUser.hashedPassword === hashedPassword) {
          console.log('✅ User found, password verified...');
          // Remove hashed password from user object before setting
          const { hashedPassword: _, ...userWithoutPassword } = existingUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          return true;
        } else {
          console.error('❌ Login failed: Invalid password');
          console.log('Debug - Password hash mismatch');
          return false;
        }
      } else {
        // User doesn't exist - STRICT: Do NOT create new account
        console.error('❌ Login failed: User not found. Please register first.');
        console.log('Debug - No user found with email:', email);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.log('Debug - Error details:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      console.log('📝 Registration attempt:', userData);
      
      // Test SecurityUtils import
      console.log('🔍 Testing SecurityUtils import...');
      console.log('🔍 SecurityUtils available:', !!SecurityUtils);
      console.log('🔍 validatePassword available:', !!SecurityUtils.validatePassword);
      console.log('🔍 hashData available:', !!SecurityUtils.hashData);
      
      // Validation
      if (!userData.email || !userData.password || !userData.username || !userData.fullName) {
        console.error('❌ Registration failed: Missing required fields');
        console.log('Debug - Email:', !!userData.email, 'Password:', !!userData.password, 'Username:', !!userData.username, 'FullName:', !!userData.fullName);
        return false;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        console.error('❌ Registration failed: Invalid email format');
        console.log('Debug - Email:', userData.email);
        return false;
      }

      // Password validation using SecurityUtils
      console.log('🔍 Checking password validation...');
      console.log('🔍 Password length:', userData.password.length);
      console.log('🔍 Password contains uppercase:', /[A-Z]/.test(userData.password));
      console.log('🔍 Password contains lowercase:', /[a-z]/.test(userData.password));
      console.log('🔍 Password contains number:', /\d/.test(userData.password));
      console.log('🔍 Password contains special char:', /[!@#$%^&*(),.?":{}|<>]/.test(userData.password));
      
      const passwordValidation = SecurityUtils.validatePassword(userData.password);
      console.log('🔍 Password validation result:', passwordValidation);
      if (!passwordValidation.isValid) {
        console.error('❌ Registration failed: Password does not meet requirements');
        console.log('Debug - Password errors:', passwordValidation.errors);
        return false;
      }

      // Username validation
      console.log('🔍 Checking username validation...');
      console.log('🔍 Username:', userData.username);
      console.log('🔍 Username length:', userData.username.length);
      console.log('🔍 Username regex test:', /^[a-zA-Z0-9_]+$/.test(userData.username));
      
      if (userData.username.length < 3) {
        console.error('❌ Registration failed: Username too short');
        console.log('Debug - Username length:', userData.username.length);
        return false;
      }

      // Username format validation (alphanumeric and underscores only)
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(userData.username)) {
        console.error('❌ Registration failed: Username can only contain letters, numbers, and underscores');
        console.log('Debug - Username:', userData.username);
        return false;
      }

      // Full name validation
      console.log('🔍 Checking full name validation...');
      console.log('🔍 Full name:', userData.fullName);
      console.log('🔍 Full name length:', userData.fullName.length);
      
      if (userData.fullName.length < 2) {
        console.error('❌ Registration failed: Full name too short');
        console.log('Debug - Full name length:', userData.fullName.length);
        return false;
      }

      // Check if user already exists (email and username)
      console.log('🔍 Checking for existing users...');
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('🔍 Existing users count:', existingUsers.length);
      console.log('🔍 Existing users:', existingUsers);
      
      const existingUserByEmail = existingUsers.find((u: User) => u.email === userData.email);
      const existingUserByUsername = existingUsers.find((u: User) => u.username === userData.username);
      
      console.log('🔍 Existing user by email:', existingUserByEmail);
      console.log('🔍 Existing user by username:', existingUserByUsername);
      
      if (existingUserByEmail) {
        console.error('❌ Registration failed: Email already registered');
        console.log('Debug - Existing email found:', existingUserByEmail.email);
        return false;
      }

      if (existingUserByUsername) {
        console.error('❌ Registration failed: Username already taken');
        console.log('Debug - Existing username found:', existingUserByUsername.username);
        return false;
      }

      // Hash password before storing
      console.log('🔍 Hashing password...');
      const hashedPassword = await SecurityUtils.hashData(userData.password);
      console.log('🔍 Password hashed successfully');

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

      // Save to users list with hashed password
      const userWithHashedPassword = { ...newUser, hashedPassword };
      existingUsers.push(userWithHashedPassword);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      // Set as current user (without hashed password)
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      console.log('✅ Registration successful');
      return true;
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.log('Debug - Error details:', error);
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

  // Utility function to create demo users for testing
  const createDemoUsers = () => {
    const demoUsers = [
      {
        id: 'demo-user-1',
        email: 'john@example.com',
        username: 'john_doe',
        fullName: 'John Doe',
        profilePicture: '',
        coverImage: '',
        bio: 'Software Developer at Tech Corp',
        location: 'San Francisco',
        website: 'https://johndoe.dev',
        connections: 150,
        posts: 25,
        createdAt: '2024-01-15T10:00:00Z',
        hashedPassword: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' // "password"
      },
      {
        id: 'demo-user-2',
        email: 'jane@example.com',
        username: 'jane_smith',
        fullName: 'Jane Smith',
        profilePicture: '',
        coverImage: '',
        bio: 'Product Manager',
        location: 'New York',
        website: '',
        connections: 89,
        posts: 12,
        createdAt: '2024-01-20T14:30:00Z',
        hashedPassword: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' // "password"
      }
    ];

    localStorage.setItem('users', JSON.stringify(demoUsers));
    console.log('✅ Demo users created');
  };

  // Utility function to clear all users (for testing)
  const clearAllUsers = () => {
    localStorage.removeItem('users');
    localStorage.removeItem('user');
    setUser(null);
    console.log('✅ All users cleared');
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