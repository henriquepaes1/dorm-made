export interface Meal {
  id: string;
  userId: string;
  title: string;
  description: string;
  ingredients: string;
  imageUrl?: string;
  createdAt: string;
}

export interface MealCreate {
  userId: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  prepTime: number;
}
