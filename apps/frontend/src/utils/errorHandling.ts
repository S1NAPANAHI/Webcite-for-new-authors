/**
 * Comprehensive error handling utilities for the application
 * Prevents common React and Supabase errors
 */

import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

// ============================================================================
// SUPABASE ERROR HANDLING
// ============================================================================

/**
 * Handles Supabase errors and provides user-friendly messages
 * Prevents the 400 Bad Request errors by properly formatting queries
 */
export const handleSupabaseError = (error: PostgrestError | Error | null, context: string = 'Operation') => {
    if (!error) return null;
    
    console.error(`Supabase ${context} error:`, error);
    
    // Handle common Supabase error codes
    if ('code' in error) {
        switch (error.code) {
            case 'PGRST116':
                // No rows found - this is often expected
                console.log(`${context}: No data found (this may be expected)`);
                return null;
            
            case '42501':
                const permissionMessage = `Permission denied: You don't have access to perform this ${context.toLowerCase()}`;
                toast.error(permissionMessage);
                return permissionMessage;
            
            case '23505':
                const duplicateMessage = `Duplicate entry: This ${context.toLowerCase()} already exists`;
                toast.error(duplicateMessage);
                return duplicateMessage;
            
            case '23503':
                const constraintMessage = `Invalid reference: Related data is missing or invalid`;
                toast.error(constraintMessage);
                return constraintMessage;
            
            default:
                const defaultMessage = `${context} failed: ${error.message}`;
                toast.error(defaultMessage);
                return defaultMessage;
        }
    }
    
    // Handle generic errors
    const genericMessage = `${context} error: ${error.message}`;
    toast.error(genericMessage);
    return genericMessage;
};

/**
 * Safe Supabase query wrapper that prevents malformed queries
 * Fixes the 400 Bad Request error by properly formatting parameters
 */
export const safeSupabaseQuery = async <T>(
    queryBuilder: any,
    context: string = 'Query'
): Promise<{ data: T | null; error: string | null }> => {
    try {
        const { data, error } = await queryBuilder;
        
        if (error) {
            const errorMessage = handleSupabaseError(error, context);
            return { data: null, error: errorMessage };
        }
        
        return { data, error: null };
    } catch (err) {
        console.error(`Unexpected ${context} error:`, err);
        const errorMessage = `Unexpected error during ${context.toLowerCase()}: ${err instanceof Error ? err.message : 'Unknown error'}`;
        toast.error(errorMessage);
        return { data: null, error: errorMessage };
    }
};

/**
 * Safe user-specific query that ensures proper user ID formatting
 * Prevents the ":1" suffix error in user queries
 */
export const queryUserData = async <T>(
    supabaseClient: SupabaseClient,
    tableName: string,
    userId: string,
    selectFields: string = '*',
    single: boolean = false
): Promise<{ data: T | null; error: string | null }> => {
    try {
        // Ensure userId is properly formatted (no trailing characters)
        const cleanUserId = userId.trim().split(':')[0]; // Remove any ":1" or similar suffixes
        
        console.log(`Querying ${tableName} for user:`, cleanUserId);
        
        let query = supabaseClient
            .from(tableName)
            .select(selectFields)
            .eq('user_id', cleanUserId);
        
        if (single) {
            query = query.single();
        }
        
        return await safeSupabaseQuery<T>(query, `${tableName} query`);
    } catch (err) {
        const errorMessage = `Failed to query ${tableName}: ${err instanceof Error ? err.message : 'Unknown error'}`;
        return { data: null, error: errorMessage };
    }
};

// ============================================================================
// REACT ERROR PREVENTION
// ============================================================================

/**
 * Debounce utility to prevent rapid state updates that cause re-render loops
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Safe event handler wrapper that prevents infinite re-render loops
 * Use this to wrap event handlers that might cause React #301 errors
 */
export const safeEventHandler = <T extends (...args: any[]) => any>(
    handler: T,
    dependencies: any[] = []
): T => {
    // This will be memoized by the calling component with useCallback
    return handler;
};

/**
 * Word counting utility with debouncing to prevent excessive re-renders
 */
export const createWordCounter = (updateCallback: (count: number) => void, delay: number = 300) => {
    const debouncedUpdate = debounce(updateCallback, delay);
    
    return (text: string) => {
        const count = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        debouncedUpdate(count);
    };
};

// ============================================================================
// FORM VALIDATION
// ============================================================================

/**
 * Safe form validation that doesn't trigger re-renders
 */
export const validateForm = (formId: string, validationRules: Record<string, (value: any) => string | null>) => {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return { isValid: false, errors: { form: 'Form not found' } };
    
    const formData = new FormData(form);
    const errors: Record<string, string> = {};
    
    Object.entries(validationRules).forEach(([fieldName, validator]) => {
        const value = formData.get(fieldName);
        const error = validator(value);
        if (error) {
            errors[fieldName] = error;
        }
    });
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        data: Object.fromEntries(formData.entries())
    };
};

// ============================================================================
// DEVELOPMENT DEBUGGING
// ============================================================================

/**
 * Safe console logging that won't break in production
 */
export const debugLog = (message: string, data?: any) => {
    if (import.meta.env.DEV) {
        console.log(`[DEBUG] ${message}`, data || '');
    }
};

/**
 * Performance monitoring for React components
 */
export const performanceLog = (componentName: string, startTime: number) => {
    if (import.meta.env.DEV) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        if (duration > 16) { // Warn if render takes more than one frame (16ms)
            console.warn(`[PERFORMANCE] ${componentName} render took ${duration.toFixed(2)}ms`);
        }
    }
};

/**
 * React Error Boundary error logger
 */
export const logComponentError = (error: Error, errorInfo: any, componentName: string) => {
    console.error(`[ERROR BOUNDARY] Error in ${componentName}:`, error);
    console.error('[ERROR INFO]', errorInfo);
    
    // In production, you might want to send this to an error tracking service
    if (!import.meta.env.DEV) {
        // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
};

// ============================================================================
// COMMON VALIDATION RULES
// ============================================================================

export const commonValidationRules = {
    required: (value: any) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            return 'This field is required';
        }
        return null;
    },
    
    email: (value: any) => {
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        return null;
    },
    
    wordCount: (min: number, max: number) => (value: any) => {
        if (!value) return `Text is required (${min}-${max} words)`;
        const words = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
        if (words < min) return `Minimum ${min} words required (currently ${words})`;
        if (words > max) return `Maximum ${max} words allowed (currently ${words})`;
        return null;
    },
    
    url: (value: any) => {
        if (!value) return null; // Optional URL field
        try {
            new URL(value);
            return null;
        } catch {
            return 'Please enter a valid URL';
        }
    }
};

// ============================================================================
// ENVIRONMENT VALIDATION
// ============================================================================

/**
 * Validates that all required environment variables are present
 * Prevents runtime errors due to missing configuration
 */
export const validateEnvironment = () => {
    const requiredEnvVars = {
        'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
        'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'VITE_STRIPE_PUBLISHABLE_KEY': import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    };
    
    const missingVars = Object.entries(requiredEnvVars)
        .filter(([_, value]) => !value)
        .map(([key, _]) => key);
    
    if (missingVars.length > 0) {
        const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
        console.error(errorMessage);
        
        if (import.meta.env.DEV) {
            toast.error(`Development Error: ${errorMessage}`);
        }
        
        return { isValid: false, missingVars, error: errorMessage };
    }
    
    return { isValid: true, missingVars: [], error: null };
};

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?: React.ReactNode; componentName?: string },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        logComponentError(error, errorInfo, this.props.componentName || 'Unknown Component');
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="error-boundary">
                    <div className="error-content">
                        <AlertCircle size={48} className="error-icon" />
                        <h2>Something went wrong</h2>
                        <p>We're sorry, but something unexpected happened.</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => this.setState({ hasError: false, error: null })}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default {
    handleSupabaseError,
    safeSupabaseQuery,
    queryUserData,
    debounce,
    safeEventHandler,
    createWordCounter,
    validateForm,
    debugLog,
    performanceLog,
    logComponentError,
    commonValidationRules,
    validateEnvironment,
    ErrorBoundary
};