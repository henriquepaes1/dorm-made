import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Users, Star, Heart } from "lucide-react";
import { useState } from "react";

interface MealCardProps {
  meal: {
    id: string;
    title: string;
    description: string;
    price?: number;
    image: string;
    chef: {
      name: string;
      avatar: string;
      rating: number;
    };
    cuisine: string;
    datetime: string;
    location: string;
    maxGuests: number;
    availableSpots: number;
    tags: string[];
  };
}

export function MealCard({ meal }: MealCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-elegant hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={meal.image}
            alt={meal.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Top Right: Price Badge (priority) and Favorite Button */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            {/* Price Badge - Top Right (Priority) */}
            {meal.price !== undefined && meal.price !== null && (
              <div className="bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-md">
                <span className="text-lg font-bold text-primary">
                  ${meal.price.toFixed(2)}
                </span>
              </div>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur">
              {meal.cuisine}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{meal.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2">{meal.description}</p>
          </div>

          {/* Chef Info */}
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={meal.chef.avatar} alt={meal.chef.name} />
              <AvatarFallback>{meal.chef.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{meal.chef.name}</p>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">{meal.chef.rating}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{meal.datetime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{meal.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{meal.availableSpots} of {meal.maxGuests} spots left</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {meal.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        {meal.price !== undefined && meal.price !== null ? (
          <div className="text-lg font-bold text-primary">
            ${meal.price.toFixed(2)}
          </div>
        ) : (
          <div className="text-lg font-bold text-muted-foreground">
            Free
          </div>
        )}
        <Button size="sm" className="bg-gradient-to-r from-primary to-primary-glow">
          Reserve Now
        </Button>
      </CardFooter>
    </Card>
  );
}