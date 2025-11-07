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
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Main Heading */}
          <h1 className="text-6xl font-bold tracking-tight mt-8">
            <span className="bg-gradient-to-r from-primary to-red-200 text-transparent bg-clip-text">
              Find student chefs
            </span>
          </h1>
          <p className="text-2xl text-muted-foreground mx-auto">
            Connect to College Students Cooking Near You
          </p>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Student chefs host group meals and share cultural experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="default"
              className="min-w-[180px]"
              onClick={handleBecomeChef}
            >
              <Users className="mr-2 h-5 w-5" />
              <Link to={`/login`}>Start hosting meals</Link>
            </Button>
            <Button size="lg" variant="outline" className="min-w-[180px]" onClick={handleFindMeals}>
              <Utensils className="mr-2 h-5 w-5" />
              Find Meals
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
