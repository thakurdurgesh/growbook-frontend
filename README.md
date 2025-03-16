# Growbook Frontend

A mobile application for plant enthusiasts built with Expo and React Native.

## Setup Instructions

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure Google Authentication**

   This app uses Google Sign-In for authentication. Follow these steps to set it up:

   a. **Create API Credentials File**:
   - Copy `constants/Secrets.template.ts` to `constants/Secrets.ts`
   - Add your API credentials from your Rails backend:
     ```typescript
     export const API_CLIENT_ID = 'c9d9a11d452baeed0839acb2c937e9e4';
     export const API_CLIENT_SECRET = '89a35c3f197d6720f0876a35472932a8c909f6cfa48e4ecfdf62ca2858838ebe';
     ```

   b. **Firebase Configuration**:
   - The `google-services.json` file should already be in place
   - This file is gitignored for security reasons

3. **Start the app**

   ```bash
   npx expo start
   ```

   For native builds with Google Sign-In:
   ```bash
   npx expo run:ios
   # or
   npx expo run:android
   ```

## Project Structure

- `app/` - Main application code (using Expo Router)
- `constants/` - Configuration constants
- `hooks/` - Custom React hooks including authentication
- `components/` - Reusable UI components

## Security Notes

- Never commit sensitive credentials to Git
- `constants/Secrets.ts` and `google-services.json` are in `.gitignore`
- Each developer needs their own copy of these files

## Google Authentication Flow

1. User taps "Sign in with Google" in the app
2. Native Google Sign-In SDK handles authentication
3. App receives Google ID token
4. App sends token to Rails backend
5. Rails backend verifies token with Google
6. Rails backend creates/updates user record
7. Rails backend returns user data and API token
8. App stores API token for future requests

## Useful Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Google Sign-In for Expo](https://docs.expo.dev/guides/authentication/#google)
- [Expo Router](https://docs.expo.dev/router/introduction/)
