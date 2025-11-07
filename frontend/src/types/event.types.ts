export interface Event {
  id: string;
  host_user_id: string;
  recipe_id: string;
  title: string;
  description: string;
  max_participants: number;
  current_participants: number;
  event_date: string;
  location: string;
  image_url?: string;
  price?: number;
  created_at: string;
}

export interface EventCreate {
  title: string;
  description: string;
  max_participants: number;
  event_date: string;
  location: string;
  price?: number;
}

export interface JoinEventRequest {
  user_id: string;
  event_id: string;
}
