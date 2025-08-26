export interface TimelineNestedEvent {
  id?: string;
  date: string;
  title: string;
  description: string;
  order?: number;
  timeline_event_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TimelineEvent {
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
  created_by?: string;
  updated_by?: string;
  nested_events?: TimelineNestedEvent[];
}

export interface CreateTimelineEventDto {
  date: string;
  title: string;
  description: string;
  details?: string;
  background_image?: string;
  is_published?: boolean;
  order?: number;
  nested_events?: Omit<TimelineNestedEvent, 'id' | 'timeline_event_id' | 'created_at' | 'updated_at'>[];
}

export interface UpdateTimelineEventDto extends Partial<Omit<CreateTimelineEventDto, 'nested_events'>> {
  id: string;
  nested_events?: Array<Omit<TimelineNestedEvent, 'timeline_event_id' | 'created_at' | 'updated_at'>>;
}

export interface TimelineEventListResponse {
  data: TimelineEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReorderTimelineEventDto {
  id: string;
  order: number;
}
