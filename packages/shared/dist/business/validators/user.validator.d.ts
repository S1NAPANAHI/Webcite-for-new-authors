import { z } from 'zod';
export declare const UserProfileSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    display_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    website: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    role: z.ZodDefault<z.ZodEnum<{
        admin: "admin";
        support: "support";
        accountant: "accountant";
        user: "user";
        super_admin: "super_admin";
    }>>;
    beta_reader_status: z.ZodDefault<z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        not_applied: "not_applied";
        rejected: "rejected";
    }>>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UserStatsSchema: z.ZodObject<{
    user_id: z.ZodString;
    books_read: z.ZodDefault<z.ZodNumber>;
    reading_hours: z.ZodDefault<z.ZodNumber>;
    achievements: z.ZodDefault<z.ZodNumber>;
    currently_reading: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const BetaApplicationSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodString;
    full_name: z.ZodString;
    time_zone: z.ZodString;
    country: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    devices: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    hours_per_week: z.ZodString;
    communication: z.ZodString;
    portal_use: z.ZodString;
    beta_commitment: z.ZodString;
    interest_statement: z.ZodString;
    feedback_philosophy: z.ZodString;
    recent_reads: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    prior_beta: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    goodreads: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    demographics: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    access_needs: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        denied: "denied";
    }>>;
    created_at: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateUserProfileSchema: z.ZodObject<{
    updated_at: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    avatar_url: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    beta_reader_status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        not_applied: "not_applied";
        rejected: "rejected";
    }>>>;
    display_name: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    username: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    website: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, z.core.$strip>;
export declare const UpdateUserRoleSchema: z.ZodObject<{
    user_id: z.ZodString;
    role: z.ZodEnum<{
        admin: "admin";
        support: "support";
        accountant: "accountant";
        user: "user";
        super_admin: "super_admin";
    }>;
    granted_by: z.ZodString;
}, z.core.$strip>;
export declare const UserQuerySchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<{
        admin: "admin";
        support: "support";
        accountant: "accountant";
        user: "user";
        super_admin: "super_admin";
    }>>;
    beta_reader_status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        not_applied: "not_applied";
        rejected: "rejected";
    }>>;
    limit: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    offset: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    search: z.ZodOptional<z.ZodString>;
    sort_by: z.ZodDefault<z.ZodEnum<{
        created_at: "created_at";
        display_name: "display_name";
        role: "role";
        username: "username";
    }>>;
    sort_order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const validateUserBusinessRules: (profile: z.infer<typeof UserProfileSchema>) => {
    isValid: boolean;
    errors: string[];
};
export declare const validateBetaApplicationBusinessRules: (application: z.infer<typeof BetaApplicationSchema>) => {
    isValid: boolean;
    errors: string[];
};
export type UserProfileInput = z.infer<typeof UserProfileSchema>;
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;
export type UserStatsInput = z.infer<typeof UserStatsSchema>;
export type BetaApplicationInput = z.infer<typeof BetaApplicationSchema>;
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
export type UserQuery = z.infer<typeof UserQuerySchema>;
