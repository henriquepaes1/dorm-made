import { httpClient } from "./http-client";
import { Meal, MealCreate } from "@/types";

/**
 * Meal Service
 * Handles meal-related API calls
 */

/**
 * Create a new meal
 */
export const createMeal = async (mealData: MealCreate | FormData): Promise<Meal> => {
  const response = await httpClient.post("/meals/", mealData);
  return response.data;
};

/**
 * Get meals created by the current user
 */
export const getMyMeals = async (): Promise<Meal[]> => {
  const response = await httpClient.get("/users/me/meals");
  return response.data;
};

/**
 * Get meal by ID
 */
export const getMeal = async (mealId: string): Promise<Meal> => {
  const response = await httpClient.get(`/meals/${mealId}`);
  return response.data;
};
