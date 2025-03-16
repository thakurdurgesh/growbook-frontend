# Google Authentication Setup for Mobile Devices

This guide explains how to set up Google Authentication for your Growbook mobile app on iOS and Android.

## Prerequisites

- A Google Cloud Platform account
- An iOS developer account (for iOS)
- A Firebase project (for Android)

## 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Configure the OAuth consent screen
   - Add your app name, user support email, and developer contact information
   - Add the necessary scopes (email, profile)

## 2. Create OAuth Client IDs

### For Web (Required for both iOS and Android)

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Add a name for your web client
5. Add authorized JavaScript origins:
   - For development: `https://auth.expo.io`
   - For production: Your app's domain
6. Add authorized redirect URIs:
   - For development: `https://auth.expo.io/@your-username/GrowbookBackend`
   - For production: Your app's callback URL
7. Copy the generated Client ID and update it in `constants/Config.ts` as `GOOGLE_WEB_CLIENT_ID`

### For iOS

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "iOS"
4. Enter your Bundle ID (e.g., `com.growbook.app`) - must match the one in app.json
5. Copy the generated Client ID and update it in `constants/Config.ts` as `GOOGLE_IOS_CLIENT_ID`

### For Android

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Android"
4. Enter your Package Name (e.g., `com.growbook.app`) - must match the one in app.json
5. Generate a SHA-1 certificate fingerprint:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
6. Enter the SHA-1 certificate fingerprint
7. Copy the generated Client ID and update it in `constants/Config.ts` as `GOOGLE_ANDROID_CLIENT_ID`

## 3. Firebase Setup for Android

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add an Android app to your Firebase project
   - Enter your package name (e.g., `com.growbook.app`)
   - Enter your app nickname
   - Enter the SHA-1 certificate fingerprint
4. Download the `google-services.json` file
5. Replace the placeholder `google-services.json` file in your project root with the downloaded file

## 4. iOS Configuration

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Find your iOS OAuth client
3. Copy the iOS URL scheme (format: `com.googleusercontent.apps.YOUR_CLIENT_ID`)
4. Update the `reservedClientId` in your app.json with this value:

```json
"ios": {
  "supportsTablet": true,
  "bundleIdentifier": "com.growbook.app",
  "config": {
    "googleSignIn": {
      "reservedClientId": "com.googleusercontent.apps.YOUR_CLIENT_ID"
    }
  }
}
```

## 5. Update Configuration Values

Update the following files with your credentials:

1. `constants/Config.ts`:
   - `GOOGLE_WEB_CLIENT_ID`
   - `GOOGLE_IOS_CLIENT_ID`
   - `GOOGLE_ANDROID_CLIENT_ID`
   - `API_URL` (your Rails backend URL)
   - `CLIENT_ID` and `CLIENT_SECRET` (your Rails API credentials)

2. `app.json`:
   - Ensure `bundleIdentifier` for iOS is correct
   - Ensure `package` for Android is correct
   - Update `reservedClientId` for iOS

## 6. Testing

1. Run your app on iOS or Android:
   ```bash
   npx expo run:ios
   # or
   npx expo run:android
   ```

2. Test the Google Sign-In functionality

## Troubleshooting

- **iOS Issues**: Make sure the Bundle ID in your app.json matches the one you registered in the Google Cloud Console.
- **Android Issues**: Ensure your SHA-1 fingerprint is correct and matches the one you registered in the Google Cloud Console.
- **General Issues**: Check the console logs for specific error messages from the Google Sign-In SDK.

## Additional Resources

- [Google Sign-In for Expo](https://docs.expo.dev/guides/authentication/#google)
- [React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)
- [Google OAuth 2.0 for Mobile & Desktop Apps](https://developers.google.com/identity/protocols/oauth2/native-app)
