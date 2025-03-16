// Configuration constants for the application
import { Platform } from 'react-native';

// API URL for backend services
const DEV_API_URL = 'http://localhost:3000';
const PROD_API_URL = 'https://api.growbook.app'; // Replace with your production API URL

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

// Client credentials - imported from Secrets.ts which is gitignored
// See Secrets.template.ts for the expected format
let CLIENT_ID = '';
let CLIENT_SECRET = '';

try {
  // Try to import from Secrets.ts (which should be created locally and never committed)
  const Secrets = require('./Secrets');
  CLIENT_ID = Secrets.API_CLIENT_ID;
  CLIENT_SECRET = Secrets.API_CLIENT_SECRET;
} catch (e) {
  // Fallback to empty values if Secrets.ts doesn't exist
  console.warn('Secrets.ts not found. API client authentication will not work.');
}

export { CLIENT_ID, CLIENT_SECRET };

// Google OAuth configuration
export const GOOGLE_WEB_CLIENT_ID = '794398607839-kmojuhfl6jcvvs5fro2l1a5raf7i8fj9.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID = '794398607839-4t7jt68mqmuhogpmavsll0fo4mc3qanl.apps.googleusercontent.com';
export const GOOGLE_ANDROID_CLIENT_ID = '794398607839-ga8h8tt9cr84dqtfa6be94mibqcmkm5i.apps.googleusercontent.com';

// Helper function to get the appropriate client ID based on platform
export const getGoogleClientId = () => {
  if (Platform.OS === 'ios') return GOOGLE_IOS_CLIENT_ID;
  if (Platform.OS === 'android') return GOOGLE_ANDROID_CLIENT_ID;
  return GOOGLE_WEB_CLIENT_ID;
};

// Expo redirect scheme (must match app.json)
export const REDIRECT_SCHEME = 'growbook';
