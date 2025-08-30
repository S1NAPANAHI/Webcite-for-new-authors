import { Tables } from './database.types';
export type Subscription = Tables<'subscriptions'>;
export declare const getSubscription: (userId: string) => Promise<Subscription | null>;
//# sourceMappingURL=subscription.d.ts.map