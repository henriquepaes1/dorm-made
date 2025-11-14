from fastapi import APIRouter, Depends, File, UploadFile, Form
from typing import List, Annotated, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel

from schemas.event import Event, EventCreate
from schemas.event_participant import EventParticipant
from utils.auth import get_current_user_id
from utils.database import get_db
from services import event_service

router = APIRouter(prefix="/events", tags=["events"])

class JoinEventRequest(BaseModel):
    event_id: str

@router.post("/", response_model=Event)
async def create_event_endpoint(
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    max_participants: Annotated[int, Form()],
    location: Annotated[str, Form()],
    event_date: Annotated[str, Form()],
    meal_id: Annotated[str, Form()],
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    db: Session = Depends(get_db),
    price: Annotated[Optional[str], Form()] = None,
    image: Annotated[Optional[UploadFile], File()] = None
):
    """Create a new culinary event with optional image upload"""
    # Parse price: convert to float if provided and not empty, otherwise None
    price_float = None
    if price and str(price).strip():
        try:
            price_float = float(price)
        except (ValueError, TypeError):
            price_float = None

    # Construct EventCreate object from form data
    event_data = EventCreate(
        meal_id=meal_id,
        title=title,
        description=description,
        max_participants=max_participants,
        location=location,
        event_date=event_date,
        price=price_float
    )

    return await event_service.create_event(event_data, current_user_id, db, image)

@router.post("/join/")
async def join_event_endpoint(
    join_request: JoinEventRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    db: Session = Depends(get_db)
):
    """Join an existing event"""
    # Create the full request with authenticated user ID
    full_request = {
        "user_id": current_user_id,
        "event_id": join_request.event_id
    }
    return await event_service.join_event(full_request, db)

@router.get("/", response_model=List[Event])
async def list_events_endpoint(db: Session = Depends(get_db)):
    """List all available events"""
    return await event_service.list_events(db)

@router.get("/{event_id}", response_model=Event)
async def get_event_details_endpoint(event_id: str, db: Session = Depends(get_db)):
    """Get details of a specific event"""
    return await event_service.get_event_details(event_id, db)

@router.get("/{event_id}/participants", response_model=List[EventParticipant])
async def get_event_participants_endpoint(event_id: str, db: Session = Depends(get_db)):
    """Get all participants for a specific event"""
    return await event_service.get_event_participants(event_id, db)