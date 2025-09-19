import { z } from 'zod';




// Base product validation schema
export const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
    .min(1, 'Product name is required')
    .max(255, 'Product name must be less than 255 characters')
    .trim(),
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .nullable(),
  product_type: z.enum(['single_issue', 'bundle', 'chapter_pass', 'arc_pass'])
    .default('single_issue'),
  active: z.boolean().default(true),
  work_id: z.string().uuid().optional().nullable(),
  content_grants: z.record(z.string(), z.any()).optional().nullable(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

// Price validation schema
export const PriceSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  currency: z.string()
    .length(3, 'Currency must be a 3-letter ISO code')
    .toUpperCase(),
  unit_amount: z.number()
    .min(0, 'Price cannot be negative')
    .max(999999, 'Price cannot exceed $9,999.99'),
  interval: z.enum(['one_time', 'month', 'year']).optional().nullable(),
  nickname: z.string()
    .max(100, 'Nickname must be less than 100 characters')
    .optional()
    .nullable(),
  trial_days: z.number()
    .min(0, 'Trial days cannot be negative')
    .max(365, 'Trial period cannot exceed 365 days')
    .optional()
    .nullable(),
  active: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

// Product creation schema
export const CreateProductSchema = ProductSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
}).extend({
  prices: z.array(PriceSchema.omit({
    id: true,
    product_id: true,
    created_at: true,
    updated_at: true
  })).min(1, 'At least one price is required')
});

// Product update schema
export const UpdateProductSchema = ProductSchema.partial().omit({
  id: true,
  created_at: true
});

// Product query parameters schema
export const ProductQuerySchema = z.object({
  active: z.enum(['true', 'false']).optional(),
  product_type: z.enum(['single_issue', 'bundle', 'chapter_pass', 'arc_pass']).optional(),
  limit: z.string()
    .transform(val => parseInt(val))
    .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
    .default('50'),
  offset: z.string()
    .transform(val => parseInt(val))
    .refine(val => val >= 0, 'Offset must be non-negative')
    .default('0'),
  search: z.string().max(100).optional(),
  sort_by: z.enum(['created_at', 'name', 'price', 'updated_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Product business rules validation
export const validateProductBusinessRules = (product: z.infer<typeof ProductSchema>) => {
  const errors: string[] = [];

  // Bundle products must have associated works
  if (product.product_type === 'bundle' && !product.work_id) {
    errors.push('Bundle products must have an associated work');
  }

  // Chapter pass and arc pass are subscription products
  if (['chapter_pass', 'arc_pass'].includes(product.product_type) && !product.content_grants) {
    errors.push('Subscription products must define content grants');
  }

  // Single issue products should have a specific work
  if (product.product_type === 'single_issue' && !product.work_id) {
    errors.push('Single issue products should have an associated work');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Price business rules validation
export const validatePriceBusinessRules = (price: z.infer<typeof PriceSchema>) => {
  const errors: string[] = [];

  // Subscription prices must have intervals
  if (price.interval && price.interval !== 'one_time' && price.unit_amount < 99) {
    errors.push('Subscription prices must be at least $0.99');
  }

  // One-time purchases should not have trial periods
  if (!price.interval && price.trial_days && price.trial_days > 0) {
    errors.push('One-time purchases cannot have trial periods');
  }

  // Trial periods only for monthly/yearly subscriptions
  if (price.trial_days && price.trial_days > 0 && !['month', 'year'].includes(price.interval || '')) {
    errors.push('Trial periods are only allowed for monthly or yearly subscriptions');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export type ProductInput = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductQuery = z.infer<typeof ProductQuerySchema>;
export type PriceInput = z.infer<typeof PriceSchema>;