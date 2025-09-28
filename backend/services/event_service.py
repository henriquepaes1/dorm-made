from fastapi import HTTPException
from typing import List, Optional
from .user_service import get_user
from database import supabase
from schemas.event import Event, EventCreate

def get_event(event_id: int) -> Optional[Event]:
    """Get event by ID from Supabase"""
    try:
        result = supabase.table("events").select("*").eq("id", event_id).execute()
        if result.data:
            return Event(**result.data[0])
        return None
    except Exception as e:
        print(f"Error getting event: {e}")
        return None

async def create_event(event: EventCreate, host_user_id: int) -> Event:
    """Create a new culinary event"""
    # Verify host user exists
    host = get_user(host_user_id)
    if not host:
        raise HTTPException(status_code=404, detail="Host user not found")

    try:
        event_data = event.model_dump()
        event_data["host_user_id"] = str(host_user_id)  # Add the authenticated user as host
        event_data["current_participants"] = 0  # Initialize with 0 participants

        result = supabase.table("events").insert(event_data).execute()
        if result.data:
            return Event(**result.data[0])
        raise HTTPException(status_code=400, detail="Failed to create event")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating event: {str(e)}")

async def join_event(join_request) -> dict:
    """Join an existing event"""
    user_id = join_request["user_id"] if isinstance(join_request, dict) else join_request.user_id
    event_id = join_request["event_id"] if isinstance(join_request, dict) else join_request.event_id

    # Verify user exists
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify event exists
    event = get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if event is full
    if event.current_participants >= event.max_participants:
        raise HTTPException(status_code=400, detail="Event is full")

    # Check if user is already the host
    if event.host_user_id == str(user_id):
        raise HTTPException(status_code=400, detail="Host cannot join their own event")

    try:
        # Update event participants count
        result = supabase.table("events").update({
            "current_participants": event.current_participants + 1
        }).eq("id", event_id).execute()

        if result.data:
            return {"message": "Successfully joined the event", "event_id": event_id}
        raise HTTPException(status_code=400, detail="Failed to join event")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error joining event: {str(e)}")

async def list_events() -> List[Event]:
    """List all available events"""
    try:
        result = supabase.table("events").select("*").execute()
        events = [Event(**event) for event in result.data]
        return events
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching events: {str(e)}")

async def get_event_details(event_id: int) -> Event:
    """Get details of a specific event"""
    event = get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

async def get_user_events(user_id: int) -> List[Event]:
    """Get all events created by a specific user"""
    try:
        result = supabase.table("events").select("*").eq("host_user_id", user_id).execute()
        events = [Event(**event) for event in result.data]
        return events
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching user events: {str(e)}")