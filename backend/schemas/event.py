from pydantic import BaseModel
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: str
    max_participants: int
    event_date: datetime
    location: str

class EventCreate(EventBase):
    host_user_id: str

class Event(EventBase):
    id: str
    host_user_id: str
    current_participants: int
    created_at: datetime
    
    class Config:
        from_attributes = True