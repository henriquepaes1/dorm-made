from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from utils.database import Base
import uuid


class EventParticipantModel(Base):
    __tablename__ = "events_participants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String, ForeignKey("events.id"), nullable=False, index=True)
    participant_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)