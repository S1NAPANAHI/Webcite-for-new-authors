import { z } from 'zod';
export declare const CheckoutSessionSchema: z.ZodObject<{
    priceId: z.ZodString;
    successUrl: z.ZodString;
    cancelUrl: z.ZodString;
    customerEmail: z.ZodOptional<z.ZodString>;
    productSlug: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    quantity: z.ZodDefault<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
export declare const SubscriptionSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodString;
    plan_id: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<{
        incomplete: "incomplete";
        incomplete_expired: "incomplete_expired";
        trialing: "trialing";
        active: "active";
        past_due: "past_due";
        canceled: "canceled";
        unpaid: "unpaid";
        paused: "paused";
    }>>;
    current_period_start: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    current_period_end: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    trial_start: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    trial_end: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    cancel_at_period_end: z.ZodDefault<z.ZodBoolean>;
    metadata: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const PaymentIntentSchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodString;
    paymentMethodId: z.ZodOptional<z.ZodString>;
    customerId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
export declare const RefundSchema: z.ZodObject<{
    paymentIntentId: z.ZodString;
    amount: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodDefault<z.ZodEnum<{
        duplicate: "duplicate";
        fraudulent: "fraudulent";
        requested_by_customer: "requested_by_customer";
        expired_uncaptured_charge: "expired_uncaptured_charge";
    }>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
export declare const OrderSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    product_id: z.ZodString;
    price_id: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<{
        pending: "pending";
        canceled: "canceled";
        completed: "completed";
        failed: "failed";
        refunded: "refunded";
    }>>;
    amount_cents: z.ZodNumber;
    currency: z.ZodString;
    customer_email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    provider: z.ZodDefault<z.ZodEnum<{
        stripe: "stripe";
        paypal: "paypal";
    }>>;
    provider_session_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    provider_payment_intent_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    metadata: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CreateSubscriptionSchema: z.ZodObject<{
    status: z.ZodDefault<z.ZodEnum<{
        incomplete: "incomplete";
        incomplete_expired: "incomplete_expired";
        trialing: "trialing";
        active: "active";
        past_due: "past_due";
        canceled: "canceled";
        unpaid: "unpaid";
        paused: "paused";
    }>>;
    user_id: z.ZodString;
    metadata: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    cancel_at_period_end: z.ZodDefault<z.ZodBoolean>;
    current_period_end: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    current_period_start: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    plan_id: z.ZodString;
    trial_end: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    trial_start: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const UpdateSubscriptionSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        incomplete: "incomplete";
        incomplete_expired: "incomplete_expired";
        trialing: "trialing";
        active: "active";
        past_due: "past_due";
        canceled: "canceled";
        unpaid: "unpaid";
        paused: "paused";
    }>>>;
    updated_at: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>>;
    cancel_at_period_end: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    current_period_end: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    current_period_start: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    plan_id: z.ZodOptional<z.ZodString>;
    trial_end: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    trial_start: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, z.core.$strip>;
export declare const PaymentQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        canceled: "canceled";
        completed: "completed";
        failed: "failed";
        refunded: "refunded";
    }>>;
    provider: z.ZodOptional<z.ZodEnum<{
        stripe: "stripe";
        paypal: "paypal";
    }>>;
    user_id: z.ZodOptional<z.ZodString>;
    start_date: z.ZodOptional<z.ZodString>;
    end_date: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    offset: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    sort_by: z.ZodDefault<z.ZodEnum<{
        created_at: "created_at";
        status: "status";
        amount_cents: "amount_cents";
    }>>;
    sort_order: z.ZodDefault<z.ZodEnum<{
        desc: "desc";
        asc: "asc";
    }>>;
}, z.core.$strip>;
export declare const SubscriptionQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        incomplete: "incomplete";
        incomplete_expired: "incomplete_expired";
        trialing: "trialing";
        active: "active";
        past_due: "past_due";
        canceled: "canceled";
        unpaid: "unpaid";
        paused: "paused";
    }>>;
    user_id: z.ZodOptional<z.ZodString>;
    plan_id: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    offset: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    sort_by: z.ZodDefault<z.ZodEnum<{
        created_at: "created_at";
        status: "status";
        current_period_end: "current_period_end";
    }>>;
    sort_order: z.ZodDefault<z.ZodEnum<{
        desc: "desc";
        asc: "asc";
    }>>;
}, z.core.$strip>;
export declare const validatePaymentBusinessRules: (order: z.infer<typeof OrderSchema>) => {
    isValid: boolean;
    errors: string[];
};
export declare const validateSubscriptionBusinessRules: (subscription: z.infer<typeof SubscriptionSchema>) => {
    isValid: boolean;
    errors: string[];
};
export declare const validateRefundBusinessRules: (refund: z.infer<typeof RefundSchema>, originalAmount: number) => {
    isValid: boolean;
    errors: string[];
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
