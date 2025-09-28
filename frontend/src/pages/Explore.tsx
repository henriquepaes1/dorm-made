import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { MealCard } from "@/components/meals/MealCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, MapPin, Clock, DollarSign, Users } from "lucide-react";
import { getEvents, joinEvent } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/services/api";

const POPULAR_CUISINES = [
  "All", "Thai", "Italian", "Korean", "Mexican", "Japanese", "Indian", "Chinese", "American", "Mediterranean"
];

export default function Explore() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedTime, setSelectedTime] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      toast({
        title: "Please Sign In",
        description: "You need to sign in to join events",
        variant: "destructive"
      });
      return;
    }

    try {
      const user = JSON.parse(currentUser);
      await joinEvent({
        user_id: user.id,
        event_id: eventId
      });
      
      toast({
        title: "Success!",
        description: "You've successfully joined the event!",
      });
      
      // Refresh events to update participant count
      loadEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to join event",
        variant: "destructive"
      });
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Meals</h1>
          <p className="text-lg text-muted-foreground">
            Discover amazing cultural dining experiences near your campus
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No events yet</h3>
              <p className="text-muted-foreground">Be the first to host a culinary event!</p>
            </div>
          ) : (
            events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🍳</div>
                        <p className="text-sm text-muted-foreground">Culinary Event</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
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
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => handleJoinEvent(event.id)}
                        disabled={event.current_participants >= event.max_participants}
                      >
                        {event.current_participants >= event.max_participants ? 'Event Full' : 'Join Event'}
                      </Button>
                    </CardContent>
                  </Card>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}