#!/usr/bin/env node

/**
 * This script helps encode Firebase configuration files to base64 strings
 * for secure storage in EAS secrets.
 * 
 * Usage:
 *   node scripts/encode-firebase-config.js <path-to-file>
 * 
 * Example:
 *   node scripts/encode-firebase-config.js ./google-services.json
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a file path as an argument');
  console.error('Example: node scripts/encode-firebase-config.js ./google-services.json');
  process.exit(1);
}

try {
  const fileContent = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');
  const base64Content = Buffer.from(fileContent).toString('base64');
  
  console.log(`\nBase64 encoded content for ${filePath}:\n`);
  console.log(base64Content);
  console.log(`\nUse this value with:\n`);
  console.log(`eas secret:create --scope project --name GOOGLE_SERVICES_JSON --value "<base64-content>"\n`);
} catch (error) {
  console.error(`Error reading file: ${error.message}`);
  process.exit(1);
}
