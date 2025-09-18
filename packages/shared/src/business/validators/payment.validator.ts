import { z } from 'zod';




// Stripe checkout session schema
export const CheckoutSessionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  successUrl: z.string().url('Invalid success URL'),
  cancelUrl: z.string().url('Invalid cancel URL'),
  customerEmail: z.string().email('Invalid customer email').optional(),
  productSlug: z.string().min(1, 'Product slug is required').optional(),
  userId: z.string().uuid().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(10, 'Quantity cannot exceed 10').default(1),
  metadata: z.record(z.string(), z.string()).optional()
});

// Subscription schema
export const SubscriptionSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  plan_id: z.string().min(1, 'Plan ID is required'),
  status: z.enum([
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'paused'
  ]).default('active'),
  current_period_start: z.string().datetime().optional().nullable(),
  current_period_end: z.string().datetime().optional().nullable(),
  trial_start: z.string().datetime().optional().nullable(),
  trial_end: z.string().datetime().optional().nullable(),
  cancel_at_period_end: z.boolean().default(false),
  metadata: z.record(z.string(), z.any()).optional().nullable(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

// Payment intent schema
export const PaymentIntentSchema = z.object({
  amount: z.number().min(50, 'Amount must be at least $0.50'),
  currency: z.string().length(3, 'Currency must be a 3-letter ISO code'),
  paymentMethodId: z.string().optional(),
  customerId: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional()
});

// Refund schema
export const RefundSchema = z.object({
  paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
  amount: z.number().min(1, 'Refund amount must be positive').optional(),
  reason: z.enum([
    'duplicate',
    'fraudulent',
    'requested_by_customer',
    'expired_uncaptured_charge'
  ]).default('requested_by_customer'),
  metadata: z.record(z.string(), z.string()).optional()
});

// Order schema
export const OrderSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional().nullable(),
  product_id: z.string().uuid(),
  price_id: z.string().uuid(),
  status: z.enum(['pending', 'completed', 'failed', 'refunded', 'canceled']).default('pending'),
  amount_cents: z.number().min(0, 'Amount cannot be negative'),
  currency: z.string().length(3, 'Currency must be a 3-letter ISO code'),
  customer_email: z.string().email('Invalid customer email').optional().nullable(),
  provider: z.enum(['stripe', 'paypal']).default('stripe'),
  provider_session_id: z.string().optional().nullable(),
  provider_payment_intent_id: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().nullable(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

// Subscription creation schema
export const CreateSubscriptionSchema = SubscriptionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

// Subscription update schema
export const UpdateSubscriptionSchema = SubscriptionSchema.partial().omit({
  id: true,
  user_id: true,
  created_at: true
});

// Payment query parameters schema
export const PaymentQuerySchema = z.object({
  status: z.enum(['pending', 'completed', 'failed', 'refunded', 'canceled']).optional(),
  provider: z.enum(['stripe', 'paypal']).optional(),
  user_id: z.string().uuid().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
      limit: z.string()
    .transform(val => parseInt(val))
    .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
    .default(50),
  offset: z.string()
    .transform(val => parseInt(val))
    .refine(val => val >= 0, 'Offset must be non-negative')
    .default(0),
  sort_by: z.enum(['created_at', 'amount_cents', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Subscription query parameters schema
export const SubscriptionQuerySchema = z.object({
  status: z.enum([
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'paused'
  ]).optional(),
  user_id: z.string().uuid().optional(),
  plan_id: z.string().optional(),
      limit: z.string()
    .transform(val => parseInt(val))
    .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
    .default(50),
  offset: z.string()
    .transform(val => parseInt(val))
    .refine(val => val >= 0, 'Offset must be non-negative')
    .default(0),
  sort_by: z.enum(['created_at', 'current_period_end', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Payment business rules validation
export const validatePaymentBusinessRules = (order: z.infer<typeof OrderSchema>) => {
  const errors: string[] = [];

  // Minimum order amount
  if (order.amount_cents < 50) {
    errors.push('Order amount must be at least $0.50');
  }

  // Maximum order amount for security
  if (order.amount_cents > 100000000) { // $1M limit
    errors.push('Order amount cannot exceed $1,000,000');
  }

  // Ensure customer email or user_id is provided
  if (!order.customer_email && !order.user_id) {
    errors.push('Either customer email or user ID must be provided');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Subscription business rules validation
export const validateSubscriptionBusinessRules = (subscription: z.infer<typeof SubscriptionSchema>) => {
  const errors: string[] = [];

  // Trial periods should have proper dates
  if (subscription.trial_start && subscription.trial_end) {
    const trialStart = new Date(subscription.trial_start);
    const trialEnd = new Date(subscription.trial_end);
    
    if (trialEnd <= trialStart) {
      errors.push('Trial end date must be after trial start date');
    }

    // Trial period should not exceed 365 days
    const trialDuration = trialEnd.getTime() - trialStart.getTime();
    const maxTrialDuration = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds
    
    if (trialDuration > maxTrialDuration) {
      errors.push('Trial period cannot exceed 365 days');
    }
  }

  // Current period validation
  if (subscription.current_period_start && subscription.current_period_end) {
    const periodStart = new Date(subscription.current_period_start);
    const periodEnd = new Date(subscription.current_period_end);
    
    if (periodEnd <= periodStart) {
      errors.push('Current period end must be after current period start');
    }
  }

  // Active subscriptions should have valid periods
  if (subscription.status === 'active') {
    if (!subscription.current_period_start || !subscription.current_period_end) {
      errors.push('Active subscriptions must have valid billing periods');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Refund business rules validation
export const validateRefundBusinessRules = (refund: z.infer<typeof RefundSchema>, originalAmount: number) => {
  const errors: string[] = [];

  // Refund amount cannot exceed original amount
  if (refund.amount && refund.amount > originalAmount) {
    errors.push('Refund amount cannot exceed original payment amount');
  }

  // Check if refund is allowed based on time elapsed (business rule)
  // This would need additional context about when the original payment was made

  return {
    isValid: errors.length === 0,
    errors
  };
};

export type CheckoutSessionInput = z.infer<typeof CheckoutSessionSchema>;
export type SubscriptionInput = z.infer<typeof SubscriptionSchema>;
export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionSchema>;
export type PaymentIntentInput = z.infer<typeof PaymentIntentSchema>;
export type RefundInput = z.infer<typeof RefundSchema>;
export type OrderInput = z.infer<typeof OrderSchema>;
export type PaymentQuery = z.infer<typeof PaymentQuerySchema>;
export type SubscriptionQuery = z.infer<typeof SubscriptionQuerySchema>;
