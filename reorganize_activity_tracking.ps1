# Reorganize Activity and Tracking Migrations
# This script will reorganize the activity_and_tracking migrations into a standardized structure

# Set error action preference
$ErrorActionPreference = "Stop"

# Define paths
$rootDir = Split-Path -Parent $PSScriptRoot
$migrationsDir = Join-Path $rootDir "supabase\migrations"
$activityDir = Join-Path $migrationsDir "activity_and_tracking"

# Create required directories if they don't exist
$directories = @(
    "enums",
    "tables",
    "functions",
    "views",
    "policies",
    "triggers",
    "setup",
    "archive"
)

foreach ($dir in $directories) {
    $path = Join-Path $activityDir $dir
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created directory: $path"
    }
}

# Define file mappings (old path -> new path with standardized naming)
$fileMappings = @{
    # Enums
    "enums/01_create_activity_type_enum.sql" = "enums/01_activity_type.sql"
    
    # Tables
    "tables/02_create_user_stats_table.sql" = "tables/01_user_stats.sql"
    "tables/04_create_daily_spins_table.sql" = "tables/02_daily_spins.sql"
    "tables/09_create_reading_progress_table.sql" = "tables/03_reading_progress.sql"
    "tables/10_create_user_ratings_table.sql" = "tables/04_user_ratings.sql"
    "tables/32_create_recent_activity_table.sql" = "tables/05_recent_activity.sql"
    "tables/34_create_audit_log_table.sql" = "tables/06_audit_log.sql"
    "tables/35_create_webhook_events_table.sql" = "tables/07_webhook_events.sql"
    
    # Views (if any)
    # "views/some_view.sql" = "views/01_some_view.sql"
}

# Move and rename files according to mappings
foreach ($mapping in $fileMappings.GetEnumerator()) {
    $source = Join-Path $activityDir $mapping.Key
    $destination = Join-Path $activityDir $mapping.Value
    
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

# Create RLS policies for activity and tracking tables
# User Stats Policies
@"
-- Enable Row Level Security
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own stats
CREATE POLICY "Enable read access for users on their stats"
ON user_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for admins to view all stats
CREATE POLICY "Enable all operations for admins on user_stats"
ON user_stats
TO authenticated
USING (is_user_admin(auth.uid()))
WITH CHECK (is_user_admin(auth.uid()));
"@ | Out-File -FilePath (Join-Path $activityDir "policies/01_user_stats_policies.sql") -Encoding utf8

# Daily Spins Policies
@"
-- Enable Row Level Security
ALTER TABLE daily_spins ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own spin history
CREATE POLICY "Enable read access for users on their spin history"
ON daily_spins
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for users to insert their spin records
CREATE POLICY "Enable insert for users on their spin history"
ON daily_spins
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for admins to view all spin history
CREATE POLICY "Enable all operations for admins on daily_spins"
ON daily_spins
TO authenticated
USING (is_user_admin(auth.uid()))
WITH CHECK (is_user_admin(auth.uid()));
"@ | Out-File -FilePath (Join-Path $activityDir "policies/02_daily_spins_policies.sql") -Encoding utf8

# Reading Progress Policies
@"
-- Enable Row Level Security
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own reading progress
CREATE POLICY "Enable read access for users on their reading progress"
ON reading_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for users to update their reading progress
CREATE POLICY "Enable update for users on their reading progress"
ON reading_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for admins to view all reading progress
CREATE POLICY "Enable all operations for admins on reading_progress"
ON reading_progress
TO authenticated
USING (is_user_admin(auth.uid()))
WITH CHECK (is_user_admin(auth.uid()));
"@ | Out-File -FilePath (Join-Path $activityDir "policies/03_reading_progress_policies.sql") -Encoding utf8

# Create a README.md file
$readmeContent = @"
# Activity and Tracking Migrations

This directory contains database migrations for user activity tracking and analytics in the Zoroastervers application.

## Directory Structure

- `enums/`: Database enums used in activity tracking
  - Example: `01_activity_type.sql`
- `tables/`: Table definitions for tracking user activities
  - Example: `01_user_stats.sql`, `02_daily_spins.sql`
- `functions/`: Stored procedures and functions
  - Example: Functions for generating activity reports
- `views/`: Database views for activity reports
  - Example: `01_user_activity_summary.sql`
- `policies/`: Row Level Security (RLS) policies
  - Example: `01_user_stats_policies.sql`
- `triggers/`: Database triggers for activity tracking
  - Example: Triggers for updating user stats
- `setup/`: Data migration and setup scripts
- `archive/`: Old migration files kept for reference

## Naming Conventions

- **File Prefixes**: Two-digit numbers (e.g., `01_`, `02_`) to ensure proper execution order
- **Naming**: snake_case for all files and database objects
- **File Extensions**:
  - `.sql`: Standard SQL files for DDL and DML
  - `.up.sql`: Migration files that apply changes (forward migrations)
  - `.down.sql`: Migration files that revert changes (rollback migrations)

## Security Considerations

- All tables have Row Level Security (RLS) enabled by default
- Users can only access their own activity data unless they are admins
- Sensitive operations require admin privileges through the `is_user_admin()` function

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
- Ensure all dependencies are created in the correct order
"@

# Write the README
$readmePath = Join-Path $activityDir "README.md"
$readmeContent | Out-File -FilePath $readmePath -Encoding utf8
Write-Host "Created/updated README.md"

# Create a verification script
$verifyScript = @"
// Verify Activity and Tracking Migrations
// Run this script to verify the activity_and_tracking migration structure

const fs = require('fs');
const path = require('path');

const activityDir = path.join(__dirname, 'supabase', 'migrations', 'activity_and_tracking');
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
console.log('🔍 Verifying activity_and_tracking migration structure...');

// Check required directories
let hasErrors = false;
for (const dir of requiredDirs) {
    const dirPath = path.join(activityDir, dir);
    if (!fs.existsSync(dirPath)) {
        console.error(`❌ Missing directory: ${dir}`);
        hasErrors = true;
    } else {
        console.log(`✅ Found directory: ${dir}/`);
    }
}

// Check for SQL files in the root directory
const rootFiles = fs.readdirSync(activityDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.sql'))
    .map(dirent => dirent.name);

if (rootFiles.length > 0) {
    console.warn('⚠️  Found SQL files in the root activity_and_tracking directory. These should be moved to the appropriate subdirectory:');
    rootFiles.forEach(file => console.log(`   - ${file}`));
    hasErrors = true;
} else {
    console.log('✅ No SQL files found in root directory');
}

// Check file naming conventions
console.log('\n🔍 Checking file naming conventions...');
const dirsToCheck = ['enums', 'tables', 'functions', 'views', 'policies', 'triggers', 'setup'];

for (const dir of dirsToCheck) {
    const dirPath = path.join(activityDir, dir);
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

// Check for required files
console.log('\n🔍 Checking for required files...');
const requiredFiles = [
    'tables/01_user_stats.sql',
    'policies/01_user_stats_policies.sql',
    'policies/02_daily_spins_policies.sql',
    'policies/03_reading_progress_policies.sql'
];

let missingFiles = [];
for (const file of requiredFiles) {
    const filePath = path.join(activityDir, file);
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
    console.log('✅ Activity and tracking migration structure looks good!');
    console.log('\nNext steps:');
    console.log('1. Test the activity tracking functionality in a development environment');
    console.log('2. Update any application code that references old file paths');
    console.log('3. Document the new structure for your team');
}
"@

# Write the verification script
$verifyScriptPath = Join-Path $activityDir "verify-activity-migrations.js"
$verifyScript | Out-File -FilePath $verifyScriptPath -Encoding utf8
Write-Host "Created verification script: verify-activity-migrations.js"

Write-Host "`nActivity and tracking migration reorganization complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review the changes made to the activity_and_tracking migrations"
Write-Host "2. Run 'node verify-activity-migrations.js' to verify the structure"
Write-Host "3. Test the migrations in a development environment"
Write-Host "4. Update any code that might reference the old file paths"
