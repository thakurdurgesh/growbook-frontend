import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGoogleAuth } from './useGoogleAuth';
import { API_URL, CLIENT_ID, CLIENT_SECRET } from '@/constants/Config';

// Define types for our context
type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  google_connected?: boolean;
  [key: string]: any; // For any additional user properties
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, passwordConfirmation: string) => Promise<any>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  linkGoogleAccount: () => Promise<any>;
  unlinkGoogleAccount: () => Promise<any>;
  clearError: () => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use our Google auth hook
  const { 
    signInWithGoogle: googleSignIn, 
    linkGoogleAccount: googleLink,
    unlinkGoogleAccount: googleUnlink,
    loading: googleLoading,
    error: googleError,
    userInfo: googleUserInfo,
    token: googleToken
  } = useGoogleAuth();

  // Initialize auth state from storage
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading auth data from storage', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStoredData();
  }, []);

  // Update state when Google auth changes
  useEffect(() => {
    if (googleUserInfo && googleToken) {
      setUser(googleUserInfo);
      setToken(googleToken);
    }
    
    if (googleError) {
      setError(googleError);
    }
  }, [googleUserInfo, googleToken, googleError]);

  // Save user and token to storage when they change
  useEffect(() => {
    const saveToStorage = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem('user');
        }
        
        if (token) {
          await AsyncStorage.setItem('token', token);
        } else {
          await AsyncStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error saving auth data to storage', error);
      }
    };
    
    saveToStorage();
  }, [user, token]);

  // Traditional login with email and password
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/v1/users/sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': CLIENT_ID,
          'X-Client-Secret': CLIENT_SECRET,
        },
        body: JSON.stringify({
          user: { email, password }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
      console.error('Login error', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register with email and password
  const register = async (email: string, password: string, passwordConfirmation: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': CLIENT_ID,
          'X-Client-Secret': CLIENT_SECRET,
        },
        body: JSON.stringify({
          user: {
            email,
            password,
            password_confirmation: passwordConfirmation,
            user_type: 'parent'
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (error: any) {
      setError(error.message || 'An error occurred during registration');
      console.error('Registration error', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call backend logout API
      if (token) {
        await fetch(`${API_URL}/api/v1/users/sign_out`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Client-Id': CLIENT_ID,
            'X-Client-Secret': CLIENT_SECRET,
          },
        });
      }
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      // Clear local state regardless of API success
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  // Google sign in
  const signInWithGoogle = async () => {
    return googleSignIn();
  };

  // Link Google account to existing user
  const linkGoogleAccount = async () => {
    if (!token) {
      throw new Error('You must be logged in to link your Google account');
    }
    
    try {
      const result = await googleLink(token);
      setUser(result.user);
      return result;
    } catch (error: any) {
      setError(error.message || 'Failed to link Google account');
      throw error;
    }
  };

  // Unlink Google account from existing user
  const unlinkGoogleAccount = async () => {
    if (!token) {
      throw new Error('You must be logged in to unlink your Google account');
    }
    
    try {
      const result = await googleUnlink(token);
      setUser(result.user);
      return result;
    } catch (error: any) {
      setError(error.message || 'Failed to unlink Google account');
      throw error;
    }
  };

  // Clear any auth errors
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading: isLoading || googleLoading,
        error,
        login,
        register,
        logout,
        signInWithGoogle,
        linkGoogleAccount,
        unlinkGoogleAccount,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
