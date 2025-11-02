import { Button } from "@/components/ui/button";
import { Users, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "@/services/api";

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
      navigate("/explore");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-background via-accent/20 to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Share & Taste Culture
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Connect to College Students Cooking Near You Helooooo]
            </p>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join a vibrant marketplace where student chefs host group meals
              and foodies discover authentic cultural experiences.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow min-w-[180px]"
              onClick={handleFindMeals}
            >
              <Utensils className="mr-2 h-5 w-5" />
              Find Meals
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-[180px]"
              onClick={handleBecomeChef}
            >
              <Users className="mr-2 h-5 w-5" />
              Become a Chef
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Student Chefs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">2K+</div>
              <div className="text-muted-foreground">Meals Shared</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15</div>
              <div className="text-muted-foreground">Universities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 rotate-12">
          🍝
        </div>
        <div className="absolute top-32 right-16 text-5xl opacity-10 -rotate-12">
          🍜
        </div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-10 rotate-45">
          🥘
        </div>
        <div className="absolute bottom-32 right-12 text-5xl opacity-10 -rotate-45">
          🍲
        </div>
      </div>
    </section>
  );
}
