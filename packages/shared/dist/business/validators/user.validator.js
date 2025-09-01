import { z } from 'zod';
// User profile validation schema
export const UserProfileSchema = z.object({
    id: z.string().uuid(),
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
        .optional()
        .nullable(),
    display_name: z.string()
        .min(1, 'Display name is required')
        .max(100, 'Display name must be less than 100 characters')
        .trim()
        .optional()
        .nullable(),
    avatar_url: z.string().url('Invalid avatar URL').optional().nullable(),
    website: z.string().url('Invalid website URL').optional().nullable(),
    role: z.enum(['admin', 'support', 'accountant', 'user', 'super_admin']).default('user'),
    beta_reader_status: z.enum(['not_applied', 'pending', 'approved', 'rejected']).default('not_applied'),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional()
});
// User stats validation schema
export const UserStatsSchema = z.object({
    user_id: z.string().uuid(),
    books_read: z.number().min(0, 'Books read cannot be negative').default(0),
    reading_hours: z.number().min(0, 'Reading hours cannot be negative').default(0),
    achievements: z.number().min(0, 'Achievements cannot be negative').default(0),
    currently_reading: z.string().max(255).default('')
});
// Beta application validation schema
export const BetaApplicationSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid().optional().nullable(),
    email: z.string().email('Invalid email address'),
    full_name: z.string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters')
        .trim(),
    time_zone: z.string()
        .min(1, 'Time zone is required')
        .max(50, 'Time zone must be less than 50 characters'),
    country: z.string()
        .max(100, 'Country must be less than 100 characters')
        .optional()
        .nullable(),
    devices: z.array(z.string()).optional().nullable(),
    hours_per_week: z.string()
        .min(1, 'Hours per week is required'),
    communication: z.string()
        .min(10, 'Communication preference must be at least 10 characters')
        .max(500, 'Communication preference must be less than 500 characters'),
    portal_use: z.string()
        .min(10, 'Portal use description must be at least 10 characters')
        .max(500, 'Portal use description must be less than 500 characters'),
    beta_commitment: z.string()
        .min(20, 'Beta commitment must be at least 20 characters')
        .max(1000, 'Beta commitment must be less than 1000 characters'),
    interest_statement: z.string()
        .min(50, 'Interest statement must be at least 50 characters')
        .max(2000, 'Interest statement must be less than 2000 characters'),
    feedback_philosophy: z.string()
        .min(50, 'Feedback philosophy must be at least 50 characters')
        .max(2000, 'Feedback philosophy must be less than 2000 characters'),
    recent_reads: z.string()
        .max(1000, 'Recent reads must be less than 1000 characters')
        .optional()
        .nullable(),
    prior_beta: z.string()
        .max(1000, 'Prior beta experience must be less than 1000 characters')
        .optional()
        .nullable(),
    goodreads: z.string()
        .url('Invalid Goodreads URL')
        .optional()
        .nullable(),
    demographics: z.string()
        .max(500, 'Demographics must be less than 500 characters')
        .optional()
        .nullable(),
    access_needs: z.string()
        .max(500, 'Access needs must be less than 500 characters')
        .optional()
        .nullable(),
    status: z.enum(['pending', 'approved', 'denied']).default('pending'),
    created_at: z.string().datetime().optional()
});
// User profile update schema
export const UpdateUserProfileSchema = UserProfileSchema.partial().omit({
    id: true,
    created_at: true,
    role: true // Role updates should be handled separately
});
// User role update schema (admin only)
export const UpdateUserRoleSchema = z.object({
    user_id: z.string().uuid(),
    role: z.enum(['admin', 'support', 'accountant', 'user', 'super_admin']),
    granted_by: z.string().uuid()
});
// User query parameters schema
export const UserQuerySchema = z.object({
    role: z.enum(['admin', 'support', 'accountant', 'user', 'super_admin']).optional(),
    beta_reader_status: z.enum(['not_applied', 'pending', 'approved', 'rejected']).optional(),
    limit: z.string()
        .transform(val => parseInt(val))
        .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
        .default(50),
    offset: z.string()
        .transform(val => parseInt(val))
        .refine(val => val >= 0, 'Offset must be non-negative')
        .default(0),
    search: z.string().max(100).optional(),
    sort_by: z.enum(['created_at', 'username', 'display_name', 'role']).default('created_at'),
    sort_order: z.enum(['asc', 'desc']).default('desc')
});
// User business rules validation
export const validateUserBusinessRules = (profile) => {
    const errors = [];
    // Admin users must have display names
    if (['admin', 'super_admin'].includes(profile.role) && !profile.display_name) {
        errors.push('Admin users must have a display name');
    }
    // Username uniqueness (would need database check)
    if (profile.username && profile.username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
// Beta application business rules validation
export const validateBetaApplicationBusinessRules = (application) => {
    const errors = [];
    // Check if user already has an approved application (would need database check)
    // This would be handled in the service layer
    // Validate email domain (optional business rule)
    const suspiciousDomains = ['tempmail.com', '10minutemail.com'];
    const emailDomain = application.email.split('@')[1];
    if (suspiciousDomains.includes(emailDomain)) {
        errors.push('Temporary email addresses are not allowed');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
