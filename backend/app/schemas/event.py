from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    recipe: str
    max_participants: int = 5
    category: str
    location: Optional[str] = None
    scheduled_date: datetime

class EventCreate(EventBase):
    pass

class EventJoin(BaseModel):
    event_id: int

class EventResponse(EventBase):
    id: int
    current_participants: int
    created_at: datetime
    creator_id: int
    
    class Config:
        from_attributes = True

class EventWithParticipants(EventResponse):
    participants: List[dict] = []
