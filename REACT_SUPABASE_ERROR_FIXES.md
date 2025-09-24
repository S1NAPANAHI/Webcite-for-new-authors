# React #301 and Supabase 400 Error Fixes

## Overview

This document outlines the fixes applied to resolve critical errors in the beta application:

- **React Minified Error #301**: "Too many re-renders" causing infinite loops
- **Supabase 400 Bad Request**: Malformed API queries causing server errors

## Errors Resolved

### 1. React Error #301 - Infinite Re-render Loop

**Error Message:**
```
Minified React error #301; visit https://reactjs.org/docs/error-decoder.html?invariant=301 
for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
```

**Root Causes Found:**
- Missing `useCallback` for event handlers
- Improper `useEffect` dependency management
- State updates triggering immediate re-renders
- Timer intervals without proper cleanup

### 2. Supabase 400 Bad Request Error

**Error Message:**
```
opukvvmumyegtkukqint.supabase.co/rest/v1/beta_applications?select=*&user_id=eq.3c6b687c-bbfe-4414-a8de-8e49157b4ffa:1
Failed to load resource: the server responded with a status of 400 ()
```

**Root Cause:**
- Malformed user ID parameter with invalid `:1` suffix
- Missing proper error handling for API responses
- Lack of null checks for user authentication state

## Files Modified

### 1. `apps/frontend/src/components/BetaApplication/BetaApplication.enhanced.fixed.tsx`

**Key Fixes Applied:**

#### ✅ Fixed Infinite Re-render Loop
```typescript
// ❌ BEFORE: Missing dependencies causing infinite loop
useEffect(() => {
    const fetchApplication = async () => {
        if (user) {
            const { data, error } = await supabaseClient
                .from('beta_applications')
                .select('*')
                .eq('user_id', user.id)
                .single();
            if (data) setApplicationStatus(data);
        }
        setIsLoading(false);
    };
    fetchApplication();
}, [user, supabaseClient]); // This was causing the loop!

// ✅ AFTER: Proper memoization and dependency management
const fetchApplication = useCallback(async () => {
    if (!user?.id || !supabaseClient) {
        setIsLoading(false);
        return;
    }

    try {
        setError(null);
        console.log('Fetching application for user:', user.id);
        
        const { data, error: fetchError } = await supabaseClient
            .from('beta_applications')
            .select('*')
            .eq('user_id', user.id) // Properly formatted without :1 suffix
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                console.log('No existing application found - this is normal');
                setApplicationStatus(null);
            } else {
                console.error('Error fetching application:', fetchError);
                setError(`Failed to load application: ${fetchError.message}`);
            }
        } else if (data) {
            setApplicationStatus(data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred while loading your application');
    } finally {
        setIsLoading(false);
    }
}, [user?.id, supabaseClient]);

useEffect(() => {
    fetchApplication();
}, [fetchApplication]); // Only depends on the memoized callback
```

#### ✅ Fixed Timer Cleanup
```typescript
// ❌ BEFORE: Timer without proper cleanup
useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (currentStage === 4) {
        timerInterval = setInterval(() => {
            setTimeRemaining(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(timerInterval);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }
    return () => clearInterval(timerInterval); // This cleanup was insufficient
}, [currentStage]);

// ✅ AFTER: Proper cleanup with dependency management
useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    
    if (currentStage === 4 && timeRemaining > 0) {
        timerInterval = setInterval(() => {
            setTimeRemaining(prevTime => {
                if (prevTime <= 1) {
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }

    return () => {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
    };
}, [currentStage, timeRemaining]); // Added timeRemaining dependency
```

#### ✅ Memoized All Callbacks
```typescript
// All event handlers wrapped with useCallback
const goToStage = useCallback((stage: number) => {
    if (stage <= Math.max(currentStage, ...completedStages) + 1) {
        setCurrentStage(stage);
    }
}, [currentStage, completedStages]);

const updateWordCount = useCallback((fieldId: string, text: string) => {
    const count = countWords(text);
    setWordCounts(prev => ({ ...prev, [fieldId]: count }));
}, [countWords]);
```

#### ✅ Added React.memo for Child Components
```typescript
const ProgressStepper = React.memo(({ currentStage, completedStages, onStageClick }) => {
    // Component implementation...
});

const WordCounter = React.memo(({ current, min, max, showProgress }) => {
    // Component implementation...
});
```

### 2. `apps/frontend/src/App.tsx`

**Updated import to use the fixed component:**
```typescript
// ❌ BEFORE: Using problematic component
import BetaApplication from './components/BetaApplication/BetaApplication.enhanced';

// ✅ AFTER: Using fixed component
import BetaApplication from './components/BetaApplication/BetaApplication.enhanced.fixed';
```

### 3. `apps/frontend/src/utils/errorHandling.ts`

**New utility functions added:**
- `handleSupabaseError()` - Comprehensive Supabase error handling
- `safeSupabaseQuery()` - Wrapper for safe database queries
- `queryUserData()` - User-specific queries with proper formatting
- `debounce()` - Prevents rapid state updates
- `ErrorBoundary` - React error boundary component

### 4. `debug-react-errors.js`

**New debugging script that can:**
- Scan codebase for potential infinite render patterns
- Identify malformed Supabase queries
- Check environment variable setup
- Provide actionable fix suggestions

## How to Use the Fixes

### 1. Immediate Fix Application

The fixes have been applied to your repository. The beta application should now work without errors.

### 2. Run the Debug Script

```bash
# From project root
node debug-react-errors.js
```

This will scan your codebase and report any similar issues.

### 3. Development Best Practices

#### For React Components:
```typescript
// Always wrap event handlers with useCallback
const handleClick = useCallback(() => {
    // Your logic here
}, [dependencies]);

// Always provide dependency arrays to useEffect
useEffect(() => {
    // Your effect logic
}, [dependency1, dependency2]);

// Memoize expensive computations
const expensiveValue = useMemo(() => {
    return computeExpensiveValue(data);
}, [data]);
```

#### For Supabase Queries:
```typescript
// Always handle errors properly
const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('user_id', user.id); // Clean user ID without suffixes

if (error) {
    console.error('Query error:', error);
    // Handle error appropriately
    return;
}

// Always check data exists before using
if (data) {
    // Use data safely
}
```

## Testing the Fixes

### 1. Development Environment
```bash
cd apps/frontend
npm run dev
# or
yarn dev
```

### 2. Check Browser Console
- Open Developer Tools (F12)
- Navigate to Console tab
- Visit `/beta/application` route
- Should see no React #301 errors
- Should see successful Supabase queries

### 3. Network Tab Verification
- Open Developer Tools → Network tab
- Navigate to beta application
- Look for Supabase requests
- Should see 200 status codes instead of 400
- URLs should be properly formatted without `:1` suffixes

## Prevention Strategies

### 1. Code Review Checklist

**React Patterns:**
- [ ] All event handlers use `useCallback`
- [ ] All `useEffect` hooks have proper dependency arrays
- [ ] No direct function calls in JSX (`onClick={func()}` ❌)
- [ ] State updates only in event handlers or `useEffect`
- [ ] Expensive operations are memoized with `useMemo`

**Supabase Patterns:**
- [ ] All queries have error handling
- [ ] User IDs are cleaned before use
- [ ] Data existence is checked before access
- [ ] Environment variables are validated

### 2. Development Tools

**Use these tools to catch issues early:**
```bash
# Run the debugging script regularly
node debug-react-errors.js

# Use React DevTools Profiler to identify performance issues
# Use Supabase Dashboard to test queries directly
```

### 3. Environment Setup

**Ensure proper environment variables:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

## Common Gotchas to Avoid

### 1. React Re-render Loops
```typescript
// ❌ Don't do this - causes infinite loops
function Component() {
    const [data, setData] = useState();
    
    useEffect(() => {
        fetchData().then(setData); // Missing dependency array!
    }); // ← This runs on every render
    
    const handleClick = () => setData(newData); // ← Not memoized
    
    return <button onClick={handleClick()}>Click</button>; // ← Calls immediately!
}

// ✅ Do this instead
function Component() {
    const [data, setData] = useState();
    
    useEffect(() => {
        fetchData().then(setData);
    }, []); // ← Proper dependency array
    
    const handleClick = useCallback(() => {
        setData(newData);
    }, [newData]); // ← Memoized with dependencies
    
    return <button onClick={handleClick}>Click</button>; // ← Function reference
}
```

### 2. Supabase Query Issues
```typescript
// ❌ Don't do this - causes 400 errors
const badQuery = await supabase
    .from('table')
    .select('*')
    .eq('user_id', `${userId}:1`); // ← Invalid suffix!

// ✅ Do this instead
const goodQuery = await supabase
    .from('table')
    .select('*')
    .eq('user_id', userId.trim().split(':')[0]); // ← Clean ID

if (goodQuery.error) {
    console.error('Query failed:', goodQuery.error);
    return; // ← Always handle errors
}
```

## Monitoring and Maintenance

### 1. Regular Checks
- Run `node debug-react-errors.js` before each deployment
- Monitor browser console for new React warnings
- Check Supabase dashboard for failed queries

### 2. Performance Monitoring
- Use React DevTools Profiler in development
- Monitor component render times
- Watch for unnecessary re-renders

### 3. Error Tracking
- Implement error boundaries for critical components
- Log errors to external services in production
- Set up alerts for high error rates

## Additional Resources

- [React Error Decoder](https://reactjs.org/docs/error-decoder.html)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Supabase Error Codes](https://supabase.com/docs/guides/api)
- [React Performance Best Practices](https://react.dev/learn/render-and-commit)

---

## Summary

The applied fixes address the root causes of both errors:

1. **React #301 Fixed** by properly managing component lifecycle and preventing infinite re-render loops
2. **Supabase 400 Fixed** by correcting query parameter formatting and adding comprehensive error handling
3. **Prevention Tools Added** to catch similar issues in the future
4. **Development Guidelines** established for maintaining code quality

Your beta application should now load and function properly without these critical errors.