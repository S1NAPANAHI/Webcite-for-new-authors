import { default as React } from 'react';
interface StripeCheckoutProps {
    product: {
        id: string;
        name: string;
        price: number;
        currency: string;
        interval?: string;
        trial_period_days?: number;
        is_subscription: boolean;
    };
    onSuccess: (sessionId: string) => void;
    onCancel: () => void;
    customerEmail?: string;
    stripePublishableKey?: string;
}
declare const SubscriptionCheckout: React.FC<StripeCheckoutProps>;
export { SubscriptionCheckout };
//# sourceMappingURL=SubscriptionCheckout.d.ts.map