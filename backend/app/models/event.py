from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# Association table for many-to-many relationship between events and participants
event_participants = Table(
    "event_participants",
    Base.metadata,
    Column("event_id", Integer, ForeignKey("events.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True)
)

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    recipe = Column(Text, nullable=False)
    max_participants = Column(Integer, nullable=False, default=5)
    current_participants = Column(Integer, default=0)
    category = Column(String, nullable=False)  # french, italian, gluten-free, etc.
    location = Column(String, nullable=True)
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    creator = relationship("User", back_populates="created_events", foreign_keys=[creator_id])
    participants = relationship("User", back_populates="joined_events", secondary=event_participants)
