const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define paths
const rootDir = __dirname;
const migrationsDir = path.join(rootDir, 'supabase', 'migrations');
const wikiDir = path.join(migrationsDir, 'wiki');

// Create required directories
const requiredDirs = [
  'enums',
  'tables',
  'functions',
  'views',
  'policies',
  'triggers',
  'setup',
  'archive'
];

console.log('🔍 Setting up directory structure...');
requiredDirs.forEach(dir => {
  const dirPath = path.join(wikiDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// File mappings (old path -> new path)
const fileMappings = [
  // Tables
  { 
    old: 'tables/11_create_wiki_items_table.sql',
    new: 'tables/01_wiki_items.sql'
  },
  { 
    old: 'tables/12_create_wiki_categories_table.sql',
    new: 'tables/02_wiki_categories.sql'
  },
  { 
    old: 'tables/12_migrate_wiki_data.sql',
    new: 'setup/01_migrate_wiki_data.sql'
  },
  { 
    old: 'tables/14_create_wiki_revisions_table.sql',
    new: 'tables/03_wiki_revisions.sql'
  },
  { 
    old: 'tables/14_update_wiki_fk_references.sql',
    new: 'setup/02_update_wiki_fk_references.sql'
  },
  { 
    old: 'tables/15_create_wiki_content_blocks_table.sql',
    new: 'tables/04_wiki_content_blocks.sql'
  },
  { 
    old: 'tables/15_create_wiki_revisions_table.sql',
    new: 'tables/05_wiki_revisions_v2.sql'  // Duplicate, needs review
  },
  { 
    old: 'tables/16_create_wiki_content_blocks_table.sql',
    new: 'tables/06_wiki_content_blocks_v2.sql'  // Duplicate, needs review
  },
  { 
    old: 'tables/16_create_wiki_media_table.sql',
    new: 'tables/07_wiki_media.sql'
  },
  
  // Functions
  { 
    old: 'functions/06_compute_full_path_function.sql',
    new: 'functions/01_compute_wiki_path.sql'
  },
  { 
    old: 'functions/07_update_item_paths_trigger.sql',
    new: 'triggers/01_update_wiki_item_paths.sql'
  },
  { 
    old: 'functions/08_get_folder_tree_function.sql',
    new: 'functions/02_get_wiki_folder_tree.sql'
  },
  { 
    old: 'functions/09_search_content_function.sql',
    new: 'functions/03_search_wiki_content.sql'
  },
  { 
    old: 'functions/13_create_wiki_page_function.sql',
    new: 'functions/04_create_wiki_page.sql'
  },
  { 
    old: 'functions/18_get_child_folders_function.sql',
    new: 'functions/05_get_wiki_child_folders.sql'
  },
  { 
    old: 'functions/19_get_folder_path_function.sql',
    new: 'functions/06_get_wiki_folder_path.sql'
  },
  { 
    old: 'functions/21_increment_wiki_page_views_function.sql',
    new: 'functions/07_increment_wiki_page_views.sql'
  },
  
  // Old files to archive
  { 
    old: 'tables/_old_11_create_wiki_folders_table.sql',
    new: 'archive/old_wiki_folders_table.sql'
  },
  { 
    old: 'tables/_old_13_create_wiki_pages_table.sql',
    new: 'archive/old_wiki_pages_table.sql'
  }
];

console.log('\n🔄 Reorganizing files...');
fileMappings.forEach(({ old: oldPath, new: newPath }) => {
  const source = path.join(wikiDir, oldPath);
  const destination = path.join(wikiDir, newPath);
  
  try {
    if (fs.existsSync(source)) {
      fs.renameSync(source, destination);
      console.log(`✅ Moved: ${oldPath} -> ${newPath}`);
    } else {
      console.log(`⚠️  Source not found: ${oldPath}`);
    }
  } catch (error) {
    console.error(`❌ Error moving ${oldPath}:`, error.message);
  }
});

// Create README.md
const readmeContent = `# Wiki Migrations

This directory contains database migrations for the wiki functionality.

## Directory Structure

- \`enums/\`: Database enums used in the wiki system
- \`tables/\`: Table definitions for wiki functionality
- \`functions/\`: Stored procedures and functions
- \`views/\`: Database views for wiki content
- \`policies/\`: Row Level Security (RLS) policies
- \`triggers/\`: Database triggers
- \`setup/\`: Data migration and setup scripts
- \`archive/\`: Old migration files kept for reference

## Naming Conventions

- Files are prefixed with a two-digit number indicating execution order
- Names are in snake_case and describe the purpose of the file
- File extensions indicate the type of operation:
  - \`.sql\`: Regular SQL files
  - \`.up.sql\`: Migration files that apply changes
  - \`.down.sql\`: Migration files that revert changes

## Migration Order

1. Enums
2. Tables
3. Functions
4. Views
5. Triggers
6. Policies
7. Setup scripts

## Notes

- When adding new migrations, ensure they follow the naming convention
- Test migrations in a development environment before applying to production
- Document any data migrations or special considerations in the migration files
`;

fs.writeFileSync(path.join(wikiDir, 'README.md'), readmeContent);
console.log('\n📝 Created/updated README.md');

// Create verification script
const verifyScript = `// Verify Wiki Migrations
// Run this script to verify the wiki migration structure

const fs = require('fs');
const path = require('path');

const wikiDir = path.join(__dirname, 'supabase', 'migrations', 'wiki');
const requiredDirs = [
    'enums',
    'tables',
    'functions',
    'views',
    'policies',
    'triggers',
    'setup',
    'archive'
];

// Check directory structure
console.log('🔍 Verifying wiki migration structure...');

// Check required directories
let hasErrors = false;
for (const dir of requiredDirs) {
    const dirPath = path.join(wikiDir, dir);
    if (!fs.existsSync(dirPath)) {
        console.error(\`❌ Missing directory: \${dir}\`);
        hasErrors = true;
    } else {
        console.log(\`✅ Found directory: \${dir}\`);
    }
}

// Check for SQL files in the root directory
const rootFiles = fs.readdirSync(wikiDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.sql'))
    .map(dirent => dirent.name);

if (rootFiles.length > 0) {
    console.warn('⚠️  Found SQL files in the root wiki directory. These should be moved to the appropriate subdirectory:');
    rootFiles.forEach(file => console.log(\`   - \${file}\`));
    hasErrors = true;
}

// Check file naming conventions
console.log('\\n🔍 Checking file naming conventions...');
const dirsToCheck = ['enums', 'tables', 'functions', 'views', 'policies', 'triggers', 'setup'];

for (const dir of dirsToCheck) {
    const dirPath = path.join(wikiDir, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    const files = fs.readdirSync(dirPath)
        .filter(file => file.endsWith('.sql'))
        .filter(file => !file.match(/^\\d{2}_.+\\.sql$/));
    
    if (files.length > 0) {
        console.warn(\`⚠️  Files in \${dir}/ do not follow the naming convention (##_name.sql):\`);
        files.forEach(file => console.log(\`   - \${dir}/\${file}\`));
        hasErrors = true;
    }
}

// Final result
console.log('\\n' + '='.repeat(50));
if (hasErrors) {
    console.error('❌ Verification failed. Please fix the issues above.');
    process.exit(1);
} else {
    console.log('✅ Wiki migration structure looks good!');
}
`;

fs.writeFileSync(path.join(wikiDir, 'verify-wiki-migrations.js'), verifyScript);
console.log('✅ Created verification script: verify-wiki-migrations.js');

console.log('\n🎉 Wiki migration reorganization complete!');
console.log('\nNext steps:');
console.log('1. Review the changes made to the wiki migrations');
console.log('2. Run \'node verify-wiki-migrations.js\' to verify the structure');
console.log('3. Test the migrations in a development environment');
console.log('4. Update any code that might reference the old file paths');
