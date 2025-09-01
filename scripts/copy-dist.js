const fs = require('fs');
const path = require('path');

/**
 * Recursively copy directory from source to destination
 */
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read all items in source directory
  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // Recursively copy subdirectory
      copyDir(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy apps/frontend/dist to root dist directory
const sourceDir = path.join(__dirname, '..', 'apps', 'frontend', 'dist');
const destDir = path.join(__dirname, '..', 'dist');

try {
  console.log('Copying frontend build output...');
  console.log('Source:', sourceDir);
  console.log('Destination:', destDir);
  
  if (!fs.existsSync(sourceDir)) {
    console.error('Error: Source directory does not exist:', sourceDir);
    process.exit(1);
  }

  // Remove existing dist directory if it exists
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }

  copyDir(sourceDir, destDir);
  console.log('Successfully copied frontend build output to root dist directory');
} catch (error) {
  console.error('Error copying files:', error);
  process.exit(1);
}
