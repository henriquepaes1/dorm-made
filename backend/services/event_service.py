from fastapi import HTTPException, UploadFile
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from models.event import EventModel
from models.event_participant import EventParticipantModel
from schemas.event import Event, EventCreate
from schemas.event_participant import EventParticipant
from utils.converters import (
    event_model_to_schema,
    event_models_to_schemas,
    event_participant_models_to_schemas
)
from utils.supabase import supabase
from .user_service import get_user


def get_event(event_id: str, db: Session) -> Optional[Event]:
    """Get event by ID from database"""
    try:
        event_model = db.query(EventModel).filter(EventModel.id == event_id).first()
        if event_model:
            return event_model_to_schema(event_model)
        return None
    except Exception as e:
        print(f"Error getting event: {e}")
        return None


def is_user_participating(event_id: str, user_id: str, db: Session) -> bool:
    """Check if user is already participating in an event"""
    try:
        participant = db.query(EventParticipantModel).filter(
            EventParticipantModel.event_id == event_id,
            EventParticipantModel.participant_id == user_id
        ).first()
        return participant is not None
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


async def create_event(event: EventCreate, host_user_id: str, db: Session, image: Optional[UploadFile] = None) -> Event:
    """Create a new culinary event with optional image upload"""
    # Verify host user exists
    host = await get_user(host_user_id, db)
    if not host:
        raise HTTPException(status_code=404, detail="Host user not found")

    try:
        # Upload image if provided
        image_url = None
        if image and image.filename:
            image_url = await upload_event_image(image)

        # Convert string event_date to datetime if needed
        event_date = event.event_date
        if isinstance(event_date, str):
            event_date = datetime.fromisoformat(event.event_date.replace('Z', '+00:00'))

        # Create new event model
        event_model = EventModel(
            id=str(uuid.uuid4()),
            host_user_id=str(host_user_id),
            title=event.title,
            description=event.description,
            max_participants=event.max_participants,
            current_participants=0,
            location=event.location,
            event_date=event_date,
            image_url=image_url,
            price=event.price
        )

        db.add(event_model)
        db.commit()
        db.refresh(event_model)

        return event_model_to_schema(event_model)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating event: {str(e)}")


async def join_event(join_request: Dict[str, Any], db: Session) -> Dict[str, str]:
    """Join an existing event"""
    user_id = join_request["user_id"] if isinstance(join_request, dict) else join_request.user_id
    event_id = join_request["event_id"] if isinstance(join_request, dict) else join_request.event_id

    # Verify user exists
    user = await get_user(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify event exists
    event = get_event(event_id, db)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if user is already the host
    if event.host_user_id == str(user_id):
        raise HTTPException(status_code=400, detail="Host cannot join their own event")

    # Check if user is already participating
    if is_user_participating(event_id, user_id, db):
        raise HTTPException(status_code=400, detail="User is already participating in this event")

    # Check if event is full
    if event.current_participants >= event.max_participants:
        raise HTTPException(status_code=400, detail="Event is full")

    try:
        # Add participant to events_participants table
        participant_model = EventParticipantModel(
            id=str(uuid.uuid4()),
            event_id=event_id,
            participant_id=user_id
        )

        db.add(participant_model)

        # Update event participants count
        event_model = db.query(EventModel).filter(EventModel.id == event_id).first()
        if event_model:
            event_model.current_participants += 1
            db.commit()
            return {"message": "Successfully joined the event", "event_id": event_id}
        else:
            db.rollback()
            raise HTTPException(status_code=400, detail="Failed to update participant count")
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error joining event: {str(e)}")


async def list_events(db: Session) -> List[Event]:
    """List all available events"""
    try:
        event_models = db.query(EventModel).all()
        return event_models_to_schemas(event_models)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching events: {str(e)}")


async def get_event_details(event_id: str, db: Session) -> Event:
    """Get details of a specific event"""
    event = get_event(event_id, db)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


async def get_event_participants(event_id: str, db: Session) -> List[EventParticipant]:
    """Get all participants for an event"""
    try:
        participant_models = db.query(EventParticipantModel).filter(
            EventParticipantModel.event_id == event_id
        ).all()
        return event_participant_models_to_schemas(participant_models)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching participants: {str(e)}")


async def get_user_events(user_id: str, db: Session) -> List[Event]:
    """Get all events created by a specific user"""
    try:
        event_models = db.query(EventModel).filter(
            EventModel.host_user_id == user_id
        ).all()
        return event_models_to_schemas(event_models)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching user events: {str(e)}")


async def get_user_joined_events(user_id: str, db: Session) -> List[Event]:
    """Get all events that a user has joined"""
    try:
        # First get all event IDs that the user has joined
        participant_models = db.query(EventParticipantModel).filter(
            EventParticipantModel.participant_id == user_id
        ).all()

        if not participant_models:
            return []

        event_ids = [participant.event_id for participant in participant_models]

        # Then get the full event details for those events
        event_models = db.query(EventModel).filter(EventModel.id.in_(event_ids)).all()
        return event_models_to_schemas(event_models)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching joined events: {str(e)}")