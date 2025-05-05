import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Create the destination directory if it doesn't exist
const destDir = path.join(rootDir, 'dist', 'public');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Path to the .htaccess file
const srcFile = path.join(rootDir, 'client', '.htaccess');
const destFile = path.join(destDir, '.htaccess');

// Check if source file exists
if (fs.existsSync(srcFile)) {
  try {
    // Copy the file
    fs.copyFileSync(srcFile, destFile);
    console.log(`Successfully copied .htaccess to ${destFile}`);
  } catch (err) {
    console.error(`Error copying .htaccess file: ${err.message}`);
  }
} else {
  console.warn(`Warning: .htaccess file not found at ${srcFile}`);
  // Create an empty .htaccess file if it doesn't exist
  try {
    fs.writeFileSync(destFile, '# Auto-generated .htaccess file\n');
    console.log(`Created an empty .htaccess file at ${destFile}`);
  } catch (err) {
    console.error(`Error creating empty .htaccess file: ${err.message}`);
  }
} 