export declare const useUserSubscription: () => {
    currentSubscription: {
        billing_cycle_anchor: string | null;
        cancel_at_period_end: boolean | null;
        canceled_at: string | null;
        collection_method: import("..").Database["public"]["Enums"]["collection_method"] | null;
        created_at: string;
        current_period_end: string | null;
        current_period_start: string | null;
        days_until_due: number | null;
        ended_at: string | null;
        id: string;
        metadata: import("..").Json | null;
        plan_id: string | null;
        plan_price_id: string | null;
        provider: string;
        provider_subscription_id: string;
        status: import("..").Database["public"]["Enums"]["subscription_status"];
        trial_end: string | null;
        trial_start: string | null;
        updated_at: string;
        user_id: string;
    } | null;
    loading: boolean;
    error: string | null;
    fetchSubscription: () => Promise<void>;
};
//# sourceMappingURL=useUserSubscription.d.ts.map