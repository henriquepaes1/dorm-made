from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.event import EventCreate, EventResponse, EventJoin, EventWithParticipants
from app.services.event_service import EventService
from app.routers.auth import oauth2_scheme
from app.utils.security import verify_token
from app.models.user import User

router = APIRouter(prefix="/events", tags=["events"])

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    email = verify_token(token, credentials_exception)
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/create", response_model=EventResponse)
def create_event(
    event: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event_service = EventService(db)
    return event_service.create_event(event, current_user.id)

@router.post("/join", response_model=EventResponse)
def join_event(
    event_join: EventJoin,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event_service = EventService(db)
    return event_service.join_event(event_join.event_id, current_user.id)

@router.get("/", response_model=list[EventResponse])
def get_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    event_service = EventService(db)
    return event_service.get_events(skip, limit)

@router.get("/{event_id}", response_model=EventWithParticipants)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event_service = EventService(db)
    return event_service.get_event(event_id)
