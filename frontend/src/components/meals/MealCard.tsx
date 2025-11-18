import { Meal } from "@/types";
import { Card, CardContent } from "../ui/card";
import { ChefHat } from "lucide-react";
import { useMealDialog } from "@/hooks/use-meal-dialog";
import { MealDialog } from "./MealDialog";

interface MealCardProps {
  meal: Meal;
  isSelected?: boolean;
  onTap?: (meal: Meal) => void;
  expandOnTap?: boolean;
}

/**
 * MealCard component for displaying a recipe/meal
 * Styled similarly to EventCard for consistency
 */
export function MealCard({ meal, isSelected = false, onTap, expandOnTap = false }: MealCardProps) {
  const { isOpen, meal: dialogMeal, loading, error, openDialog, closeDialog } = useMealDialog();

  const internalOnTap = () => {
    onTap?.(meal);

    if (expandOnTap) {
      openDialog(meal.id);
    }
  };

  return (
    <>
      <Card
        className={`flex flex-col hover:shadow-lg transition-all cursor-pointer min-w-[85vw] lg:min-w-0 ${
          isSelected ? "ring-2 ring-primary shadow-lg" : ""
        }`}
        onClick={() => internalOnTap()}
      >
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
          {meal.imageUrl ? (
            <img src={meal.imageUrl} alt={meal.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-2">🍽️</div>
              <p className="text-sm text-muted-foreground">No Image</p>
            </div>
          )}
        </div>

        <CardContent className="flex flex-col justify-between flex-grow p-4">
          <h3 className="font-semibold text-lg mb-2">{meal.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{meal.description}</p>
        </CardContent>
      </Card>

      <MealDialog
        isOpen={isOpen}
        onClose={closeDialog}
        meal={dialogMeal}
        loading={loading}
        error={error}
      />
    </>
  );
}
