import { useState, useCallback } from "react";
import { getEvents, getMyEvents, getJoinedEvents, joinEvent as joinEventApi } from "@/services";
import { Event } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface UseEventsReturn {
  allEvents: Event[];
  myEvents: Event[];
  joinedEvents: Event[];
  loading: boolean;
  error: Error | null;
  loadAllEvents: () => Promise<void>;
  loadMyEvents: () => Promise<void>;
  loadJoinedEvents: () => Promise<void>;
  joinEvent: (eventId: string) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

export function useEvents(): UseEventsReturn {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadAllEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await getEvents();
      setAllEvents(events);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to load events");
      setError(error);
      console.error("Error loading all events:", err);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadMyEvents = useCallback(async () => {
    try {
      const events = await getMyEvents();
      setMyEvents(events);
    } catch (err) {
      console.error("Error loading my events:", err);
      // Don't show error toast for unauthenticated requests
      setMyEvents([]);
    }
  }, []);

  const loadJoinedEvents = useCallback(async () => {
    try {
      const events = await getJoinedEvents();
      setJoinedEvents(events);
    } catch (err) {
      console.error("Error loading joined events:", err);
      // Don't show error toast for unauthenticated requests
      setJoinedEvents([]);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAllEvents(),
        loadMyEvents(),
        loadJoinedEvents(),
      ]);
    } catch (err) {
      console.error("Error refreshing events:", err);
    } finally {
      setLoading(false);
    }
  }, [loadAllEvents, loadMyEvents, loadJoinedEvents]);

  const joinEvent = useCallback(
    async (eventId: string) => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please log in to join events.",
          variant: "destructive",
        });
        return;
      }

      try {
        setLoading(true);
        await joinEventApi({ event_id: eventId, user_id: userId });

        toast({
          title: "Success",
          description: "You have successfully joined the event!",
        });

        // Refresh all event lists to reflect the change
        await refreshAllData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to join event";

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });

        console.error("Error joining event:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast, refreshAllData]
  );

  return {
    allEvents,
    myEvents,
    joinedEvents,
    loading,
    error,
    loadAllEvents,
    loadMyEvents,
    loadJoinedEvents,
    joinEvent,
    refreshAllData,
  };
}
