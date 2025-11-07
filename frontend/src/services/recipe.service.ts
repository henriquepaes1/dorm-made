import { httpClient } from "./http-client";
import { Recipe, RecipeCreate } from "@/types";

/**
 * Recipe Service
 * Handles recipe-related API calls
 */

/**
 * Create a new recipe
 */
export const createRecipe = async (recipeData: RecipeCreate): Promise<Recipe> => {
  const response = await httpClient.post("/recipes/", recipeData);
  return response.data;
};

/**
 * Get recipe by ID
 */
export const getRecipe = async (recipeId: string): Promise<Recipe> => {
  const response = await httpClient.get(`/recipes/${recipeId}`);
  return response.data;
};
