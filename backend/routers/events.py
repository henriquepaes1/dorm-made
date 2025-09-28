from fastapi import APIRouter
from typing import List
from pydantic import BaseModel
from schemas.event import Event, EventCreate

router = APIRouter(prefix="/events", tags=["events"])

class JoinEventRequest(BaseModel):
    user_id: int
    event_id: int

@router.post("/", response_model=Event)
async def create_event(event: EventCreate):
    """Create a new culinary event"""
    from services.event_service import create_event
    return await create_event(event)

@router.post("/join/")
async def join_event(join_request: JoinEventRequest):
    """Join an existing event"""
    from services.event_service import join_event
    return await join_event(join_request)

@router.get("/", response_model=List[Event])
async def list_events():
    """List all available events"""
    from services.event_service import list_events
    return await list_events()

@router.get("/{event_id}", response_model=Event)
async def get_event_details(event_id: int):
    """Get details of a specific event"""
    from services.event_service import get_event_details
    return await get_event_details(event_id)