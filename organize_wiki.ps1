# Organize Wiki Migrations Script
# This script reorganizes the wiki migrations into a standardized structure

# Set error action preference
$ErrorActionPreference = "Stop"

# Define paths
$rootDir = Split-Path -Parent $PSScriptRoot
$migrationsDir = Join-Path $rootDir "supabase\migrations"
$wikiDir = Join-Path $migrationsDir "wiki"

# Create required directories if they don't exist
$directories = @(
    "enums",
    "tables",
    "functions",
    "views",
    "policies",
    "triggers",
    "setup"
)

foreach ($dir in $directories) {
    $path = Join-Path $wikiDir $dir
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created directory: $path"
    }
}

# Define file mappings (old path -> new path with standardized naming)
$fileMappings = @{
    # Tables
    "tables\11_create_wiki_items_table.sql" = "tables\01_wiki_items.sql"
    "tables\12_create_wiki_categories_table.sql" = "tables\02_wiki_categories.sql"
    "tables\12_migrate_wiki_data.sql" = "setup\01_migrate_wiki_data.sql"
    "tables\14_create_wiki_revisions_table.sql" = "tables\03_wiki_revisions.sql"
    "tables\14_update_wiki_fk_references.sql" = "setup\02_update_wiki_fk_references.sql"
    "tables\15_create_wiki_content_blocks_table.sql" = "tables\04_wiki_content_blocks.sql"
    "tables\15_create_wiki_revisions_table.sql" = "tables\05_wiki_revisions_v2.sql"  # Duplicate, needs review
    "tables\16_create_wiki_content_blocks_table.sql" = "tables\06_wiki_content_blocks_v2.sql"  # Duplicate, needs review
    "tables\16_create_wiki_media_table.sql" = "tables\07_wiki_media.sql"
    
    # Functions
    "functions\06_compute_full_path_function.sql" = "functions\01_compute_wiki_path.sql"
    "functions\07_update_item_paths_trigger.sql" = "triggers\01_update_wiki_item_paths.sql"
    "functions\08_get_folder_tree_function.sql" = "functions\02_get_wiki_folder_tree.sql"
    "functions\09_search_content_function.sql" = "functions\03_search_wiki_content.sql"
    "functions\13_create_wiki_page_function.sql" = "functions\04_create_wiki_page.sql"
    "functions\18_get_child_folders_function.sql" = "functions\05_get_wiki_child_folders.sql"
    "functions\19_get_folder_path_function.sql" = "functions\06_get_wiki_folder_path.sql"
    "functions\21_increment_wiki_page_views_function.sql" = "functions\07_increment_wiki_page_views.sql"
}

# Move and rename files according to mappings
foreach ($mapping in $fileMappings.GetEnumerator()) {
    $source = Join-Path $wikiDir $mapping.Key
    $destination = Join-Path $wikiDir $mapping.Value
    
    if (Test-Path $source) {
        # Create destination directory if it doesn't exist
        $destDir = Split-Path $destination -Parent
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        # Move the file
        Move-Item -Path $source -Destination $destination -Force
        Write-Host "Moved: $($mapping.Key) -> $($mapping.Value)"
    } else {
        Write-Warning "Source file not found: $source"
    }
}

# Handle old files that might need review
$oldFiles = @(
    "tables\_old_11_create_wiki_folders_table.sql",
    "tables\_old_13_create_wiki_pages_table.sql"
)

foreach ($oldFile in $oldFiles) {
    $source = Join-Path $wikiDir $oldFile
    if (Test-Path $source) {
        $destDir = Join-Path $wikiDir "archive"
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        $destFile = Join-Path $destDir (Split-Path $oldFile -Leaf)
        Move-Item -Path $source -Destination $destFile -Force
        Write-Host "Archived old file: $oldFile -> archive/$(Split-Path $oldFile -Leaf)"
    }
}

# Create a README.md file
$readmeContent = @"
# Wiki Migrations

This directory contains database migrations for the wiki functionality.

## Directory Structure

- `enums/`: Database enums used in the wiki system
- `tables/`: Table definitions for wiki functionality
- `functions/`: Stored procedures and functions
- `views/`: Database views for wiki content
- `policies/`: Row Level Security (RLS) policies
- `triggers/`: Database triggers
- `setup/`: Data migration and setup scripts
- `archive/`: Old migration files kept for reference

## Naming Conventions

- Files are prefixed with a two-digit number indicating execution order
- Names are in snake_case and describe the purpose of the file
- File extensions indicate the type of operation:
  - `.sql`: Regular SQL files
  - `.up.sql`: Migration files that apply changes
  - `.down.sql`: Migration files that revert changes

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
"@

# Write the README
$readmePath = Join-Path $wikiDir "README.md"
$readmeContent | Out-File -FilePath $readmePath -Encoding utf8
Write-Host "Created/updated README.md"

# Create a verification script
$verifyScript = @"
// Verify Wiki Migrations
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
        console.error(`❌ Missing directory: ${dir}`);
        hasErrors = true;
    } else {
        console.log(`✅ Found directory: ${dir}`);
    }
}

// Check for SQL files in the root directory
const rootFiles = fs.readdirSync(wikiDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.sql'))
    .map(dirent => dirent.name);

if (rootFiles.length > 0) {
    console.warn('⚠️  Found SQL files in the root wiki directory. These should be moved to the appropriate subdirectory:');
    rootFiles.forEach(file => console.log(`   - ${file}`));
    hasErrors = true;
}

// Check file naming conventions
console.log('\n🔍 Checking file naming conventions...');
const dirsToCheck = ['enums', 'tables', 'functions', 'views', 'policies', 'triggers', 'setup'];

for (const dir of dirsToCheck) {
    const dirPath = path.join(wikiDir, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    const files = fs.readdirSync(dirPath)
        .filter(file => file.endsWith('.sql'))
        .filter(file => !file.match(/^\d{2}_.+\.sql$/));
    
    if (files.length > 0) {
        console.warn(`⚠️  Files in ${dir}/ do not follow the naming convention (##_name.sql):`);
        files.forEach(file => console.log(`   - ${dir}/${file}`));
        hasErrors = true;
    }
}

// Final result
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.error('❌ Verification failed. Please fix the issues above.');
    process.exit(1);
} else {
    console.log('✅ Wiki migration structure looks good!');
}
"@

# Write the verification script
$verifyScriptPath = Join-Path $wikiDir "verify-wiki-migrations.js"
$verifyScript | Out-File -FilePath $verifyScriptPath -Encoding utf8
Write-Host "Created verification script: verify-wiki-migrations.js"

Write-Host "`nWiki migration reorganization complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review the changes made to the wiki migrations"
Write-Host "2. Run 'node verify-wiki-migrations.js' to verify the structure"
Write-Host "3. Test the migrations in a development environment"
Write-Host "4. Update any code that might reference the old file paths"
