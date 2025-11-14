from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class EventBase(BaseModel):
    meal_id: str
    title: str
    description: str
    max_participants: int
    location: str
    price: Optional[float] = None

class EventCreate(EventBase):
    event_date: str  # Accept as string from frontend

class Event(EventBase):
    id: str
    host_user_id: str
    current_participants: int
    event_date: datetime  # Store as datetime
    created_at: datetime
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)