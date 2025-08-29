import { TimelineEvent, CreateTimelineEventDto, UpdateTimelineEventDto, ReorderTimelineEventDto, TimelineEventListResponse } from '../types/timeline';
export declare const fetchTimelineEvents: ({ page, limit, includeUnpublished, }?: {
    page?: number;
    limit?: number;
    includeUnpublished?: boolean;
}) => Promise<TimelineEventListResponse>;
export declare const fetchTimelineEventById: (id: string) => Promise<TimelineEvent | null>;
export declare const createTimelineEvent: (eventData: CreateTimelineEventDto) => Promise<TimelineEvent>;
export declare const updateTimelineEvent: (id: string, eventData: UpdateTimelineEventDto) => Promise<TimelineEvent>;
export declare const deleteTimelineEvent: (id: string) => Promise<void>;
export declare const reorderTimelineEvents: (reorderData: ReorderTimelineEventDto[]) => Promise<void>;
export declare const toggleTimelineEventPublishStatus: (id: string, isPublished: boolean) => Promise<TimelineEvent>;
