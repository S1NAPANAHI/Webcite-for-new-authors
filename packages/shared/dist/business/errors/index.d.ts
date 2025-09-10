export declare enum ErrorCode {
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    INVALID_TOKEN = "INVALID_TOKEN",
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_INPUT = "INVALID_INPUT",
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
    BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION",
    SUBSCRIPTION_LIMIT_EXCEEDED = "SUBSCRIPTION_LIMIT_EXCEEDED",
    CONTENT_ACCESS_DENIED = "CONTENT_ACCESS_DENIED",
    PRICING_ERROR = "PRICING_ERROR",
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
    DUPLICATE_RESOURCE = "DUPLICATE_RESOURCE",
    DATA_INTEGRITY_ERROR = "DATA_INTEGRITY_ERROR",
    PAYMENT_PROCESSING_ERROR = "PAYMENT_PROCESSING_ERROR",
    EMAIL_SERVICE_ERROR = "EMAIL_SERVICE_ERROR",
    STORAGE_SERVICE_ERROR = "STORAGE_SERVICE_ERROR",
    DATABASE_ERROR = "DATABASE_ERROR",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
}
export declare class BaseError extends Error {
    readonly code: ErrorCode;
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly context?: Record<string, any>;
    constructor(message: string, code: ErrorCode, statusCode: number, isOperational?: boolean, context?: Record<string, any>);
}
export declare class ValidationError extends BaseError {
    constructor(message: string, context?: Record<string, any>);
}
export declare class AuthenticationError extends BaseError {
    constructor(message?: string, context?: Record<string, any>);
}
export declare class AuthorizationError extends BaseError {
    constructor(message?: string, context?: Record<string, any>);
}
export declare class BusinessRuleError extends BaseError {
    constructor(message: string, context?: Record<string, any>);
}
export declare class ResourceNotFoundError extends BaseError {
    constructor(resource: string, identifier?: string, context?: Record<string, any>);
}
export declare class PaymentError extends BaseError {
    constructor(message: string, context?: Record<string, any>);
}
export declare class DatabaseError extends BaseError {
    constructor(message: string, context?: Record<string, any>);
}
export declare class RateLimitError extends BaseError {
    constructor(message?: string, context?: Record<string, any>);
}
//# sourceMappingURL=index.d.ts.map