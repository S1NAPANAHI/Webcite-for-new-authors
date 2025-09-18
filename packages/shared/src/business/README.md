# Zoroasterverse Business Logic Layer

## 🎯 Overview

This directory contains the enhanced business logic layer for the Zoroasterverse platform, providing:
- **Input validation** with Zod schemas
- **Centralized error handling** with custom error types
- **Business rule enforcement** with a rules engine
- **Service layer architecture** for clean separation of concerns
- **Enhanced security** with authentication, authorization, and input sanitization

## 📁 Directory Structure

```
business/
├── errors/                 # Custom error classes and codes
│   └── index.ts
├── validators/             # Zod validation schemas
│   ├── product.validator.ts
│   ├── user.validator.ts
│   └── payment.validator.ts
├── services/               # Business logic services
│   ├── ProductService.ts
│   ├── SubscriptionService.ts
│   └── UserService.ts
├── rules/                  # Business rules engine
│   └── index.ts
├── middleware/             # Enhanced middleware
│   ├── auth.ts
│   └── errorHandler.ts
└── index.ts               # Main exports
```

## 🚀 Quick Start

### 1. Using Validation Schemas

```typescript
import { ProductSchema, validateProductBusinessRules } from '@zoroaster/shared';

// Validate input data
const validatedProduct = ProductSchema.parse(inputData);

// Validate business rules
const validation = validateProductBusinessRules(validatedProduct);
if (!validation.isValid) {
  throw new BusinessRuleError('Validation failed', { violations: validation.errors });
}
```

### 2. Using Services

```typescript
import { ProductService } from '@zoroaster/shared';

const productService = new ProductService(supabase);

// Get products with built-in validation and error handling
const result = await productService.getProducts({
  active: 'true',
  product_type: 'chapter_pass',
  limit: '10'
});
```

### 3. Enhanced Route Example

```javascript
const express = require('express');
const { 
  ProductService,
  authenticate,
  authorize,
  validateRequest,
  ProductQuerySchema,
  asyncHandler,
  sendSuccess
} = require('@zoroaster/shared');

const router = express.Router();
const productService = new ProductService(supabase);

router.get('/',
  validateRequest(ProductQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const result = await productService.getProducts(req.query);
    sendSuccess(res, result, 'Products retrieved successfully');
  })
);
```

## 🔐 Security Features

### Authentication & Authorization
- **JWT token validation** with Supabase
- **Role-based access control** (RBAC)
- **Resource ownership** validation
- **Action-based permissions** using business rules

### Input Validation & Sanitization
- **Zod schema validation** for type safety
- **XSS protection** with input sanitization
- **SQL injection prevention** via parameterized queries
- **Rate limiting** with user-based limits

## 📋 Business Rules

### Subscription Rules
- **Maximum subscriptions per user** based on role
- **Product type restrictions** for different user roles
- **Cancellation policies** based on subscription status
- **Trial period limitations**

### Pricing Rules
- **Minimum/maximum prices** per product type
- **Currency validation** by region
- **Discount limitations** by user role
- **Duplicate price prevention**

### Content Access Rules
- **Permission-based content access**
- **Download limits** by user role
- **Preview permissions** by product type
- **Entitlement management**

## 🎛️ Error Handling

### Custom Error Types
```typescript
// Business rule violations
throw new BusinessRuleError('User subscription limit exceeded');

// Resource not found
throw new ResourceNotFoundError('Product', productId);

// Validation failures
throw new ValidationError('Invalid input data');

// Authorization failures
throw new AuthorizationError('Admin access required');
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "User subscription limit exceeded",
    "details": {
      "violations": ["User has reached maximum subscription limit (5 active subscriptions)"]
    },
    "timestamp": "2024-01-01T12:00:00Z",
    "requestId": "req_1234567890_abc123"
  }
}
```

## 🔧 Middleware Usage

### Authentication
```javascript
// Require authentication
app.use('/api/protected', authenticate(supabase));

// Require specific roles
app.use('/api/admin', authenticate(supabase), authorize(['admin', 'super_admin']));

// Resource ownership validation
app.use('/api/users/:id', authenticate(supabase), authorizeResourceOwnership('id'));
```

### Validation
```javascript
// Request validation
app.post('/api/products', validateRequest(CreateProductSchema));

// Business rule validation
app.post('/api/products', validateBusinessRules(validateProductBusinessRules));

// Input sanitization (automatic)
app.use(sanitizeInput);
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- **Product performance metrics**
- **Subscription health scores**
- **User activity tracking**
- **Revenue calculations**

### Error Tracking
- **Request ID tracking** for debugging
- **Error logging** with context
- **Performance monitoring** hooks

## 🔄 Migration Guide

### From Old Routes to Enhanced Routes

**Before:**
```javascript
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.json({ products: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**After:**
```javascript
router.get('/',
  validateRequest(ProductQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const result = await productService.getProducts(req.query);
    sendPaginatedResponse(res, result.products, result.pagination);
  })
);
```

## 🎭 Environment Setup

Add to your `.env` file:
```env
# Enhanced security
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Rate limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Error logging (optional)
ERROR_REPORTING_ENABLED=true
```

## 🧪 Testing

### Validation Testing
```typescript
import { ProductSchema } from '@zoroaster/shared';

describe('Product Validation', () => {
  it('should validate product data', () => {
    const validProduct = {
      name: 'Test Product',
      product_type: 'single_issue'
    };
    
    expect(() => ProductSchema.parse(validProduct)).not.toThrow();
  });
});
```

### Service Testing
```typescript
import { ProductService } from '@zoroaster/shared';

describe('ProductService', () => {
  it('should get products with filtering', async () => {
    const service = new ProductService(mockSupabase);
    const result = await service.getProducts({ active: 'true' });
    expect(result.products).toBeDefined();
  });
});
```

## 🔗 Integration with Frontend

### Using Enhanced Types
```typescript
import { CreateProductInput, ProductService } from '@zoroaster/shared';

const createProduct = async (data: CreateProductInput) => {
  const response = await fetch('/api/products-v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error.message);
  }
  
  return result.data;
};
```

## 📈 Benefits

1. **Type Safety**: Full TypeScript support with Zod validation
2. **Consistent Errors**: Standardized error responses across all endpoints
3. **Security**: Enhanced authentication, authorization, and input validation
4. **Maintainability**: Clean separation of concerns and business logic
5. **Scalability**: Modular architecture that can grow with your needs
6. **Documentation**: Self-documenting through TypeScript types and schemas

## 🤝 Contributing

When adding new business logic:
1. Create validation schemas in `validators/`
2. Implement business rules in `rules/`
3. Create service classes in `services/`
4. Add error types to `errors/` if needed
5. Update routes to use new middleware and services

## 📞 Support

For questions about the business logic layer:
- Check the validation schemas for data requirements
- Review business rules for logic constraints
- Use error codes for debugging issues
- Follow the service patterns for consistent implementation
