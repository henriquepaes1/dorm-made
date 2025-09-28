import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, Utensils, Star } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse meals by cuisine, location, or chef. Find authentic cultural experiences near your campus.",
    color: "text-primary"
  },
  {
    icon: Calendar,
    title: "Reserve",
    description: "Book your spot at a meal that interests you. Pay securely and get instant confirmation.",
    color: "text-accent-foreground"
  },
  {
    icon: Utensils,
    title: "Experience",
    description: "Join fellow students for an amazing meal. Share stories, make friends, and taste new cultures.",
    color: "text-primary"
  },
  {
    icon: Star,
    title: "Review",
    description: "Rate your experience and help build our community of trusted chefs and friendly foodies.",
    color: "text-accent-foreground"
  }
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Dorm Made Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our food community in four simple steps and start sharing cultural experiences today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="text-center relative overflow-hidden group hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`h-8 w-8 ${step.color}`} />
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}