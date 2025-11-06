import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "@/services/api";
import { Users } from "lucide-react";

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
    <section className="relative py-12 grow">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Main Heading */}
          <h1 className="text-6xl font-bold tracking-tight mt-8">
            <span className="bg-gradient-to-r from-primary to-red-200 text-transparent bg-clip-text">
              Share & Taste Culture
            </span>
          </h1>
          <p className="text-2xl text-muted-foreground mx-auto">
            Connect to College Students Cooking Near You
          </p>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Join a vibrant marketplace where student chefs host group meals and foodies discover
            authentic cultural experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="outline" className="min-w-[180px]">
              <Users className="mr-2 h-5 w-5" />
              Join chef community
            </Button>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 rotate-12">🍝</div>
        <div className="absolute top-32 right-16 text-5xl opacity-10 -rotate-12">🍜</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-10 rotate-45">🥘</div>
        <div className="absolute bottom-32 right-12 text-5xl opacity-10 -rotate-45">🍲</div>
      </div>
    </section>
  );
}
