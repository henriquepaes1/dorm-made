import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Meal } from "@/types";

interface MealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal | null;
  loading: boolean;
  error: string | null;
}

export function MealDialog({ isOpen, onClose, meal, loading, error }: MealDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {meal && !loading && !error && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{meal.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Meal details including description and ingredients
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Meal Image */}
              <div className="w-full h-64 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                {meal.imageUrl ? (
                  <img
                    src={meal.imageUrl}
                    alt={meal.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Failed to load meal image:", meal.imageUrl);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-2">🍽️</div>
                    <p className="text-sm text-muted-foreground">No image available</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{meal.description}</p>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <p className="text-muted-foreground whitespace-pre-line">{meal.ingredients}</p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
