export interface NestedEvent {
    id?: string;
    date: string;
    title: string;
    description: string;
    order?: number;
    timeline_event_id?: string;
}
export interface TimelineEvent {
    id: string;
    date: string;
    title: string;
    description: string;
    details?: string | null;
    background_image?: string | null;
    is_published: boolean;
    era?: 'ancient' | 'medieval' | 'modern' | 'future';
    nested_events?: NestedEvent[];
    status?: string;
    created_at?: string;
    updated_at?: string;
}
//# sourceMappingURL=timeline.d.ts.map