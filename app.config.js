const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = ({ config }) => {
  // Import the app.json config
  const appConfig = { ...config };

  return {
    ...appConfig,
    // Add hooks for EAS build
    hooks: {
      // This runs before the app is built
      prebuild: async () => {
        console.log("Creating configuration files...");
        
        // Create the files only if we're building with EAS
        if (process.env.EAS_BUILD) {
          const fs = require('fs');
          const path = require('path');
          
          // Create GoogleService-Info.plist for iOS
          if (process.env.GOOGLE_SERVICE_INFO_PLIST) {
            console.log("Creating GoogleService-Info.plist...");
            fs.writeFileSync('./GoogleService-Info.plist', process.env.GOOGLE_SERVICE_INFO_PLIST);
          }
          
          // Create google-services.json for Android
          if (process.env.GOOGLE_SERVICES_JSON) {
            console.log("Creating google-services.json...");
            fs.writeFileSync('./google-services.json', process.env.GOOGLE_SERVICES_JSON);
          }
          
          // Create Secrets.ts for API credentials
          if (process.env.API_CLIENT_ID && process.env.API_CLIENT_SECRET) {
            console.log("Creating Secrets.ts with API credentials...");
            
            // Ensure the constants directory exists
            const constantsDir = path.join(process.cwd(), 'constants');
            if (!fs.existsSync(constantsDir)) {
              fs.mkdirSync(constantsDir, { recursive: true });
            }
            
            const secretsContent = `// This file is generated during the build process
// DO NOT EDIT MANUALLY

export const API_CLIENT_ID = '${process.env.API_CLIENT_ID}';
export const API_CLIENT_SECRET = '${process.env.API_CLIENT_SECRET}';

// Google OAuth web client secret (for web authentication)
export const GOOGLE_WEB_CLIENT_SECRET = '${process.env.GOOGLE_WEB_CLIENT_SECRET || ''}';
`;
            
            fs.writeFileSync(path.join(constantsDir, 'Secrets.ts'), secretsContent);
          }
        }
      }
    }
  };
};
