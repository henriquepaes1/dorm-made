import { Meal } from "@/types";

/**
 * Mock meals data for development
 * These represent user's saved recipes/meals
 */
export const mockMeals: Meal[] = [
  {
    id: "1",
    user_id: "user-1",
    title: "Classic Spaghetti Carbonara",
    description: "Traditional Italian pasta dish with eggs, cheese, and pancetta",
    ingredients: "Spaghetti, eggs, pecorino cheese, pancetta, black pepper",
    image_url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "user-1",
    title: "Vegetable Stir Fry",
    description: "Colorful mix of fresh vegetables with soy sauce and ginger",
    ingredients: "Bell peppers, broccoli, carrots, snap peas, soy sauce, ginger, garlic",
    image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "user-1",
    title: "Chicken Tacos",
    description: "Mexican-style tacos with seasoned chicken and fresh toppings",
    ingredients: "Chicken breast, tortillas, lettuce, tomatoes, cheese, sour cream, taco seasoning",
    image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "user-1",
    title: "Margherita Pizza",
    description: "Simple and delicious pizza with fresh mozzarella and basil",
    ingredients: "Pizza dough, tomato sauce, fresh mozzarella, basil, olive oil",
    image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    user_id: "user-1",
    title: "Thai Green Curry",
    description: "Aromatic Thai curry with vegetables and coconut milk",
    ingredients: "Green curry paste, coconut milk, bamboo shoots, Thai basil, chicken",
    image_url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    user_id: "user-1",
    title: "Greek Salad",
    description: "Fresh Mediterranean salad with feta cheese and olives",
    ingredients: "Tomatoes, cucumber, red onion, feta cheese, olives, olive oil, oregano",
    image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    created_at: new Date().toISOString(),
  },
];