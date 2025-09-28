import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, ChefHat, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createEvent, createRecipe } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    // Event fields
    title: '',
    description: '',
    max_participants: '',
    event_date: '',
    location: '',
    // Recipe fields
    recipe_title: '',
    recipe_description: '',
    ingredients: [''],
    instructions: '',
    prep_time: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      difficulty: value as 'easy' | 'medium' | 'hard'
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      toast({
        title: "Please Sign In",
        description: "You need to sign in to create events",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    const requiredFields = [
      'title', 'description', 'max_participants', 'event_date', 'location',
      'recipe_title', 'recipe_description', 'instructions', 'prep_time'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const user = JSON.parse(currentUser);
      
      // First create the recipe
      const filteredIngredients = formData.ingredients.filter(ingredient => ingredient.trim() !== '');
      const recipeData = {
        user_id: user.id,
        title: formData.recipe_title,
        description: formData.recipe_description,
        ingredients: filteredIngredients,
        instructions: formData.instructions,
        prep_time: parseInt(formData.prep_time),
        difficulty: formData.difficulty
      };

      const recipe = await createRecipe(recipeData);
      
      // Then create the event with the recipe
      const eventData = {
        host_user_id: user.id,
        recipe_id: recipe.id,
        title: formData.title,
        description: formData.description,
        max_participants: parseInt(formData.max_participants),
        event_date: formData.event_date,
        location: formData.location
      };

      await createEvent(eventData);
      
      toast({
        title: "Success!",
        description: "Event and recipe created successfully!",
      });
      
      navigate('/explore');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Host a Culinary Event</h1>
            <p className="text-muted-foreground">
              Create an event and share your recipe with fellow students
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Event Details
                </CardTitle>
                <CardDescription>
                  Tell us about your culinary event
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Title */}
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Pasta Night with Friends"
                      required
                    />
                  </div>

                  {/* Event Description */}
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Event Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe what participants will learn and experience..."
                      rows={3}
                      required
                    />
                  </div>

                  {/* Max Participants and Event Date */}
                  <div>
                    <Label htmlFor="max_participants">Max Participants</Label>
                    <Input
                      id="max_participants"
                      name="max_participants"
                      type="number"
                      value={formData.max_participants}
                      onChange={handleInputChange}
                      placeholder="6"
                      min="1"
                      max="20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="event_date">Event Date & Time</Label>
                    <Input
                      id="event_date"
                      name="event_date"
                      type="datetime-local"
                      value={formData.event_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Dorm Kitchen 3A, Student Center Kitchen"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recipe Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Recipe Details
                </CardTitle>
                <CardDescription>
                  Share the recipe you'll be cooking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recipe Title */}
                  <div className="md:col-span-2">
                    <Label htmlFor="recipe_title">Recipe Title</Label>
                    <Input
                      id="recipe_title"
                      name="recipe_title"
                      value={formData.recipe_title}
                      onChange={handleInputChange}
                      placeholder="e.g., Grandma's Chocolate Chip Cookies"
                      required
                    />
                  </div>

                  {/* Recipe Description */}
                  <div className="md:col-span-2">
                    <Label htmlFor="recipe_description">Recipe Description</Label>
                    <Textarea
                      id="recipe_description"
                      name="recipe_description"
                      value={formData.recipe_description}
                      onChange={handleInputChange}
                      placeholder="Describe your recipe and what makes it special..."
                      rows={3}
                      required
                    />
                  </div>

                  {/* Ingredients */}
                  <div className="md:col-span-2">
                    <Label>Ingredients</Label>
                    <div className="space-y-2 mt-2">
                      {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            placeholder="Enter ingredient"
                            required
                            className="flex-1"
                          />
                          {formData.ingredients.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeIngredient(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addIngredient}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Ingredient
                      </Button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="md:col-span-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      placeholder="Step-by-step cooking instructions..."
                      rows={6}
                      required
                    />
                  </div>

                  {/* Prep Time and Difficulty */}
                  <div>
                    <Label htmlFor="prep_time">Prep Time (minutes)</Label>
                    <Input
                      id="prep_time"
                      name="prep_time"
                      type="number"
                      value={formData.prep_time}
                      onChange={handleInputChange}
                      placeholder="30"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={formData.difficulty} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/explore')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Creating Event & Recipe..." : "Create Event & Recipe"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}