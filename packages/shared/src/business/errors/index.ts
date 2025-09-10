export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Business Logic
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  SUBSCRIPTION_LIMIT_EXCEEDED = 'SUBSCRIPTION_LIMIT_EXCEEDED',
  CONTENT_ACCESS_DENIED = 'CONTENT_ACCESS_DENIED',
  PRICING_ERROR = 'PRICING_ERROR',

  // Data & Resources
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  DATA_INTEGRITY_ERROR = 'DATA_INTEGRITY_ERROR',

  // External Services
  PAYMENT_PROCESSING_ERROR = 'PAYMENT_PROCESSING_ERROR',
  EMAIL_SERVICE_ERROR = 'EMAIL_SERVICE_ERROR',
  STORAGE_SERVICE_ERROR = 'STORAGE_SERVICE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',

  // System
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

export class BaseError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context: Record<string, any> | undefined;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
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
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, true, context);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string = 'Authentication required', context?: Record<string, any>) {
    super(message, ErrorCode.UNAUTHORIZED, 401, true, context);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message: string = 'Insufficient permissions', context?: Record<string, any>) {
    super(message, ErrorCode.FORBIDDEN, 403, true, context);
  }
}

export class BusinessRuleError extends BaseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.BUSINESS_RULE_VIOLATION, 422, true, context);
  }
}

export class ResourceNotFoundError extends BaseError {
  constructor(resource: string, identifier?: string, context?: Record<string, any>) {
    const message = identifier 
      ? `${resource} with ID '${identifier}' not found`
      : `${resource} not found`;
    super(message, ErrorCode.RESOURCE_NOT_FOUND, 404, true, context);
  }
}

export class PaymentError extends BaseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.PAYMENT_PROCESSING_ERROR, 402, true, context);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.DATABASE_ERROR, 500, false, context);
  }
}

export class RateLimitError extends BaseError {
  constructor(message: string = 'Rate limit exceeded', context?: Record<string, any>) {
    super(message, ErrorCode.RATE_LIMIT_EXCEEDED, 429, true, context);
  }
}
