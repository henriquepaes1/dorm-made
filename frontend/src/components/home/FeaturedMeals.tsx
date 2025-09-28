import { MealCard } from "@/components/meals/MealCard";

const SAMPLE_MEALS = [
  {
    id: "1",
    title: "Authentic Thai Pad Thai Night",
    description: "Traditional pad thai with fresh ingredients and my grandmother's secret sauce recipe.",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&fit=crop",
    chef: {
      name: "Siriporn K.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
      rating: 4.9
    },
    cuisine: "Thai",
    datetime: "Today, 7:00 PM",
    location: "Wilson Hall - Room 304",
    maxGuests: 6,
    availableSpots: 3,
    tags: ["Vegetarian Option", "Authentic", "Spicy"]
  },
  {
    id: "2",
    title: "Italian Pasta & Wine Experience",
    description: "Homemade pasta with marinara sauce, garlic bread, and Italian culture stories.",
    price: 18.50,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
    chef: {
      name: "Marco R.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 4.8
    },
    cuisine: "Italian",
    datetime: "Tomorrow, 6:30 PM",
    location: "East Campus Apt 12B",
    maxGuests: 8,
    availableSpots: 5,
    tags: ["Wine Pairing", "Homemade", "Stories"]
  },
  {
    id: "3",
    title: "Korean BBQ & K-Pop Night",
    description: "Korean BBQ with banchan sides, accompanied by the latest K-pop hits and cultural exchange.",
    price: 22.00,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    chef: {
      name: "Jin-Ae L.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      rating: 4.9
    },
    cuisine: "Korean",
    datetime: "Friday, 7:30 PM",
    location: "Student Village - Unit 4A",
    maxGuests: 10,
    availableSpots: 7,
    tags: ["BBQ", "K-Pop", "Group Fun"]
  },
  {
    id: "4",
    title: "Mexican Taco Tuesday Fiesta",
    description: "Authentic street tacos with fresh salsas, guacamole, and Mexican music atmosphere.",
    price: 12.75,
    image: "https://images.unsplash.com/photo-1565299585323-38174c250d79?w=400&h=300&fit=crop",
    chef: {
      name: "Carlos M.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      rating: 4.7
    },
    cuisine: "Mexican",
    datetime: "Tuesday, 6:00 PM",
    location: "South Dorms - Common Room",
    maxGuests: 12,
    availableSpots: 9,
    tags: ["Street Food", "Fresh", "Music"]
  }
];

export function FeaturedMeals() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Meals This Week
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing cultural dining experiences hosted by talented student chefs in your area.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_MEALS.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/explore"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            View All Meals
          </a>
        </div>
      </div>
    </section>
  );
}