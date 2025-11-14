import { useState, useCallback, useEffect } from "react";
import { Meal } from "@/types";
import { getMyMeals } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";

/**
 * Custom hook for managing user's meals/recipes
 * Fetches meals from the API
 */
export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const { toast } = useToast();

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyMeals();
      setMeals(data);
    } catch (error) {
      console.error("Error fetching meals:", error);

      if (isAxiosError(error)) {
        if (error.response?.status !== 401) {
          toast({
            title: "Error",
            description: error.response?.data?.detail || "Failed to load meals",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

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