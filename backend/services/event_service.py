from fastapi import HTTPException, UploadFile
from typing import List, Optional
from .user_service import get_user
from database import supabase
from schemas.event import Event, EventCreate
from schemas.event_participant import EventParticipant, EventParticipantCreate
import uuid
from datetime import datetime

def get_event(event_id: str) -> Optional[Event]:
    """Get event by ID from Supabase"""
    try:
        result = supabase.table("events").select("*").eq("id", event_id).execute()
        if result.data:
            return Event(**result.data[0])
        return None
    except Exception as e:
        print(f"Error getting event: {e}")
        return None

def is_user_participating(event_id: str, user_id: str) -> bool:
    """Check if user is already participating in an event"""
    try:
        result = supabase.table("events_participants").select("*").eq("event_id", event_id).eq("participant_id", user_id).execute()
        return len(result.data) > 0
    except Exception as e:
        print(f"Error checking participation: {e}")
        return False

async def upload_event_image(image: UploadFile) -> str:
    """Upload an event image to Supabase Storage and return the public URL"""
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if image.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WebP images are allowed.")

        # Validate file size (5MB max)
        contents = await image.read()
        if len(contents) > 5 * 1024 * 1024:  # 5MB in bytes
            raise HTTPException(status_code=400, detail="File size exceeds 5MB limit.")

        # Generate unique filename
        file_extension = image.filename.split('.')[-1] if image.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}_{int(datetime.now().timestamp())}.{file_extension}"

        # Upload to Supabase Storage
        result = supabase.storage.from_("event-images").upload(
            unique_filename,
            contents,
            {"content-type": image.content_type}
        )

        # Get public URL
        public_url = supabase.storage.from_("event-images").get_public_url(unique_filename)

        return public_url
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error uploading image: {str(e)}")

async def create_event(event: EventCreate, host_user_id: str, image: Optional[UploadFile] = None) -> Event:
    """Create a new culinary event with optional image upload"""
    # Verify host user exists
    host = get_user(host_user_id)
    if not host:
        raise HTTPException(status_code=404, detail="Host user not found")

    try:
        # Upload image if provided
        image_url = None
        if image and image.filename:
            image_url = await upload_event_image(image)

        # Convert string event_date to datetime
        event_date = datetime.fromisoformat(event.event_date.replace('Z', '+00:00'))

        event_data = event.model_dump()
        event_data["host_user_id"] = str(host_user_id)  # Add the authenticated user as host
        event_data["current_participants"] = 0  # Initialize with 0 participants
        event_data["image_url"] = image_url  # Add image URL if available

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

    # Check if user is already the host
    if event.host_user_id == str(user_id):
        raise HTTPException(status_code=400, detail="Host cannot join their own event")

    # Check if user is already participating
    if is_user_participating(event_id, user_id):
        raise HTTPException(status_code=400, detail="User is already participating in this event")

    # Check if event is full
    if event.current_participants >= event.max_participants:
        raise HTTPException(status_code=400, detail="Event is full")

    try:
        # Add participant to events_participants table
        participant_data = {
            "event_id": event_id,
            "participant_id": user_id
        }
        
        participant_result = supabase.table("events_participants").insert(participant_data).execute()
        
        if not participant_result.data:
            raise HTTPException(status_code=400, detail="Failed to add participant")

        # Update event participants count
        result = supabase.table("events").update({
            "current_participants": event.current_participants + 1
        }).eq("id", event_id).execute()

        if result.data:
            return {"message": "Successfully joined the event", "event_id": event_id}
        raise HTTPException(status_code=400, detail="Failed to update participant count")
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

async def get_event_details(event_id: str) -> Event:
    """Get details of a specific event"""
    event = get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

async def get_event_participants(event_id: str) -> List[EventParticipant]:
    """Get all participants for an event"""
    try:
        result = supabase.table("events_participants").select("*").eq("event_id", event_id).execute()
        participants = [EventParticipant(**participant) for participant in result.data]
        return participants
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching participants: {str(e)}")

async def get_user_events(user_id: str) -> List[Event]:
    """Get all events created by a specific user"""
    try:
        result = supabase.table("events").select("*").eq("host_user_id", user_id).execute()
        events = [Event(**event) for event in result.data]
        return events
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching user events: {str(e)}")

async def get_user_joined_events(user_id: str) -> List[Event]:
    """Get all events that a user has joined"""
    try:
        # First get all event IDs that the user has joined
        participants_result = supabase.table("events_participants").select("event_id").eq("participant_id", user_id).execute()
        
        if not participants_result.data:
            return []
        
        event_ids = [participant["event_id"] for participant in participants_result.data]
        
        # Then get the full event details for those events
        events_result = supabase.table("events").select("*").in_("id", event_ids).execute()
        events = [Event(**event) for event in events_result.data]
        return events
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching joined events: {str(e)}")
