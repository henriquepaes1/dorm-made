import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { getAuthToken } from "@/services";
import { Users, Utensils } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();

  const handleFindMeals = () => {
    const token = getAuthToken();
    if (token) {
      navigate("/explore");
    } else {
      navigate("/login");
    }
  };

  const handleBecomeChef = () => {
    const token = getAuthToken();
    if (token) {
      navigate("/create-event");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative py-12 grow">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Main Heading - Mobile Optimized */}
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-red-200 text-transparent bg-clip-text">
              Find student chefs
            </span>
          </h1>

          {/* Subheading - Responsive Text */}
          <p className="text-lg lg:text-2xl text-muted-foreground mx-auto max-w-2xl px-4">
            Connect to College Students Cooking Near You
          </p>

          {/* Body Copy - Shorter on Mobile */}
          <p className="text-base text-muted-foreground max-w-xl mx-auto px-4">
            Student chefs host group meals and share cultural experiences.
          </p>

          {/* CTA Buttons - Stacked on Mobile, Side-by-Side on Desktop */}
          <div className="w-full max-w-md mx-auto px-4 pt-4 md:pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Primary CTA - Full Width on Mobile */}
              <Button
                size="lg"
                variant="default"
                className="w-full lg:flex-1 text-base"
                onClick={handleBecomeChef}
              >
                <Users className="mr-2 h-5 w-5" />
                Start hosting meals
              </Button>

              {/* Secondary CTA - Full Width on Mobile */}
              <Button
                size="lg"
                variant="outline"
                className="w-full lg:flex-1 text-base"
                onClick={handleFindMeals}
              >
                <Utensils className="mr-2 h-5 w-5" />
                Find Meals
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
