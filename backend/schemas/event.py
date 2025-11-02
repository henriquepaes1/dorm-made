from pydantic import BaseModel
from datetime import datetime
from typing import Union, Optional

class EventBase(BaseModel):
    title: str
    description: str
    max_participants: int
    location: str
    image_url: Optional[str] = None

class EventCreate(EventBase):
    event_date: str  # Accept as string from frontend

class Event(EventBase):
    id: str
    host_user_id: str
    current_participants: int
    event_date: datetime  # Store as datetime
    created_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }