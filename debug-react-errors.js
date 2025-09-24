#!/usr/bin/env node

/**
 * React Error Debugging Script
 * 
 * This script helps identify and fix common React errors like #301 (infinite re-renders)
 * and Supabase 400 errors in the codebase.
 * 
 * Usage: node debug-react-errors.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

const log = {
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    fix: (msg) => console.log(`${colors.magenta}🔧 FIX: ${msg}${colors.reset}`)
};

class ReactErrorDebugger {
    constructor() {
        this.issues = [];
        this.checkedFiles = 0;
    }

    // Check for potential infinite re-render patterns
    checkInfiniteRenderLoops(content, filePath) {
        const issues = [];

        // Pattern 1: useState in render (not in useEffect)
        const useStateInRender = /const\s*\[[^\]]+,\s*set[^\]]+\]\s*=\s*useState[^;]*;[\s\S]*?set[A-Z][a-zA-Z]*\(/g;
        if (useStateInRender.test(content)) {
            issues.push({
                type: 'infinite-render',
                severity: 'high',
                file: filePath,
                issue: 'Potential setState call in render',
                fix: 'Move state updates to useEffect or event handlers'
            });
        }

        // Pattern 2: Missing useCallback for event handlers
        const eventHandlersWithoutCallback = /const\s+handle[A-Z][a-zA-Z]*\s*=\s*\([^)]*\)\s*=>\s*{[^}]*set[A-Z]/g;
        if (eventHandlersWithoutCallback.test(content)) {
            issues.push({
                type: 'missing-callback',
                severity: 'medium',
                file: filePath,
                issue: 'Event handlers not wrapped in useCallback',
                fix: 'Wrap event handlers with useCallback and proper dependencies'
            });
        }

        // Pattern 3: useEffect without dependencies
        const useEffectWithoutDeps = /useEffect\s*\(\s*\([^)]*\)\s*=>\s*{[\s\S]*?}\s*\);/g;
        const matches = content.match(useEffectWithoutDeps);
        if (matches) {
            matches.forEach(match => {
                if (!match.includes(', [') && !match.includes(',\n[') && !match.includes(', []')) {
                    issues.push({
                        type: 'missing-dependencies',
                        severity: 'high',
                        file: filePath,
                        issue: 'useEffect missing dependency array',
                        fix: 'Add proper dependency array to useEffect'
                    });
                }
            });
        }

        // Pattern 4: Direct function calls in JSX (should be arrow functions)
        const directFunctionCalls = /onClick={[a-zA-Z][a-zA-Z0-9]*\(\)}/g;
        if (directFunctionCalls.test(content)) {
            issues.push({
                type: 'direct-function-call',
                severity: 'high',
                file: filePath,
                issue: 'Direct function calls in onClick (causes immediate execution)',
                fix: 'Use arrow functions: onClick={() => handleFunction()} or onClick={handleFunction}'
            });
        }

        return issues;
    }

    // Check for Supabase query issues
    checkSupabaseQueries(content, filePath) {
        const issues = [];

        // Pattern 1: Malformed user ID queries
        const malformedUserQueries = /\.eq\s*\(\s*['"]user_id['"]\s*,\s*[^)]*:[0-9]+\s*\)/g;
        if (malformedUserQueries.test(content)) {
            issues.push({
                type: 'malformed-query',
                severity: 'high',
                file: filePath,
                issue: 'User ID query contains invalid suffix (e.g., ":1")',
                fix: 'Clean user ID before query: userId.trim().split(":")[0]'
            });
        }

        // Pattern 2: Missing error handling
        const queryWithoutErrorHandling = /await\s+supabase[\s\S]*?\.from\([^)]+\)[\s\S]*?;(?![\s\S]*if\s*\(\s*error\s*\))/g;
        if (queryWithoutErrorHandling.test(content)) {
            issues.push({
                type: 'missing-error-handling',
                severity: 'medium',
                file: filePath,
                issue: 'Supabase queries without error handling',
                fix: 'Always check for { data, error } and handle errors properly'
            });
        }

        // Pattern 3: Synchronous access to async results
        const syncAccessToAsync = /const\s*{\s*data\s*}\s*=\s*await\s+[^;]*;[\s\S]*?data\./g;
        if (syncAccessToAsync.test(content)) {
            issues.push({
                type: 'unsafe-data-access',
                severity: 'medium',
                file: filePath,
                issue: 'Accessing data without null checks',
                fix: 'Always check if data exists before accessing properties: data?.property'
            });
        }

        return issues;
    }

    // Check environment variables
    checkEnvironmentSetup() {
        const issues = [];
        const frontendPath = 'apps/frontend';
        const envExamplePath = path.join(frontendPath, 'env.example');
        const envPath = path.join(frontendPath, '.env');
        const envLocalPath = path.join(frontendPath, '.env.local');

        // Check if env.example exists
        if (!fs.existsSync(envExamplePath)) {
            issues.push({
                type: 'missing-env-example',
                severity: 'low',
                file: envExamplePath,
                issue: 'No env.example file found',
                fix: 'Create env.example with required environment variables'
            });
        } else {
            // Check env.example content
            const envExample = fs.readFileSync(envExamplePath, 'utf8');
            const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_STRIPE_PUBLISHABLE_KEY'];
            
            requiredVars.forEach(varName => {
                if (!envExample.includes(varName)) {
                    issues.push({
                        type: 'missing-env-var',
                        severity: 'medium',
                        file: envExamplePath,
                        issue: `Missing ${varName} in env.example`,
                        fix: `Add ${varName}=your_value_here to env.example`
                    });
                }
            });
        }

        // Check if actual env file exists
        if (!fs.existsSync(envPath) && !fs.existsSync(envLocalPath)) {
            issues.push({
                type: 'missing-env-file',
                severity: 'high',
                file: `${frontendPath}/.env`,
                issue: 'No .env or .env.local file found',
                fix: 'Copy env.example to .env and fill in your actual values'
            });
        }

        return issues;
    }

    // Main scanning function
    scanDirectory(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
        if (!fs.existsSync(dir)) {
            log.error(`Directory not found: ${dir}`);
            return;
        }

        const files = this.getAllFiles(dir, extensions);
        
        log.info(`Scanning ${files.length} files for React and Supabase issues...`);

        files.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            this.checkedFiles++;

            // Check for React issues
            const reactIssues = this.checkInfiniteRenderLoops(content, file);
            this.issues.push(...reactIssues);

            // Check for Supabase issues
            const supabaseIssues = this.checkSupabaseQueries(content, file);
            this.issues.push(...supabaseIssues);
        });

        // Check environment setup
        const envIssues = this.checkEnvironmentSetup();
        this.issues.push(...envIssues);
    }

    getAllFiles(dir, extensions) {
        let files = [];
        const items = fs.readdirSync(dir);

        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                files = files.concat(this.getAllFiles(fullPath, extensions));
            } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
                files.push(fullPath);
            }
        });

        return files;
    }

    // Generate report
    generateReport() {
        console.log(`\n${colors.bold}${colors.cyan}================================`);
        console.log(`     REACT ERROR DEBUG REPORT`);
        console.log(`================================${colors.reset}\n`);

        log.info(`Scanned ${this.checkedFiles} files`);
        
        if (this.issues.length === 0) {
            log.success('No issues found! Your code looks good.');
            return;
        }

        log.warning(`Found ${this.issues.length} potential issues\n`);

        // Group issues by severity
        const grouped = this.issues.reduce((acc, issue) => {
            if (!acc[issue.severity]) acc[issue.severity] = [];
            acc[issue.severity].push(issue);
            return acc;
        }, {});

        // Report high severity issues first
        ['high', 'medium', 'low'].forEach(severity => {
            if (!grouped[severity]) return;

            const color = severity === 'high' ? colors.red : 
                          severity === 'medium' ? colors.yellow : colors.blue;
            
            console.log(`${color}${colors.bold}${severity.toUpperCase()} SEVERITY ISSUES (${grouped[severity].length})${colors.reset}\n`);

            grouped[severity].forEach((issue, index) => {
                console.log(`${index + 1}. ${colors.bold}${issue.issue}${colors.reset}`);
                console.log(`   File: ${issue.file}`);
                console.log(`   Type: ${issue.type}`);
                log.fix(issue.fix);
                console.log();
            });
        });

        // Provide summary with quick fixes
        console.log(`${colors.bold}${colors.cyan}QUICK FIXES SUMMARY${colors.reset}\n`);
        
        const highIssues = grouped.high || [];
        if (highIssues.length > 0) {
            log.error(`HIGH PRIORITY: Fix ${highIssues.length} critical issues first`);
            highIssues.forEach((issue, index) => {
                console.log(`   ${index + 1}. ${issue.fix}`);
            });
            console.log();
        }

        console.log(`${colors.cyan}For detailed React error explanations:${colors.reset}`);
        console.log(`   • React #301: https://react.dev/errors/301`);
        console.log(`   • React Error Decoder: https://reactjs.org/docs/error-decoder.html\n`);

        console.log(`${colors.cyan}For Supabase debugging:${colors.reset}`);
        console.log(`   • Check browser Network tab for actual request URLs`);
        console.log(`   • Verify RLS policies in Supabase dashboard`);
        console.log(`   • Test queries in Supabase SQL editor\n`);
    }
}

// Main execution
function main() {
    const debugger = new ReactErrorDebugger();
    
    // Scan the frontend source directory
    const frontendSrc = 'apps/frontend/src';
    if (fs.existsSync(frontendSrc)) {
        debugger.scanDirectory(frontendSrc);
    } else {
        log.error(`Frontend source directory not found: ${frontendSrc}`);
        log.info('Make sure you\'re running this script from the project root');
        process.exit(1);
    }
    
    debugger.generateReport();

    // Exit with error code if high-severity issues found
    const highSeverityCount = debugger.issues.filter(i => i.severity === 'high').length;
    if (highSeverityCount > 0) {
        log.error(`Found ${highSeverityCount} high-severity issues that need immediate attention`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = ReactErrorDebugger;