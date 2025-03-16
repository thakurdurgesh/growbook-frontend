import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { useState } from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { 
  getGoogleClientId,
  GOOGLE_WEB_CLIENT_ID, 
  GOOGLE_IOS_CLIENT_ID, 
  API_URL,
  CLIENT_ID,
  CLIENT_SECRET
} from '@/constants/Config';

// Ensure WebBrowser can complete the authentication session (for web)
WebBrowser.maybeCompleteAuthSession();

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID, // required for iOS/Android to get refresh token
  iosClientId: GOOGLE_IOS_CLIENT_ID, // only for iOS
  offlineAccess: true, // if you want to access Google API on behalf of the user
  scopes: ['profile', 'email'] // request email and profile info
});

export function useGoogleAuth() {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First, check if play services are available (Android only)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }
      
      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      
      // Get ID token (this is what your Rails backend expects)
      const { idToken } = userInfo;
      
      if (!idToken) {
        throw new Error('Failed to get ID token from Google');
      }
      
      // Exchange Google ID token for Rails API token
      const apiResponse = await fetch(`${API_URL}/api/v1/auth/google/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': CLIENT_ID,
          'X-Client-Secret': CLIENT_SECRET,
        },
        body: JSON.stringify({
          id_token: idToken,
        }),
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to authenticate with server');
      }
      
      const data = await apiResponse.json();
      setUserInfo(data.user);
      setToken(data.token);
      return data;
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        setError('Sign in was cancelled');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        setError('Sign in is already in progress');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Play services not available or outdated');
      } else {
        setError(err.message || 'An error occurred during Google authentication');
        console.error('Google auth error:', err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const linkGoogleAccount = async (existingToken) => {
    if (!existingToken) {
      throw new Error('You must be logged in to link your Google account');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Sign in with Google
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }
      
      const googleUserInfo = await GoogleSignin.signIn();
      const { idToken } = googleUserInfo;
      
      if (!idToken) {
        throw new Error('Failed to get ID token from Google');
      }
      
      // Link with existing account
      const apiResponse = await fetch(`${API_URL}/api/v1/users/link_google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${existingToken}`,
          'X-Client-Id': CLIENT_ID,
          'X-Client-Secret': CLIENT_SECRET,
        },
        body: JSON.stringify({
          id_token: idToken,
        }),
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to link Google account');
      }
      
      const data = await apiResponse.json();
      setUserInfo(data.user);
      return data;
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        setError('Sign in was cancelled');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        setError('Sign in is already in progress');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Play services not available or outdated');
      } else {
        setError(err.message || 'An error occurred while linking Google account');
        console.error('Link Google account error:', err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unlinkGoogleAccount = async (existingToken) => {
    if (!existingToken) {
      throw new Error('You must be logged in to unlink your Google account');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const apiResponse = await fetch(`${API_URL}/api/v1/users/unlink_google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${existingToken}`,
          'X-Client-Id': CLIENT_ID,
          'X-Client-Secret': CLIENT_SECRET,
        },
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to unlink Google account');
      }
      
      const data = await apiResponse.json();
      setUserInfo(data.user);
      
      // Sign out from Google
      await GoogleSignin.signOut();
      
      return data;
    } catch (err) {
      setError(err.message || 'An error occurred while unlinking Google account');
      console.error('Unlink Google account error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userInfo,
    token,
    loading,
    error,
    signInWithGoogle,
    linkGoogleAccount,
    unlinkGoogleAccount,
  };
}
