export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
interface ITimelineEvent {
    id: string;
    date: string;
    title: string;
    description: string;
    details?: string;
    background_image?: string;
    is_published: boolean;
    order: number;
    created_at: string;
    updated_at: string;
    nested_events?: Array<{
        id: string;
        date: string;
        title: string;
        description: string;
        order: number;
    }>;
}
export type TimelineEvent = ITimelineEvent;
export declare const fetchTimelineEvents: () => Promise<TimelineEvent[]>;
export {};
//# sourceMappingURL=api.d.ts.map