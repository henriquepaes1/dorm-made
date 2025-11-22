import { httpClient } from "./http-client";
import { Event, EventCreate, EventUpdate, JoinEventRequest } from "@/types";

/**
 * Event Service
 * Handles event-related API calls
 */

/**
 * Create a new event
 * Accepts either EventCreate object or FormData (for image uploads)
 */
export const createEvent = async (eventData: EventCreate | FormData): Promise<Event> => {
  // When sending FormData, axios will set Content-Type with boundary automatically
  const response = await httpClient.post("/events/", eventData);
  return response.data;
};

/**
 * Get all events
 */
export const getEvents = async (): Promise<Event[]> => {
  const response = await httpClient.get("/events/");
  return response.data;
};

/**
 * Get event by ID
 */
export const getEvent = async (eventId: string): Promise<Event> => {
  const response = await httpClient.get(`/events/${eventId}`);
  return response.data;
};

/**
 * Join an event
 */
export const joinEvent = async (
  joinData: JoinEventRequest,
): Promise<{ message: string; event_id: string }> => {
  const response = await httpClient.post("/events/join/", joinData);
  return response.data;
};

/**
 * Get events created by the current user
 */
export const getMyEvents = async (): Promise<Event[]> => {
  const response = await httpClient.get("/events/me");
  return response.data;
};

/**
 * Get events that the current user has joined
 */
export const getJoinedEvents = async (): Promise<Event[]> => {
  const response = await httpClient.get("/events/me/joined");
  return response.data;
};

/**
 * Get events created by a specific user (for public profiles)
 */
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  const response = await httpClient.get("/events/", {
    params: { user_id: userId }
  });
  return response.data;
};

/**
 * Update an event
 * Only the event host can update
 */
export const updateEvent = async (
  eventId: string,
  eventData: EventUpdate,
): Promise<Event> => {
  const response = await httpClient.put(`/events/${eventId}`, eventData);
  return response.data;
};

/**
 * Delete an event (soft delete)
 * Only the event host can delete
 */
export const deleteEvent = async (
  eventId: string,
): Promise<{ message: string; event_id: string }> => {
  const response = await httpClient.delete(`/events/${eventId}`);
  return response.data;
};
