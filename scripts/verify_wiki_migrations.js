const fs = require('fs');
const path = require('path');

// Configuration
const WIKI_DIR = path.join(__dirname, 'supabase', 'migrations', 'wiki');
const REQUIRED_DIRS = [
  'enums',
  'tables',
  'functions',
  'views',
  'policies',
  'triggers',
  'setup',
  'archive'
];

// Check if directory exists and is accessible
function checkDirectory(dirPath) {
  try {
    const stats = fs.statSync(dirPath);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}

// Get all SQL files in a directory
function getSqlFiles(dirPath) {
  try {
    return fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.sql'))
      .map(file => path.join(dirPath, file));
  } catch (err) {
    return [];
  }
}

// Check file naming convention (##_name.sql)
function checkNamingConvention(filePath) {
  const fileName = path.basename(filePath);
  return /^\d{2}_.+\.sql$/.test(fileName);
}

// Main verification function
function verifyWikiMigrations() {
  console.log('🔍 Verifying wiki migration structure...');
  let hasErrors = false;

  // 1. Check required directories
  console.log('\n📂 Checking directory structure...');
  for (const dir of REQUIRED_DIRS) {
    const dirPath = path.join(WIKI_DIR, dir);
    if (checkDirectory(dirPath)) {
      console.log(`✅ Found directory: ${dir}/`);
    } else {
      console.error(`❌ Missing directory: ${dir}/`);
      hasErrors = true;
    }
  }

  // 2. Check for SQL files in the root directory
  console.log('\n🔍 Checking for SQL files in root directory...');
  const rootFiles = fs.readdirSync(WIKI_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.sql'))
    .map(dirent => dirent.name);

  if (rootFiles.length > 0) {
    console.error('❌ Found SQL files in the root wiki directory. These should be moved to the appropriate subdirectory:');
    rootFiles.forEach(file => console.log(`   - ${file}`));
    hasErrors = true;
  } else {
    console.log('✅ No SQL files found in root directory');
  }

  // 3. Check file naming conventions in each directory
  console.log('\n📝 Checking file naming conventions...');
  const dirsToCheck = REQUIRED_DIRS.filter(dir => dir !== 'archive');
  
  for (const dir of dirsToCheck) {
    const dirPath = path.join(WIKI_DIR, dir);
    if (!checkDirectory(dirPath)) continue;
    
    const files = getSqlFiles(dirPath);
    if (files.length === 0) {
      console.log(`ℹ️  No SQL files found in ${dir}/`);
      continue;
    }

    console.log(`\n🔍 Checking files in ${dir}/:`);
    let dirHasErrors = false;
    
    for (const file of files) {
      const fileName = path.basename(file);
      if (checkNamingConvention(file)) {
        console.log(`   ✅ ${fileName}`);
      } else {
        console.error(`   ❌ ${fileName} (should match pattern: ##_name.sql)`);
        dirHasErrors = true;
        hasErrors = true;
      }
    }
    
    if (!dirHasErrors) {
      console.log(`   All files in ${dir}/ follow the naming convention`);
    }
  }

  // 4. Check for required files
  console.log('\n🔍 Checking for required files...');
  const requiredFiles = [
    'tables/01_wiki_items.sql',
    'policies/01_wiki_items_policies.sql',
    'views/01_wiki_page_tree_view.sql',
    'views/02_wiki_latest_revisions_view.sql',
    'views/03_wiki_search_view.sql'
  ];
  
  let missingFiles = [];
  for (const file of requiredFiles) {
    const filePath = path.join(WIKI_DIR, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
      hasErrors = true;
    }
  }
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
  } else {
    console.log('✅ All required files are present');
  }

  // Final result
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.error('❌ Verification failed. Please fix the issues above.');
    process.exit(1);
  } else {
    console.log('✅ Wiki migration structure looks good!');
    console.log('\nNext steps:');
    console.log('1. Test the wiki functionality in a development environment');
    console.log('2. Update any application code that references old file paths');
    console.log('3. Document the new wiki structure for your team');
  }
}

// Run the verification
verifyWikiMigrations();
