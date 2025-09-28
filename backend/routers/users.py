from fastapi import APIRouter, Depends
from typing import List, Annotated
from schemas.user import User, UserCreate, UserLogin, Token
from schemas.event import Event
from utils.auth import get_current_user_id

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=User)
async def create_user(user: UserCreate):
    """Create a new user"""
    from services.user_service import create_user
    return await create_user(user)

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    """Authenticate user and return JWT token"""
    from services.user_service import authenticate_user
    return await authenticate_user(login_data)

@router.get("/me/events", response_model=List[Event])
async def get_my_events(current_user_id: Annotated[int, Depends(get_current_user_id)]):
    """Get all events created by the authenticated user"""
    from services.event_service import get_user_events
    return await get_user_events(current_user_id)