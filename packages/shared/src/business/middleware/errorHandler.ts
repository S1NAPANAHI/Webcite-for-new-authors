import { Request, Response, NextFunction } from 'express';
import { BaseError, ErrorCode } from '../errors/index.js';
import { ZodError } from 'zod';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Centralized error handling middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Generate request ID for tracking
  const requestId = req.headers['x-request-id'] as string || generateRequestId();

  // Log error for debugging
  console.error(`[${requestId}] Error occurred:`, {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: (req as any).user?.id,
    timestamp: new Date().toISOString()
  });

  let errorResponse: ErrorResponse;

  if (error instanceof BaseError) {
    // Handle custom application errors
    errorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.context,
        timestamp: new Date().toISOString(),
        requestId
      }
    };
    res.status(error.statusCode).json(errorResponse);
  } else if (error instanceof ZodError) {
    // Handle Zod validation errors
    errorResponse = {
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: {
          fieldErrors: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        },
        timestamp: new Date().toISOString(),
        requestId
      }
    };
    res.status(400).json(errorResponse);
  } else if (error.name === 'PostgrestError') {
    // Handle Supabase/PostgreSQL errors
    errorResponse = {
      success: false,
      error: {
        code: ErrorCode.DATABASE_ERROR,
        message: 'Database operation failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        timestamp: new Date().toISOString(),
        requestId
      }
    };
    res.status(500).json(errorResponse);
  } else if (error.name === 'StripeError') {
    // Handle Stripe errors
    const stripeError = error as any;
    errorResponse = {
      success: false,
      error: {
        code: ErrorCode.PAYMENT_PROCESSING_ERROR,
        message: 'Payment processing failed',
        details: {
          type: stripeError.type,
          code: stripeError.code,
          declineCode: stripeError.decline_code
        },
        timestamp: new Date().toISOString(),
        requestId
      }
    };
    res.status(402).json(errorResponse);
  } else {
    // Handle unexpected errors
    errorResponse = {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        timestamp: new Date().toISOString(),
        requestId
      }
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * Async wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found handler middleware
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: ErrorCode.RESOURCE_NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] as string || generateRequestId()
    }
  };
  res.status(404).json(errorResponse);
};

/**
 * Request validation middleware factory
 */
export const validateRequest = (schema: any, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[source];
      const validatedData = schema.parse(dataToValidate);
      
      // Replace the request data with validated and sanitized data
      req[source] = validatedData;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Business rules validation middleware factory
 */
export const validateBusinessRules = (validator: Function) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validation = validator(req.body);
      
      if (!validation.isValid) {
        const error = new BaseError(
          'Business rule validation failed',
          ErrorCode.BUSINESS_RULE_VIOLATION,
          422,
          true,
          { violations: validation.errors }
        );
        next(error);
        return;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Rate limiting middleware factory
 */
export const createRateLimiter = (windowMs: number, max: number, message?: string) => {
  const requests = new Map();
  
  return (req: Request, _res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    if (requests.has(key)) {
      const userRequests = requests.get(key).filter((time: number) => time > windowStart);
      requests.set(key, userRequests);
    } else {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key);
    
    if (userRequests.length >= max) {
      const error = new BaseError(
        message || 'Too many requests',
        ErrorCode.RATE_LIMIT_EXCEEDED,
        429,
        true,
        { limit: max, windowMs, retryAfter: Math.ceil(windowMs / 1000) }
      );
      next(error);
      return;
    }
    
    userRequests.push(now);
    next();
  };
};

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Success response helper
 */
export const sendSuccess = (res: Response, data: any, message?: string, statusCode: number = 200) => {
  res.status(statusCode).json({
    success: true,
    message: message || 'Operation successful',
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Pagination response helper
 */
export const sendPaginatedResponse = (
  res: Response,
  data: any[],
  pagination: { limit: number; offset: number; total?: number },
  message?: string
) => {
  res.json({
    success: true,
    message: message || 'Data retrieved successfully',
    data,
    pagination: {
      ...pagination,
      hasMore: data.length === pagination.limit,
      page: Math.floor(pagination.offset / pagination.limit) + 1,
      totalPages: pagination.total ? Math.ceil(pagination.total / pagination.limit) : undefined
    },
    timestamp: new Date().toISOString()
  });
};
