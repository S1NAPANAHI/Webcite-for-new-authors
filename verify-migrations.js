const fs = require('fs');
const path = require('path');

// Expected directory structure
const expectedDirs = [
  'enums',
  'tables',
  'functions',
  'views',
  'policies',
  'triggers',
  'setup'
];

// Check if all expected directories exist
function checkDirectoryStructure(basePath) {
  console.log('\n🔍 Verifying migration directory structure...');
  
  const missingDirs = [];
  const extraDirs = [];
  
  // Check for missing expected directories
  expectedDirs.forEach(dir => {
    const dirPath = path.join(basePath, dir);
    if (!fs.existsSync(dirPath)) {
      missingDirs.push(dir);
    }
  });
  
  // Check for extra directories
  const dirs = fs.readdirSync(basePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
    
  dirs.forEach(dir => {
    if (!expectedDirs.includes(dir)) {
      extraDirs.push(dir);
    }
  });
  
  // Report results
  if (missingDirs.length === 0 && extraDirs.length === 0) {
    console.log('✅ Directory structure is correct');
  } else {
    if (missingDirs.length > 0) {
      console.error('❌ Missing directories:', missingDirs.join(', '));
    }
    if (extraDirs.length > 0) {
      console.warn('⚠️  Extra directories found (these can be ignored):', extraDirs.join(', '));
    }
  }
  
  return missingDirs.length === 0;
}

// Check file naming convention (prefix_*.sql)
function checkFileNaming(directory) {
  console.log(`\n🔍 Checking file naming in ${directory}...`);
  
  const files = fs.readdirSync(directory)
    .filter(file => file.endsWith('.sql'));
    
  const invalidFiles = [];
  
  files.forEach(file => {
    if (!/^\d{2}_.+\.sql$/.test(file)) {
      invalidFiles.push(file);
    }
  });
  
  if (invalidFiles.length === 0) {
    console.log(`✅ All files in ${directory} follow the naming convention`);
  } else {
    console.error(`❌ Files with invalid naming in ${directory}:`);
    invalidFiles.forEach(file => console.log(`  - ${file}`));
  }
  
  return invalidFiles.length === 0;
}

// Check for duplicate file prefixes
function checkDuplicatePrefixes(directory) {
  console.log(`\n🔍 Checking for duplicate prefixes in ${directory}...`);
  
  const files = fs.readdirSync(directory)
    .filter(file => file.endsWith('.sql'));
    
  const prefixMap = new Map();
  
  files.forEach(file => {
    const prefix = file.split('_')[0];
    if (!prefixMap.has(prefix)) {
      prefixMap.set(prefix, []);
    }
    prefixMap.get(prefix).push(file);
  });
  
  let hasDuplicates = false;
  
  prefixMap.forEach((files, prefix) => {
    if (files.length > 1) {
      console.error(`❌ Duplicate prefix ${prefix} in ${directory}:`);
      files.forEach(file => console.log(`  - ${file}`));
      hasDuplicates = true;
    }
  });
  
  if (!hasDuplicates) {
    console.log(`✅ No duplicate prefixes found in ${directory}`);
  }
  
  return !hasDuplicates;
}

// Main function
function main() {
  const migrationsPath = path.join(__dirname, 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsPath)) {
    console.error('❌ Migrations directory not found at:', migrationsPath);
    process.exit(1);
  }
  
  console.log('🔍 Starting migration verification...');
  
  // Check for user_management and ecommerce directories
  const modules = ['user_management', 'ecommerce'];
  let allChecksPassed = true;
  
  modules.forEach(module => {
    const modulePath = path.join(migrationsPath, module);
    
    if (!fs.existsSync(modulePath)) {
      console.error(`❌ Module directory not found: ${module}`);
      allChecksPassed = false;
      return;
    }
    
    console.log(`\n📂 Verifying module: ${module}`);
    
    // Check directory structure
    const dirStructureOk = checkDirectoryStructure(modulePath);
    allChecksPassed = allChecksPassed && dirStructureOk;
    
    // Check each subdirectory
    expectedDirs.forEach(dir => {
      const dirPath = path.join(modulePath, dir);
      
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath)
          .filter(file => file.endsWith('.sql'));
          
        if (files.length > 0) {
          console.log(`\n📁 Checking ${dir} directory...`);
          const namingOk = checkFileNaming(dirPath);
          const noDupes = checkDuplicatePrefixes(dirPath);
          allChecksPassed = allChecksPassed && namingOk && noDupes;
          
          // Check if files are in the correct directory based on prefix
          if (dir === 'tables') {
            const tableFiles = files.filter(f => f.endsWith('_tables.sql') || f.endsWith('_table.sql'));
            if (tableFiles.length < files.length) {
              const nonTableFiles = files.filter(f => !tableFiles.includes(f));
              console.warn(`⚠️  Non-table files in tables directory: ${nonTableFiles.join(', ')}`);
            }
          }
        } else {
          console.log(`ℹ️  No SQL files found in ${dir} directory`);
        }
      }
    });
  });
  
  // Final result
  console.log('\n' + '='.repeat(50));
  if (allChecksPassed) {
    console.log('✅ All migration checks passed successfully!');
  } else {
    console.error('❌ Some migration checks failed. Please review the errors above.');
    process.exit(1);
  }
}

// Run the verification
main();
