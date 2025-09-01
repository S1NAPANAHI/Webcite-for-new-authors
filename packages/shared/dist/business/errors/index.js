export var ErrorCode;
(function (ErrorCode) {
    // Authentication & Authorization
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["INVALID_TOKEN"] = "INVALID_TOKEN";
    ErrorCode["INSUFFICIENT_PERMISSIONS"] = "INSUFFICIENT_PERMISSIONS";
    // Validation
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["INVALID_INPUT"] = "INVALID_INPUT";
    ErrorCode["MISSING_REQUIRED_FIELD"] = "MISSING_REQUIRED_FIELD";
    // Business Logic
    ErrorCode["BUSINESS_RULE_VIOLATION"] = "BUSINESS_RULE_VIOLATION";
    ErrorCode["SUBSCRIPTION_LIMIT_EXCEEDED"] = "SUBSCRIPTION_LIMIT_EXCEEDED";
    ErrorCode["CONTENT_ACCESS_DENIED"] = "CONTENT_ACCESS_DENIED";
    ErrorCode["PRICING_ERROR"] = "PRICING_ERROR";
    // Data & Resources
    ErrorCode["RESOURCE_NOT_FOUND"] = "RESOURCE_NOT_FOUND";
    ErrorCode["DUPLICATE_RESOURCE"] = "DUPLICATE_RESOURCE";
    ErrorCode["DATA_INTEGRITY_ERROR"] = "DATA_INTEGRITY_ERROR";
    // External Services
    ErrorCode["PAYMENT_PROCESSING_ERROR"] = "PAYMENT_PROCESSING_ERROR";
    ErrorCode["EMAIL_SERVICE_ERROR"] = "EMAIL_SERVICE_ERROR";
    ErrorCode["STORAGE_SERVICE_ERROR"] = "STORAGE_SERVICE_ERROR";
    ErrorCode["DATABASE_ERROR"] = "DATABASE_ERROR";
    // System
    ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
    ErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
})(ErrorCode || (ErrorCode = {}));
export class BaseError extends Error {
    constructor(message, code, statusCode, isOperational = true, context) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.context = context;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends BaseError {
    constructor(message, context) {
        super(message, ErrorCode.VALIDATION_ERROR, 400, true, context);
    }
}
export class AuthenticationError extends BaseError {
    constructor(message = 'Authentication required', context) {
        super(message, ErrorCode.UNAUTHORIZED, 401, true, context);
    }
}
export class AuthorizationError extends BaseError {
    constructor(message = 'Insufficient permissions', context) {
        super(message, ErrorCode.FORBIDDEN, 403, true, context);
    }
}
export class BusinessRuleError extends BaseError {
    constructor(message, context) {
        super(message, ErrorCode.BUSINESS_RULE_VIOLATION, 422, true, context);
    }
}
export class ResourceNotFoundError extends BaseError {
    constructor(resource, identifier, context) {
        const message = identifier
            ? `${resource} with ID '${identifier}' not found`
            : `${resource} not found`;
        super(message, ErrorCode.RESOURCE_NOT_FOUND, 404, true, context);
    }
}
export class PaymentError extends BaseError {
    constructor(message, context) {
        super(message, ErrorCode.PAYMENT_PROCESSING_ERROR, 402, true, context);
    }
}
export class DatabaseError extends BaseError {
    constructor(message, context) {
        super(message, ErrorCode.DATABASE_ERROR, 500, false, context);
    }
}
export class RateLimitError extends BaseError {
    constructor(message = 'Rate limit exceeded', context) {
        super(message, ErrorCode.RATE_LIMIT_EXCEEDED, 429, true, context);
    }
}
