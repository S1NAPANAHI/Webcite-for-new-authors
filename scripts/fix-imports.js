const fs = require('fs');
const path = require('path');

const UI_PACKAGE_PATH = path.join(__dirname, '..', 'packages', 'ui', 'src');

// List of files that should be skipped when replacing imports
const SKIP_FILES = [
  'index.ts',
  'index.js'
];

// Map of component names to their file paths
const COMPONENT_PATHS = {
  // Core components
  'Button': './button',
  'Input': './input',
  'Label': './label',
  'Select': './select',
  'Tabs': './tabs',
  'Textarea': './textarea',
  'Card': './card',
  'Table': './table',
  'Dialog': './dialog',
  'Alert': './alert',
  'AlertDialog': './alert-dialog',
  'Switch': './switch',
  
  // Pages
  'LoginPage': './LoginPage',
  'AccountPage': './AccountPage',
  'AdminLayout': './AdminLayout',
  'AdminProtectedRoute': './AdminProtectedRoute',
  'DashboardPage': './DashboardPage',
  'HomepageContentManager': './HomepageContentManager',
  'Navbar': './Navbar',
  'SubscriptionPage': './SubscriptionPage',
  'WikiEditor': './WikiEditor',
  'WikiViewer': './WikiViewer',
  'WikiManager': './WikiManager',
  'PagesManager': './PagesManager',
  'SortableFolderTree': './SortableFolderTree',
  
  // Tabs
  'OverviewTab': './OverviewTab',
  'ProfileTab': './ProfileTab',
  'ReadingTab': './ReadingTab',
  'AchievementsTab': './AchievementsTab',
  'PreferencesTab': './PreferencesTab',
  'SecurityTab': './SecurityTab',
};

// Process all TypeScript and JavaScript files in the UI package
function processFiles() {
  const files = getAllFiles(UI_PACKAGE_PATH);
  
  files.forEach(file => {
    if (SKIP_FILES.includes(path.basename(file))) {
      console.log(`Skipping ${file}`);
      return;
    }
    
    const ext = path.extname(file);
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      updateImports(file);
    }
  });
}

// Get all files in a directory recursively
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Update imports in a file
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Find all imports from @zoroaster/ui
  const importRegex = /import\s*{([^}]*)}\s*from\s*['"]@zoroaster\/ui['"]/g;
  
  content = content.replace(importRegex, (match, imports) => {
    const components = imports
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);
    
    const componentImports = [];
    const otherImports = [];
    
    // Separate known components from other imports
    components.forEach(comp => {
      if (comp in COMPONENT_PATHS) {
        componentImports.push(comp);
      } else {
        otherImports.push(comp);
      }
    });
    
    // Generate new import statements
    const newImports = [];
    
    if (componentImports.length > 0) {
      const componentGroups = {};
      
      // Group components by their import path
      componentImports.forEach(comp => {
        const importPath = COMPONENT_PATHS[comp];
        if (!componentGroups[importPath]) {
          componentGroups[importPath] = [];
        }
        componentGroups[importPath].push(comp);
      });
      
      // Create import statements for each group
      for (const [importPath, comps] of Object.entries(componentGroups)) {
        newImports.push(`import { ${comps.join(', ')} } from '${importPath}'`);
      }
    }
    
    // Add back any non-component imports
    if (otherImports.length > 0) {
      newImports.push(`import { ${otherImports.join(', ')} } from '@zoroaster/ui'`);
    }
    
    updated = true;
    return newImports.join('\n');
  });
  
  // Write the updated content back to the file if changes were made
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${path.relative(process.cwd(), filePath)}`);
  }
}

// Run the script
processFiles();
console.log('Import updates complete!');
