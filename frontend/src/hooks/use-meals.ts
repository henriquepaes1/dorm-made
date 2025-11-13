import { useState, useCallback, useEffect } from "react";
import { Meal } from "@/types";
import { mockMeals } from "@/data/mockMeals";

/**
 * Custom hook for managing user's meals/recipes
 * Currently uses mock data, but can be easily extended to fetch from API
 */
export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Simulate API fetch with mock data
  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      setMeals(mockMeals);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load meals on mount
  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  // Select a meal
  const selectMeal = useCallback((meal: Meal) => {
    setSelectedMeal(meal);
  }, []);

  // Clear selected meal
  const clearSelection = useCallback(() => {
    setSelectedMeal(null);
  }, []);

  return {
    meals,
    loading,
    selectedMeal,
    selectMeal,
    clearSelection,
    refreshMeals: fetchMeals,
  };
}