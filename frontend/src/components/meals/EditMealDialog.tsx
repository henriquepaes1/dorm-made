import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Meal, MealUpdate } from "@/types";
import { Loader2 } from "lucide-react";

interface EditMealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
  loading: boolean;
  onSave: (updates: MealUpdate) => void;
}

interface FormData {
  title: string;
  description: string;
  ingredients: string;
}

export function EditMealDialog({
  isOpen,
  onClose,
  meal,
  loading,
  onSave,
}: EditMealDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    title: meal.title,
    description: meal.description,
    ingredients: meal.ingredients,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: MealUpdate = {
      title: formData.title,
      description: formData.description,
      ingredients: formData.ingredients,
    };

    onSave(updates);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Meal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Meal Title */}
            <div>
              <Label htmlFor="title">Meal Name</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Classic Margherita Pizza"
                required
              />
            </div>

            {/* Meal Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your meal, cooking method, and what makes it special..."
                rows={4}
                required
              />
            </div>

            {/* Ingredients */}
            <div>
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                placeholder="List all ingredients"
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}