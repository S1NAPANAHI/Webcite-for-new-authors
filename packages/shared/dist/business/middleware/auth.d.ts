import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';
type UserRole = Database['public']['Enums']['user_role'];
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: UserRole;
        profile?: any;
    };
    headers: Request['headers'];
    params: Request['params'];
    body: Request['body'];
    query: Request['query'];
    ip: Request['ip'];
}
/**
 * Enhanced authentication middleware
 */
export declare const authenticate: (supabase: SupabaseClient) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Authorization middleware factory for role-based access
 */
export declare const authorize: (allowedRoles: UserRole[] | UserRole) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Resource ownership middleware
 */
export declare const authorizeResourceOwnership: (resourceIdParam?: string, allowAdminAccess?: boolean) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Action-based authorization using business rules
 */
export declare const authorizeAction: (action: string, getTargetUserRole?: (req: AuthenticatedRequest) => Promise<UserRole>) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Subscription access middleware
 */
export declare const authorizeSubscriptionAccess: (supabase: SupabaseClient) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Content access middleware
 */
export declare const authorizeContentAccess: (supabase: SupabaseClient, contentType: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Rate limiting middleware with user-based limits
 */
export declare const createUserRateLimiter: (baseWindowMs: number, getMaxRequests: (userRole: UserRole) => number) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Input sanitization middleware
 */
export declare const sanitizeInput: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Request ID middleware for tracking
 */
export declare const addRequestId: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Security headers middleware
 */
export declare const securityHeaders: (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=auth.d.ts.map