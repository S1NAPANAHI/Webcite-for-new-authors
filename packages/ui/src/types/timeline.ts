export interface TimelineNestedEvent {
  id?: string;
  date: string;
  title: string;
  description: string;
  image_url?: string;
  image_alt?: string;
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
  image_alt?: string;
  is_published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  era?: string;
  nested_events?: TimelineNestedEvent[];
}

export interface TimelineEra {
  id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  background_color?: string;
  text_color?: string;
  image_url?: string;
  image_alt?: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTimelineEventDto {
  date: string;
  title: string;
  description: string;
  details?: string;
  background_image?: string;
  image_alt?: string;
  is_published?: boolean;
  order?: number;
  era?: string;
  nested_events?: Omit<TimelineNestedEvent, 'id' | 'timeline_event_id' | 'created_at' | 'updated_at'>[];
}

export interface UpdateTimelineEventDto extends Partial<Omit<CreateTimelineEventDto, 'nested_events' | 'details' | 'background_image' | 'image_alt'>> {
  id: string;
  details?: string | null;
  background_image?: string | null;
  image_alt?: string | null;
  nested_events?: Array<Omit<TimelineNestedEvent, 'timeline_event_id' | 'created_at' | 'updated_at'>>;
}

export interface CreateTimelineEraDto {
  name: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  background_color?: string;
  text_color?: string;
  image_url?: string;
  image_alt?: string;
  is_active?: boolean;
  order_index?: number;
}

export interface UpdateTimelineEraDto extends Partial<CreateTimelineEraDto> {
  id: string;
}

export interface TimelineEventListResponse {
  data: TimelineEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TimelineEraListResponse {
  data: TimelineEra[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReorderTimelineEventDto {
  id: string;
  order: number;
}

export interface ReorderTimelineEraDto {
  id: string;
  order_index: number;
}