export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prep_time: number;
  created_at: string;
}

export interface RecipeCreate {
  user_id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prep_time: number;
}
