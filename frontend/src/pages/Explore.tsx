import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Users } from "lucide-react";
import { getEvents, joinEvent, getMyEvents, getJoinedEvents } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/services/api";

export default function Explore() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    loadAllEvents();
  }, []);

  const loadAllEvents = async () => {
    try {
      setLoading(true);
      const [allEventsData, myEventsData, joinedEventsData] = await Promise.all([
        getEvents(),
        getMyEvents(),
        getJoinedEvents()
      ]);
      
      setAllEvents(allEventsData);
      setMyEvents(myEventsData);
      setJoinedEvents(joinedEventsData);
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
      loadAllEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to join event",
        variant: "destructive"
      });
    }
  };

  const getCurrentEvents = () => {
    switch (activeTab) {
      case "my":
        return myEvents;
      case "joined":
        return joinedEvents;
      default:
        return allEvents;
    }
  };

  const currentEvents = getCurrentEvents();

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

  const renderEventCard = (event: Event) => (
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

        {activeTab === "all" && (
          <Button 
            className="w-full"
            onClick={() => handleJoinEvent(event.id)}
            disabled={event.current_participants >= event.max_participants}
          >
            {event.current_participants >= event.max_participants ? 'Event Full' : 'Join Event'}
          </Button>
        )}
      </CardContent>
    </Card>
  );

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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all">All Meals</TabsTrigger>
            <TabsTrigger value="my">My Meals</TabsTrigger>
            <TabsTrigger value="joined">Joined Meals</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allEvents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                  <p className="text-muted-foreground">Be the first to host a culinary event!</p>
                </div>
              ) : (
                allEvents.map(renderEventCard)
              )}
            </div>
          </TabsContent>

          <TabsContent value="my">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {myEvents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No events created yet</h3>
                  <p className="text-muted-foreground">Create your first culinary event to get started!</p>
                </div>
              ) : (
                myEvents.map(renderEventCard)
              )}
            </div>
          </TabsContent>

          <TabsContent value="joined">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {joinedEvents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No joined events yet</h3>
                  <p className="text-muted-foreground">Join some events to see them here!</p>
                </div>
              ) : (
                joinedEvents.map(renderEventCard)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}