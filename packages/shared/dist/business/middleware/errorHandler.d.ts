import { Request, Response, NextFunction } from 'express';
/**
 * Centralized error handling middleware
 */
export declare const errorHandler: (error: Error, req: Request, res: Response, next: NextFunction) => void;
/**
 * Async wrapper to catch errors in async route handlers
 */
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Not found handler middleware
 */
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Request validation middleware factory
 */
export declare const validateRequest: (schema: any, source?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Business rules validation middleware factory
 */
export declare const validateBusinessRules: (validator: Function) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Rate limiting middleware factory
 */
export declare const createRateLimiter: (windowMs: number, max: number, message?: string) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Success response helper
 */
export declare const sendSuccess: (res: Response, data: any, message?: string, statusCode?: number) => void;
/**
 * Pagination response helper
 */
export declare const sendPaginatedResponse: (res: Response, data: any[], pagination: {
    limit: number;
    offset: number;
    total?: number;
}, message?: string) => void;
