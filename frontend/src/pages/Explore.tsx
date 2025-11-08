import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/events/EventCard";

export default function Explore() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const {
    allEvents,
    myEvents,
    joinedEvents,
    loading,
    refreshAllData,
    joinEvent: handleJoinEvent,
  } = useEvents();

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (e) {
        console.error("Error parsing currentUser:", e);
      }
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

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
    <div className="bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Meals</h1>
            <p className="text-lg text-muted-foreground">
              Discover amazing cultural dining experiences near your campus
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mx-auto lg:mx-16 mb-8">
            <TabsTrigger value="all">All Meals</TabsTrigger>
            <TabsTrigger value="my">My Meals</TabsTrigger>
            <TabsTrigger value="joined">Joined Meals</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="flex overflow-x-auto gap-4 pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible">
              {allEvents.length === 0 ? (
                <div className="col-span-full text-center py-12 w-full">
                  <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                  <p className="text-muted-foreground">Be the first to host a culinary event!</p>
                </div>
              ) : (
                allEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    activeTab={activeTab}
                    onJoinEvent={handleJoinEvent}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="my">
            <div className="flex overflow-x-auto gap-4 pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible">
              {myEvents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No events created yet</h3>
                  <p className="text-muted-foreground">
                    Create your first culinary event to get started!
                  </p>
                </div>
              ) : (
                myEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    activeTab={activeTab}
                    onJoinEvent={handleJoinEvent}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="joined">
            <div className="flex overflow-x-auto gap-4 pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible">
              {joinedEvents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No joined events yet</h3>
                  <p className="text-muted-foreground">Join some events to see them here!</p>
                </div>
              ) : (
                joinedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    activeTab={activeTab}
                    onJoinEvent={handleJoinEvent}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
