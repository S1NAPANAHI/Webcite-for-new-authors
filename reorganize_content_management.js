const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = __dirname;
const CONTENT_MGMT_DIR = path.join(ROOT_DIR, 'supabase', 'migrations', 'content_management');

// Ensure directories exist
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

console.log('🔍 Setting up directory structure...');
REQUIRED_DIRS.forEach(dir => {
  const dirPath = path.join(CONTENT_MGMT_DIR, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// File mappings (old path -> new path)
const FILE_MAPPINGS = [
  // Enums
  { 
    old: 'enums/01_content_status_enum.sql',
    new: 'enums/01_content_status.sql'
  },
  
  // Tables
  { 
    old: 'tables/05_create_works_table.sql',
    new: 'tables/01_works.sql'
  },
  { 
    old: 'tables/06_create_chapters_table.sql',
    new: 'tables/02_chapters.sql'
  },
  { 
    old: 'tables/07_create_posts_table.sql',
    new: 'tables/03_posts.sql'
  },
  { 
    old: 'tables/08_create_characters_table.sql',
    new: 'tables/04_characters.sql'
  },
  { 
    old: 'tables/08_create_pages_table.sql',
    new: 'tables/05_pages.sql'
  },
  { 
    old: 'tables/17_create_content_items_table.sql',
    new: 'tables/06_content_items.sql'
  },
  { 
    old: 'tables/18_create_content_versions_table.sql',
    new: 'tables/07_content_versions.sql'
  },
  { 
    old: 'tables/29_create_homepage_content_table.sql',
    new: 'tables/08_homepage_content.sql'
  },
  { 
    old: 'tables/30_create_news_items_table.sql',
    new: 'tables/09_news_items.sql'
  },
  { 
    old: 'tables/31_create_release_items_table.sql',
    new: 'tables/10_release_items.sql'
  },
  { 
    old: 'tables/47_create_timeline_events_table.sql',
    new: 'tables/11_timeline_events.sql'
  },
  { 
    old: 'tables/48_create_timeline_nested_events_table.sql',
    new: 'tables/12_timeline_nested_events.sql'
  }
];

console.log('\n🔄 Reorganizing files...');
FILE_MAPPINGS.forEach(({ old: oldPath, new: newPath }) => {
  const source = path.join(CONTENT_MGMT_DIR, oldPath);
  const destination = path.join(CONTENT_MGMT_DIR, newPath);
  
  try {
    if (fs.existsSync(source)) {
      // Create destination directory if it doesn't exist
      const destDir = path.dirname(destination);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      fs.renameSync(source, destination);
      console.log(`✅ Moved: ${oldPath} -> ${newPath}`);
    } else {
      console.log(`⚠️  Source not found: ${oldPath}`);
    }
  } catch (error) {
    console.error(`❌ Error moving ${oldPath}:`, error.message);
  }
});

// Create RLS policies
console.log('\n🔒 Creating RLS policies...');
const POLICIES_DIR = path.join(CONTENT_MGMT_DIR, 'policies');

// Works Policies
fs.writeFileSync(
  path.join(POLICIES_DIR, '01_works_policies.sql'),
  `-- Enable Row Level Security
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published works
CREATE POLICY "Enable public read access to published works"
ON works
FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Policy for authors to manage their own works
CREATE POLICY "Enable all operations for authors on their works"
ON works
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Policy for admins to manage all works
CREATE POLICY "Enable all operations for admins on works"
ON works
TO authenticated
USING (is_user_admin(auth.uid()))
WITH CHECK (is_user_admin(auth.uid()));`
);

// Chapters Policies
fs.writeFileSync(
  path.join(POLICIES_DIR, '02_chapters_policies.sql'),
  `-- Enable Row Level Security
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to chapters of published works
CREATE POLICY "Enable public read access to chapters of published works"
ON chapters
FOR SELECT
TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM works 
  WHERE works.id = chapters.work_id 
  AND works.status = 'published'
));

-- Policy for authors to manage chapters of their works
CREATE POLICY "Enable all operations for authors on their chapters"
ON chapters
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM works 
    WHERE works.id = chapters.work_id 
    AND works.author_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM works 
    WHERE works.id = chapters.work_id 
    AND works.author_id = auth.uid()
  )
);

-- Policy for admins to manage all chapters
CREATE POLICY "Enable all operations for admins on chapters"
ON chapters
TO authenticated
USING (is_user_admin(auth.uid()))
WITH CHECK (is_user_admin(auth.uid()));`
);

// Content Items Policies
fs.writeFileSync(
  path.join(POLICIES_DIR, '03_content_items_policies.sql'),
  `-- Enable Row Level Security
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published content
CREATE POLICY "Enable public read access to published content"
ON content_items
FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Policy for content owners to manage their content
CREATE POLICY "Enable all operations for content owners"
ON content_items
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Policy for admins to manage all content
CREATE POLICY "Enable all operations for admins on content_items"
ON content_items
TO authenticated
USING (is_user_admin(auth.uid()))
WITH CHECK (is_user_admin(auth.uid()));`
);

// Create README.md
const README_CONTENT = `# Content Management Migrations

This directory contains database migrations for content management in the Zoroastervers application, including works, chapters, posts, and other content types.

## Directory Structure

- \`enums/\`: Database enums used in content management
  - Example: \`01_content_status.sql\`
- \`tables/\`: Table definitions for content management
  - Example: \`01_works.sql\`, \`02_chapters.sql\`
- \`functions/\`: Stored procedures and functions
  - Example: Functions for content versioning and search
- \`views/\`: Database views for content management
  - Example: \`01_published_works_view.sql\`
- \`policies/\`: Row Level Security (RLS) policies
  - Example: \`01_works_policies.sql\`
- \`triggers/\`: Database triggers
  - Example: Triggers for content versioning
- \`setup/\`: Data migration and setup scripts
- \`archive/\`: Old migration files kept for reference

## Naming Conventions

- **File Prefixes**: Two-digit numbers (e.g., \`01_\`, \`02_\`) to ensure proper execution order
- **Naming**: snake_case for all files and database objects
- **File Extensions**:
  - \`.sql\`: Standard SQL files for DDL and DML
  - \`.up.sql\`: Migration files that apply changes (forward migrations)
  - \`.down.sql\`: Migration files that revert changes (rollback migrations)

## Security Considerations

- All tables have Row Level Security (RLS) enabled by default
- Public read access is granted only to published content
- Content owners can manage their own content
- Admins have full access to all content

## Best Practices

1. Always test migrations in a development environment first
2. Include both forward and backward migrations when possible
3. Document any data migrations with clear comments
4. Keep migrations idempotent when possible
5. Use transactions for multi-statement migrations

## Common Tasks

### Adding a New Migration
1. Create a new SQL file with the next available number prefix
2. Place it in the appropriate directory
3. Include both forward and backward migrations
4. Update this README if adding new functionality

### Troubleshooting
- Check the Supabase logs for SQL errors
- Verify RLS policies aren't preventing access
- Ensure all dependencies are created in the correct order`;

fs.writeFileSync(path.join(CONTENT_MGMT_DIR, 'README.md'), README_CONTENT);
console.log('📝 Created/updated README.md');

// Create verification script
const VERIFY_SCRIPT = `// Verify Content Management Migrations
// Run this script to verify the content_management migration structure

const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'supabase', 'migrations', 'content_management');
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
console.log('🔍 Verifying content_management migration structure...');

// Check required directories
let hasErrors = false;
for (const dir of requiredDirs) {
    const dirPath = path.join(contentDir, dir);
    if (!fs.existsSync(dirPath)) {
        console.error(\`❌ Missing directory: \${dir}\`);
        hasErrors = true;
    } else {
        console.log(\`✅ Found directory: \${dir}/\`);
    }
}

// Check for SQL files in the root directory
const rootFiles = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.sql'))
    .map(dirent => dirent.name);

if (rootFiles.length > 0) {
    console.warn('⚠️  Found SQL files in the root content_management directory. These should be moved to the appropriate subdirectory:');
    rootFiles.forEach(file => console.log(\`   - \${file}\`));
    hasErrors = true;
} else {
    console.log('✅ No SQL files found in root directory');
}

// Check file naming conventions
console.log('\\n🔍 Checking file naming conventions...');
const dirsToCheck = ['enums', 'tables', 'functions', 'views', 'policies', 'triggers', 'setup'];

for (const dir of dirsToCheck) {
    const dirPath = path.join(contentDir, dir);
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

// Check for required files
console.log('\\n🔍 Checking for required files...');
const requiredFiles = [
    'tables/01_works.sql',
    'tables/02_chapters.sql',
    'policies/01_works_policies.sql',
    'policies/02_chapters_policies.sql',
    'policies/03_content_items_policies.sql'
];

let missingFiles = [];
for (const file of requiredFiles) {
    const filePath = path.join(contentDir, file);
    if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
        hasErrors = true;
    }
}

if (missingFiles.length > 0) {
    console.error('❌ Missing required files:');
    missingFiles.forEach(file => console.log(\`   - \${file}\`));
} else {
    console.log('✅ All required files are present');
}

// Final result
console.log('\\n' + '='.repeat(50));
if (hasErrors) {
    console.error('❌ Verification failed. Please fix the issues above.');
    process.exit(1);
} else {
    console.log('✅ Content management migration structure looks good!');
    console.log('\\nNext steps:');
    console.log('1. Test the content management functionality in a development environment');
    console.log('2. Update any application code that references old file paths');
    console.log('3. Document the new structure for your team');
}
`;

fs.writeFileSync(path.join(CONTENT_MGMT_DIR, 'verify-content-migrations.js'), VERIFY_SCRIPT);
console.log('✅ Created verification script: verify-content-migrations.js');

console.log('\n🎉 Content management migration reorganization complete!');
console.log('\nNext steps:');
console.log('1. Review the changes made to the content_management migrations');
console.log('2. Run \'node verify-content-migrations.js\' to verify the structure');
console.log('3. Test the migrations in a development environment');
console.log('4. Update any code that might reference the old file paths');
