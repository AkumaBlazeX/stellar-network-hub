import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useOidc } from 'react-oidc-context';
import { User } from '@/types';

interface CognitoAuthContextType {
  user: User | null;
  login: () => void;
  register: () => void;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const CognitoAuthContext = createContext<CognitoAuthContextType | undefined>(undefined);

export const CognitoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useOidc();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (auth.user) {
      // Convert OIDC user to our User type
      const oidcUser = auth.user as any;
      const mappedUser: User = {
        id: oidcUser.sub || '',
        email: oidcUser.email || '',
        username: oidcUser.preferred_username || oidcUser.email?.split('@')[0] || '',
        fullName: oidcUser.name || oidcUser.email?.split('@')[0] || '',
        profilePicture: oidcUser.picture || '',
        coverImage: '',
        bio: '',
        location: '',
        website: '',
        connections: 0,
        posts: 0,
        createdAt: new Date().toISOString(),
      };
      setUser(mappedUser);
    } else {
      setUser(null);
    }
  }, [auth.user]);

  const login = () => {
    auth.signinRedirect();
  };

  const register = () => {
    // Redirect to Cognito hosted UI for registration
    const registerUrl = `https://professionalnet.auth.${import.meta.env.VITE_AWS_REGION}.amazoncognito.com/signup?client_id=${import.meta.env.VITE_COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+phone+profile&redirect_uri=${encodeURIComponent(window.location.origin + '/login')}`;
    window.location.href = registerUrl;
  };

  const logout = () => {
    auth.signoutRedirect();
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (user && (auth.user as any)?.access_token) {
        // Update user profile via API
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(auth.user as any).access_token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            ...userData
          }),
        });

        if (response.ok) {
          const updatedUser = { ...user, ...userData };
          setUser(updatedUser);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const value: CognitoAuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!auth.user && !auth.isLoading,
    isLoading: auth.isLoading,
  };

  return (
    <CognitoAuthContext.Provider value={value}>
      {children}
    </CognitoAuthContext.Provider>
  );
};

export const useCognitoAuth = () => {
  const context = useContext(CognitoAuthContext);
  if (context === undefined) {
    throw new Error('useCognitoAuth must be used within a CognitoAuthProvider');
  }
  return context;
};