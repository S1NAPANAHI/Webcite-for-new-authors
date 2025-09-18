import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthenticationError, AuthorizationError, DatabaseError } from '../errors';
import { BusinessRulesEngine } from '../rules';
import { Database } from '../../database.types';

type UserRole = Database['public']['Enums']['user_role'];

// Define a custom error class if not already defined
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

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
export const authenticate = (supabase: SupabaseClient) => {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Authentication token required');
      }

      const token = authHeader.split(' ')[1];
      
      if (!token) {
        throw new AuthenticationError('Invalid authentication token format');
      }

      // Verify token with Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        throw new AuthenticationError('Invalid or expired token');
      }

      // Get user profile and role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, display_name, username, beta_reader_status')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, this might be a new user
        console.warn(`Profile not found for user ${user.id}, creating...`);
        // Note: Profile creation should be handled elsewhere, not in auth middleware
        throw new AuthenticationError('User profile not found');
      }

      // Attach user info to request
      req.user = {
        id: user.id,
        email: user.email || '',
        role: profile.role,
        profile
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Authorization middleware factory for role-based access
 */
export const authorize = (allowedRoles: UserRole[] | UserRole) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      if (!roles.includes(req.user.role)) {
        throw new AuthorizationError('Insufficient permissions for this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Resource ownership middleware
 */
export const authorizeResourceOwnership = (resourceIdParam: string = 'id', allowAdminAccess: boolean = true) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      const resourceId = req.params[resourceIdParam] || req.body['user_id'] || req.query['user_id'];
      
      // User can access their own resources
      if (resourceId === req.user.id) {
        next();
        return;
      }

      // Admin/Super admin can access any resource if allowed
      if (allowAdminAccess && ['admin', 'super_admin'].includes(req.user.role)) {
        next();
        return;
      }

      throw new AuthorizationError('Access denied: Resource ownership required');
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Action-based authorization using business rules
 */
export const authorizeAction = (action: string, getTargetUserRole?: (req: AuthenticatedRequest) => Promise<UserRole>) => {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      let targetUserRole: UserRole | undefined;
      
      if (getTargetUserRole) {
        targetUserRole = await getTargetUserRole(req);
      }

      const canPerformAction = BusinessRulesEngine.user.canPerformAction(
        req.user.role,
        action,
        targetUserRole
      );

      if (!canPerformAction) {
        throw new AuthorizationError(`Insufficient permissions to perform action: ${action}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Subscription access middleware
 */
export const authorizeSubscriptionAccess = (supabase: SupabaseClient) => {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      // Admins can access any subscription
      if (['admin', 'super_admin'].includes(req.user.role)) {
        next();
        return;
      }

      const subscriptionId = req.params['id'] || req.params['subscriptionId'];
      
      if (!subscriptionId) {
        throw new AuthorizationError('Subscription ID required');
      }

      // Check if user owns the subscription
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('id', subscriptionId)
        .single();

      if (error) {
        throw new DatabaseError('Failed to verify subscription ownership');
      }

      if ((subscription as any)['user_id'] !== req.user.id) {
        throw new AuthorizationError('Access denied: Subscription ownership required');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Content access middleware
 */
export const authorizeContentAccess = (supabase: SupabaseClient, contentType: string) => {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      // Public content is accessible to everyone
      if (contentType === 'public') {
        next();
        return;
      }

      if (!req.user) {
        throw new AuthenticationError('Authentication required for this content');
      }

      // Get user's subscription status
      const { data: subscription, error: _subscriptionError } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', req.user.id)
        .eq('status', 'active')
        .single();

      const subscriptionStatus = subscription?.status;

      const canAccess = BusinessRulesEngine.content.canAccessContent(
        req.user.role,
        contentType,
        subscriptionStatus
      );

      if (!canAccess) {
        throw new AuthorizationError('Insufficient permissions to access this content');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Rate limiting middleware with user-based limits
 */
export const createUserRateLimiter = (
  baseWindowMs: number,
  getMaxRequests: (userRole: UserRole) => number
) => {
  const requests = new Map();

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || req.ip || 'anonymous';
      const userRole = req.user?.role || 'user';
      const maxRequests = getMaxRequests(userRole);
      
      const now = Date.now();
      const windowStart = now - baseWindowMs;
      
      // Clean old entries
      if (requests.has(userId)) {
        const userRequests = requests.get(userId).filter((time: number) => time > windowStart);
        requests.set(userId, userRequests);
      } else {
        requests.set(userId, []);
      }
      
      const userRequests = requests.get(userId);
      
      if (userRequests.length >= maxRequests) {
        const retryAfter = Math.ceil(baseWindowMs / 1000);
        res.set('Retry-After', retryAfter.toString());
        
        throw new AuthorizationError('Rate limit exceeded', {
          limit: maxRequests,
          windowMs: baseWindowMs,
          retryAfter
        });
      }
      
      userRequests.push(now);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Input sanitization middleware
 */
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Recursively sanitize object
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        // Remove potentially dangerous characters
        return obj
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
          .replace(/javascript:/gi, '') // Remove javascript: protocols
          .replace(/on\w+\s*=/gi, '') // Remove event handlers
          .trim();
      }
      
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }
      
      if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
          // Sanitize key names
          const cleanKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
          sanitized[cleanKey] = sanitizeObject(value);
        }
        return sanitized;
      }
      
      return obj;
    };

    // Sanitize request body, query, and params
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    next(new ValidationError('Input sanitization failed'));
  }
};

/**
 * Request ID middleware for tracking
 */
export const addRequestId = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || 
    `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  req.headers['x-request-id'] = requestId;
  res.set('X-Request-ID', requestId);
  
  next();
};

/**
 * Security headers middleware
 */
export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  // Add security headers
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  });
  
  next();
};
