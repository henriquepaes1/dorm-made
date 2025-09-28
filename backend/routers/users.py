from fastapi import APIRouter
from typing import List
from schemas.user import User, UserCreate, UserLogin, Token, LoginResponse
from schemas.event import Event

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=User)
async def create_user(user: UserCreate):
    """Create a new user"""
    from services.user_service import create_user
    return await create_user(user)

@router.post("/login", response_model=LoginResponse)
async def login(login_data: UserLogin):
    """Authenticate user and return JWT token"""
    from services.user_service import authenticate_user
    return await authenticate_user(login_data)

@router.get("/{user_id}/events", response_model=List[Event])
async def get_user_events(user_id: int):
    """Get all events created by a specific user"""
    from services.event_service import get_user_events
    return await get_user_events(user_id)