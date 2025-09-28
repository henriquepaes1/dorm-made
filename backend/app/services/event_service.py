from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.event import Event
from app.models.user import User
from app.schemas.event import EventCreate, EventJoin
from typing import List

class EventService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_event(self, event: EventCreate, creator_id: int) -> Event:
        db_event = Event(
            title=event.title,
            description=event.description,
            recipe=event.recipe,
            max_participants=event.max_participants,
            category=event.category,
            location=event.location,
            scheduled_date=event.scheduled_date,
            creator_id=creator_id
        )
        
        self.db.add(db_event)
        self.db.commit()
        self.db.refresh(db_event)
        return db_event
    
    def join_event(self, event_id: int, user_id: int) -> Event:
        event = self.db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check if user is already participating
        if user in event.participants:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already participating in this event"
            )
        
        # Check if event is full
        if event.current_participants >= event.max_participants:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event is full"
            )
        
        # Add user to event
        event.participants.append(user)
        event.current_participants += 1
        
        self.db.commit()
        self.db.refresh(event)
        return event
    
    def get_events(self, skip: int = 0, limit: int = 100) -> List[Event]:
        return self.db.query(Event).offset(skip).limit(limit).all()
    
    def get_event(self, event_id: int) -> Event:
        event = self.db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        return event
