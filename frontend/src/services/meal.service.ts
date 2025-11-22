import { httpClient } from "./http-client";
import { Meal, MealCreate, MealUpdate } from "@/types";

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
  const response = await httpClient.get("/meals/me");
  return response.data;
};

/**
 * Get meals created by a specific user (for public profiles)
 */
export const getUserMeals = async (userId: string): Promise<Meal[]> => {
  const response = await httpClient.get("/meals/", {
    params: { user_id: userId }
  });
  return response.data;
};

/**
 * Get meal by ID
 */
export const getMeal = async (mealId: string): Promise<Meal> => {
  const response = await httpClient.get(`/meals/${mealId}`);
  return response.data;
};

/**
 * Update a meal
 * Only the meal creator can update
 */
export const updateMeal = async (mealId: string, mealData: MealUpdate): Promise<Meal> => {
  const response = await httpClient.put(`/meals/${mealId}`, mealData);
  return response.data;
};

/**
 * Delete a meal (soft delete)
 * Only the meal creator can delete
 */
export const deleteMeal = async (mealId: string): Promise<{ message: string; meal_id: string }> => {
  const response = await httpClient.delete(`/meals/${mealId}`);
  return response.data;
};
