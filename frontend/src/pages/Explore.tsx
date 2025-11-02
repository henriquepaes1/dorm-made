import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Users, User as UserIcon } from "lucide-react";
import { getEvents, joinEvent, getMyEvents, getJoinedEvents, searchUsers, User as UserType } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/services/api";
import { useSearchParams, Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Explore() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    loadAllEvents();
    
    // Se houver query de busca, buscar usuários
    if (searchQuery && searchQuery.trim().length >= 2) {
      setActiveTab("users");
      performUserSearch(searchQuery.trim());
    }
  }, [searchQuery]);

  const performUserSearch = async (query: string) => {
    try {
      setSearchLoading(true);
      const results = await searchUsers(query, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar usuários",
        variant: "destructive"
      });
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const loadAllEvents = async () => {
    try {
      setLoading(true);
      
      // getEvents() não requer autenticação, então sempre chama
      const allEventsData = await getEvents();
      setAllEvents(allEventsData);
      
      // getMyEvents() e getJoinedEvents() requerem autenticação
      // Se falharem, apenas não carrega esses dados, mas não bloqueia a página
      try {
        const myEventsData = await getMyEvents();
        setMyEvents(myEventsData);
      } catch (error: any) {
        console.log('Could not load my events (may not be authenticated):', error.message);
        setMyEvents([]);
      }
      
      try {
        const joinedEventsData = await getJoinedEvents();
        setJoinedEvents(joinedEventsData);
      } catch (error: any) {
        console.log('Could not load joined events (may not be authenticated):', error.message);
        setJoinedEvents([]);
      }
    } catch (error) {
      console.error('Error loading events:', error);
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderEventCard = (event: Event) => (
    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">🍳</div>
            <p className="text-sm text-muted-foreground">Culinary Event</p>
          </div>
        )}
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
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Resultados da busca para: <span className="font-semibold">{searchQuery}</span>
            </p>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All Meals</TabsTrigger>
            <TabsTrigger value="my">My Meals</TabsTrigger>
            <TabsTrigger value="joined">Joined Meals</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
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

          <TabsContent value="users">
            {searchLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Buscando usuários...</p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((user) => (
                  <Card key={user.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Link to={`/profile/${user.id}`} className="flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-4 border-4 border-background shadow-lg">
                          {user.profile_picture ? (
                            <AvatarImage 
                              src={user.profile_picture} 
                              alt={user.name}
                            />
                          ) : null}
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-lg mb-2">{user.name}</h3>
                        {user.university && (
                          <div className="flex items-center justify-center text-sm text-muted-foreground mb-2">
                            <UserIcon className="h-4 w-4 mr-2" />
                            <span>{user.university}</span>
                          </div>
                        )}
                        {user.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {user.description}
                          </p>
                        )}
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
                <p className="text-muted-foreground">
                  Tente buscar com outros termos
                </p>
              </div>
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Busque por usuários</h3>
                <p className="text-muted-foreground">
                  Use a barra de busca no topo para encontrar usuários
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}