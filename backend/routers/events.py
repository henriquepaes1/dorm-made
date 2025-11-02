from fastapi import APIRouter, Depends, File, UploadFile, Form
from typing import List, Annotated, Optional
from pydantic import BaseModel
from schemas.event import Event, EventCreate
from schemas.event_participant import EventParticipant
from utils.auth import get_current_user_id

router = APIRouter(prefix="/events", tags=["events"])

class JoinEventRequest(BaseModel):
    event_id: str

@router.post("/", response_model=Event)
async def create_event(
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    max_participants: Annotated[int, Form()],
    location: Annotated[str, Form()],
    event_date: Annotated[str, Form()],
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    image: Annotated[Optional[UploadFile], File()] = None
):
    """Create a new culinary event with optional image upload"""
    from services.event_service import create_event

    # Construct EventCreate object from form data
    event_data = EventCreate(
        title=title,
        description=description,
        max_participants=max_participants,
        location=location,
        event_date=event_date
    )

    return await create_event(event_data, current_user_id, image)

@router.post("/join/")
async def join_event(
    join_request: JoinEventRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """Join an existing event"""
    from services.event_service import join_event
    # Create the full request with authenticated user ID
    full_request = {
        "user_id": current_user_id,
        "event_id": join_request.event_id
    }
    return await join_event(full_request)

@router.get("/", response_model=List[Event])
async def list_events():
    """List all available events"""
    from services.event_service import list_events
    return await list_events()

@router.get("/{event_id}", response_model=Event)
async def get_event_details(event_id: str):
    """Get details of a specific event"""
    from services.event_service import get_event_details
    return await get_event_details(event_id)

@router.get("/{event_id}/participants", response_model=List[EventParticipant])
async def get_event_participants(event_id: str):
    """Get all participants for a specific event"""
    from services.event_service import get_event_participants
    return await get_event_participants(event_id)