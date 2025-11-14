import { Event } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Clock, MapPin, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  activeTab: string;
  onJoinEvent?: (eventId: string) => void;
}

export function EventCard({ event, activeTab, onJoinEvent }: EventCardProps) {
  return (
    <Card
      key={event.id}
      className="flex flex-col over:shadow-lg transition-shadow min-w-[85vw] lg:min-w-0"
    >
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">🍳</div>
            <p className="text-sm text-muted-foreground">Culinary Event</p>
          </div>
        )}
        {/* Price Badge - Top Right */}
        {event.price !== undefined && event.price !== null && (
          <div className="absolute top-3 right-3">
            <div className="bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-md">
              <span className="text-lg font-bold text-primary">${event.price.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="flex flex-col justify-between flex-grow p-4">
        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          {formatDate(event.event_date)}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          {event.location}
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2" />
          {event.current_participants}/{event.max_participants} participants
        </div>
        {activeTab === "all" && onJoinEvent && (
          <Button
            className="mx-4 mt-8"
            onClick={() => onJoinEvent(event.id)}
            disabled={event.current_participants >= event.max_participants}
          >
            {event.current_participants >= event.max_participants ? "Event Full" : "Join Event"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
