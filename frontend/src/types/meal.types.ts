export interface Meal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  ingredients: string;
  image_url?: string;
  created_at: string;
}

export interface MealCreate {
  user_id: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  prep_time: number;
}
